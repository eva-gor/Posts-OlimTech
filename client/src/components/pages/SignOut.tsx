import {useDispatch} from 'react-redux';
import { authActions } from '../../redux/slices/authSlice';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    return <Box sx={{textAlign:'center'}} mt={10}>
        <Typography variant='subtitle1' ><i>Want to leave? </i></Typography>
            <Button variant='contained'  color='secondary' onClick={() => dispatch(authActions.reset())} >Sign Out</Button>
        </Box>
}
 
 export default SignOut;