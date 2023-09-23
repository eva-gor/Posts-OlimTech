import { Box, Grid, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import HeaderForm from "../forms/HeaderForm";
import AddUpdatePostForm from "../forms/AddUpdatePostForm";
import { useSelectorPostsByPage } from "../../hooks/hooks";
import ThumbnailCardForm from "../forms/ThumbnailCardForm";

const Home: React.FC = () => {
    const [pkRes, setPkRes] = useState<{ page: number, keyword: string }>({ page: 1, keyword: '' });
    const [openAddPostForm, setOpenAddPostForm] = useState<boolean>(false);
    const allPosts = useSelectorPostsByPage(pkRes.page, pkRes.keyword);
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[pkRes.page]);
    useEffect(()=>{
        setPkRes({...pkRes, page: 1});
    }, [pkRes.keyword])

    function getThumbnails() {
        return Array.isArray(allPosts.result) ? allPosts.result.map(post => <Grid item xs={12} lg={6} xl={4}><ThumbnailCardForm post={post} /></Grid>) : [];
    }
    return <Box width='100%' sx={{ textAlign: "center" }} key='hpBox'paddingBottom='50px' >
        <HeaderForm getKeyword={keyword => setPkRes({ ...pkRes, keyword })} setOpenAddPostForm={() => setOpenAddPostForm(true)} />
        <AddUpdatePostForm openDialog={openAddPostForm} goBack={() => setOpenAddPostForm(false)} />
        {getThumbnails() && getThumbnails().length === 0 ? <label style={{ textAlign: 'center', color: 'lightgrey', fontSize: '3rem', marginTop: '10vh', fontFamily: 'cursive' }}>No items</label> :
            <Grid container spacing={2}>
                {getThumbnails()}
            </Grid>
        }
        <div style={{ width: '100%', zIndex: 100, position: 'fixed',  bottom: '0px', display: 'flex', justifyContent: 'center', backgroundColor: 'white'}}>
            <Pagination count={allPosts.totalPages} color="secondary" page={pkRes.page} onChange={(event: React.ChangeEvent<any>, page: number) => setPkRes({ ...pkRes, page })} />
        </div>
    </Box>
}
export default Home;