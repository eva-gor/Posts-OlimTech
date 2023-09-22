import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { codeReducer } from "./slices/codeSlice";
import CodePayload from "../components/model/CodePayload";
import { authReducer } from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        authState: authReducer,
        codeState: codeReducer
    }
});

export function useSelectorAuth() {
    return useSelector<any, string>(state => state.authState.username);
}

export function useSelectorCode() {
    return useSelector<any, CodePayload>(state => state.codeState.codeMessage);
}