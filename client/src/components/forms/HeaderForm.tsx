import { Box, useMediaQuery, useTheme } from '@mui/material';
import SearchByKeywordForm from './SearchByKeywordForm';
import SpeedDialForm from "../forms/SpeedDialForm";

type Props = {
    getKeyword: (keyword: string) => void,
    setOpenAddPostForm: () => void
}


const HeaderForm: React.FC<Props> = ({ getKeyword, setOpenAddPostForm }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    let top = '0px';
    if (matches){
        top = '55px';
    }
    return <Box top={top} sx={{
        background: 'linear-gradient(360deg, #fff 0%, #CFCDFF 100%)',
        paddingTop: { xs: "10px", md: "60px" }, width: '100%', zIndex: 100, position: 'sticky'
    }} >
        <Box fontFamily="'Chela One', cursive" fontSize={{ xs: '2.5rem', sm: '3rem', lg: '5rem' }} sx={{
            verticalAlign: 'center', display: 'inline',
            textShadow: '0 0 3px #FF0000, 0 0 5px #0000FF', color: 'white'
        }}>
            FavPosts
        </Box>
        <Box sx={{ position: 'relative' }}>
            <SearchByKeywordForm getKeyword={key => getKeyword(key)} />
            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, position: 'absolute', right: 16, top: -10 }}>
                <SpeedDialForm openAddPostForm={setOpenAddPostForm} />
            </Box>
        </Box>
    </Box>
}

export default HeaderForm;