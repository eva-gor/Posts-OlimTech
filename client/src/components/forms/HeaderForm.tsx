import {Box, ThemeProvider, createTheme } from '@mui/material';
import { purple } from '@mui/material/colors';
import SearchByKeywordForm from './SearchByKeywordForm';



type Props = {
    getKeyword: (keyword: string) => void
}

const HeaderForm: React.FC<Props> = ({ getKeyword }) => {
    return <Box sx={{ background: 'linear-gradient(360deg, #fff 0%, #CFCDFF 100%)', paddingTop: { xs: "10px", md: "60px" }, width: '100%', zIndex: 100, top: 0 }} >
            <Box fontFamily="'Chela One', cursive" fontSize={{ xs: '2.5rem', sm: '3rem', lg: '5rem' }} sx={{
                verticalAlign: 'center', display: 'inline',
                textShadow: '0 0 3px #FF0000, 0 0 5px #0000FF', color: 'white'
            }}>
                FavPosts
            </Box>
            <SearchByKeywordForm getKeyword={key => getKeyword(key)}/>
        </Box>
}

export default HeaderForm;