import { Box, Button, InputBase, alpha, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

const TIMEOUT = 1000;
const Search = styled('div')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '70vw',
    right: 0,
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

type Props = {
    getKeyword: (keyword: string) => void
}
let timeoutId: ReturnType<typeof setTimeout>;
const SearchByKeywordForm: React.FC<Props> = ({ getKeyword }) => {
    const [search, setSearch] = useState<string>('');
    const wasSentFl = useRef<boolean>(false);
    useEffect(() => {
        if (!wasSentFl.current) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => getKeyword(search), TIMEOUT);    //debounce
        }
    }, [search]);

    useEffect(() => {
        const keyDownHandler = (event: { key: string; preventDefault: () => void; }) => {   
          if (event.key === 'Enter') {
            event.preventDefault();
            searchHandler();
          }
        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
          document.removeEventListener('keydown', keyDownHandler);
        };
      }, []);
    function searchHandler() {
        getKeyword(search);
        wasSentFl.current = true;
    }

    return <Search>
        <Box display='flex' justifyContent='center'>
            <Button color='secondary' onClick={searchHandler}>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
            </Button>
            <StyledInputBase
                placeholder="Keyword…"
                inputProps={{ 'aria-label': 'search', min: 0, step: 500 }}
                onChange={(event: any) => {
                    wasSentFl.current = false;
                    setSearch(event.target.value);
                }}
                value={search}
            />
        </Box>
    </Search>
}

export default SearchByKeywordForm;