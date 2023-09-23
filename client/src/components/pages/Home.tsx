import { Box, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import HeaderForm from "../forms/HeaderForm";
import AddUpdatePostForm from "../forms/AddUpdatePostForm";
import { useDispatchCode, useSelectorPostsByPage } from "../../hooks/hooks";
import PostType from "../model/PostType";
import { postService } from "../../config/service-config";
import GetPostsByPageType from "../model/GetPostsByPageType";
import ThumbnailCardForm from "../forms/ThumbnailCardForm";
import Pagination from '@mui/material/Pagination';


const Home: React.FC = () => {
    const [pkRes, setPkRes] = useState<{ page: number, keyword: string }>({ page: 1, keyword: '' });
    const [openAddPostForm, setOpenAddPostForm] = useState<boolean>(false);
    const allPosts = useSelectorPostsByPage(pkRes.page, pkRes.keyword);

    function getThumbnails() {
        return Array.isArray(allPosts.result) ? allPosts.result.map(post => <Grid item xs={12} lg={6} xl={4}><ThumbnailCardForm post={post} /></Grid>) : [];
    }
    return <Box width='100%' sx={{ textAlign: "center" }} key='hpBox'>
        <HeaderForm getKeyword={keyword => setPkRes({ ...pkRes, keyword })} setOpenAddPostForm={() => setOpenAddPostForm(true)} />
        <AddUpdatePostForm openDialog={openAddPostForm} goBack={() => setOpenAddPostForm(false)} />
        {getThumbnails() && getThumbnails().length === 0 ? <label style={{ textAlign: 'center', color: 'lightgrey', fontSize: '3rem', marginTop: '10vh', fontFamily: 'cursive' }}>No items</label> :
            <Grid container spacing={2}>
                {getThumbnails()}
            </Grid>
        }

        {/* <Pagination count={postsInfo.totalPages} color="secondary" />   */}
    </Box>
}
export default Home;