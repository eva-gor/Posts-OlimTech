import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import HeaderForm from "../forms/HeaderForm";
import SpeedDialForm from "../forms/SpeedDialForm";
import AddPostForm from "../forms/AddPostForm";
import { useSelectorPostsByPage } from "../../hooks/hooks";

const Home: React.FC = () =>{
    const [keyword, setKeyword] = useState<string>('');
    useEffect(()=>{
        
    }, [keyword])
    const [openAddPostForm, setOpenAddPostForm] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const allPosts = useSelectorPostsByPage(page);

    return  <Box position='fixed' zIndex={1000} width='100%'sx={{textAlign:"center"}}>
    <HeaderForm getKeyword={key => setKeyword(key)}/>
    <SpeedDialForm openAddPostForm={()=> setOpenAddPostForm(true)}/>
    <AddPostForm openDialog ={openAddPostForm} goBack={() => setOpenAddPostForm(false)}/>
</Box>
}
 export default Home;