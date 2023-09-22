import {createSlice} from '@reduxjs/toolkit';
const AUTH_ITEM = "auth-item";
function getUserData(): {username: string} {
    const userData = localStorage.getItem(AUTH_ITEM) || '';
    let res: {username: string} = {username: userData || ''};
    return res;
}
const initialState: {username: string} =  getUserData();

const authSlice = createSlice({
    initialState,
    name: "authState",
    reducers: {
        set: (state, data) => {
            
            if (data.payload) {
                localStorage.setItem(AUTH_ITEM, data.payload);
                state.username = data.payload;
            }
        },
        reset: (state) => {
            state.username = '';
            localStorage.removeItem(AUTH_ITEM);
        }
    }
});
export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;