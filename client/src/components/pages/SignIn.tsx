import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { authActions } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username: string = data.get('username')! as string;
        if (username.trim()) {
            dispatch(authActions.set({ username }));
        }
    };


    return <Box sx={{ textAlign: 'center' }} mt={10}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container justifyContent={'center'} spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        color='secondary'
                        margin="normal"
                        required
                        fullWidth
                        name="username"
                        label="Username"
                        type="username"
                        id="username"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                    >
                        Sign In
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </Box>
}
export default SignIn;