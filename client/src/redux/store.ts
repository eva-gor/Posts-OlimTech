import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { codeReducer } from "./slices/codeSlice";
import CodePayload from "../components/model/CodePayload";
import { authReducer } from "./slices/authSlice";
import UserData from "../components/model/UserData";

export const store = configureStore({
    reducer: {
        authState: authReducer,
        codeState: codeReducer
    }
});

export function useSelectorAuth() {
    return useSelector<any, UserData>(state => state.authState.userData);
}

export function useSelectorCode() {
    return useSelector<any, CodePayload>(state => state.codeState.codeMessage);
}