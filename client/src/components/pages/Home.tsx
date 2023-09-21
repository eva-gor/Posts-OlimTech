import { Box, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import HeaderForm from "../forms/HeaderForm";
import SpeedDialForm from "../forms/SpeedDialForm";
import AddPostForm from "../forms/AddPostForm";
import { useDispatchCode, useSelectorPostsByPage } from "../../hooks/hooks";
import PostType from "../model/PostType";
import { postService } from "../../config/service-config";
import GetPostsByPageType from "../model/GetPostsByPageType";
import ThumbnailCardForm from "../forms/ThumbnailCardForm";
import Pagination from '@mui/material/Pagination';

const POSTS_PER_PAGE = 9;
function getSlice(page: number, array: PostType[]): GetPostsByPageType {
    const total = array.length;
    const totalPages = Math.ceil(total / POSTS_PER_PAGE);
    const result = array.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
    return { total, totalPages, page, result };
}

const Home: React.FC = () => {
    const [pkRes, setPkRes] = useState<{ page: number, keyword: string}>({ page: 1, keyword: '' });
    const [openAddPostForm, setOpenAddPostForm] = useState<boolean>(false);
    const allPosts = useSelectorPostsByPage(pkRes.page);
    const dispatch = useDispatchCode();
    const searchResult = useRef<PostType[]>([]);
    const result = useRef<PostType[]>(allPosts.result);
    useEffect(() => {
        const set = async () => {
            setPkRes({ ...pkRes, page: 1 });
            try {
                if (pkRes.keyword) {
                    searchResult.current = await postService.searchByKeyword(pkRes.keyword);
                    result.current = getSlice(pkRes.page, searchResult.current).result;
                    // setPkRes({ ...pkRes, result: getSlice(pkRes.page, searchResult.current).result });
                } else {
                    result.current = allPosts.result;
                    // setPkRes({ ...pkRes, result: [...allPosts.result] });
                }
            } catch (e: any) {
                dispatch(typeof e === 'string' ? e : 'Searching by keyword failed', '');
            }
        }
        set();
    }, [pkRes.keyword, allPosts]);

    useEffect(() => {
        const set = async () => {
            try {
                if (pkRes.keyword) {
                    result.current = getSlice(pkRes.page, searchResult.current).result;
                    // setPkRes({ ...pkRes, result: getSlice(pkRes.page, searchResult.current).result });
                } else {
                    result.current = allPosts.result;
                    // setPkRes({ ...pkRes, result: [...allPosts.result] });
                }
            } catch (e: any) {
                dispatch(typeof e === 'string' ? e : 'Fetch failed', '');
            }
        }
        set();
    }, [pkRes.page]);

    function getThumbnails() {
        return result.current.map(post => <Grid item xs={12} lg={6} xl={4}><ThumbnailCardForm post={post} /></Grid>)
    }
    return <Box width='100%' sx={{ textAlign: "center" }} key='hpBox'>
        <HeaderForm getKeyword={keyword => setPkRes({ ...pkRes, keyword })} />
        {/* <SpeedDialForm openAddPostForm={() => setOpenAddPostForm(true)} /> */}
        <AddPostForm openDialog={openAddPostForm} goBack={() => setOpenAddPostForm(false)} />
        {getThumbnails().length === 0 ? <label style={{ textAlign: 'center', color: 'lightgrey', fontSize: '3rem', marginTop: '10vh', fontFamily: 'cursive' }}>No items</label> :
            <Grid container spacing={2}>
                {getThumbnails()}
            </Grid>
        }

        {/* <Pagination count={postsInfo.totalPages} color="secondary" />   */}
    </Box>
}
export default Home;