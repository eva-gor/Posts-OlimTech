import { useDispatch } from "react-redux";
import { codeActions } from "../redux/slices/codeSlice";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import CodeType from "../components/model/CodeType";
import PostType from "../components/model/PostType";
import { postService } from "../config/service-config";
import GetPostsResponseType, { defaultGetPostsByPageType } from "../components/model/GetPostsByPageType";

export function useDispatchCode() {
    const dispatch = useDispatch();
    return (error: string, successMessage: string) => {
        let code: CodeType = CodeType.OK;
        let message: string = '';
        if (error) code = error.includes('unavailable') ? CodeType.SERVER_ERROR : CodeType.UNKNOWN;
        message = error;
        dispatch(codeActions.set({ code, message: message || successMessage }))
    }
}
export function useSelectorPostsByPage(page: number) {
    const dispatch = useDispatchCode();
    const [posts, setPosts] = useState<GetPostsResponseType>(defaultGetPostsByPageType);
    useEffect(() => {
        const subscription: Subscription = postService.getPostsByPage(page)
            .subscribe({
                next(postsObj: GetPostsResponseType | string) {
                    let errorMessage: string = '';
                    if (typeof postsObj === 'string') {
                        errorMessage = postsObj;
                    } else {
                        setPosts(postsObj);
                    }
                    dispatch(errorMessage, '');
                }
            });
        return () => subscription.unsubscribe();
    }, []);
    return posts;
}

export function useSelectorSearchByKeyword(keyword:string) {
    const dispatch = useDispatchCode();
    const [posts, setPosts] = useState<PostType[]>([]);
    
    useEffect(() => {
            const subscription: Subscription = postService.searchByKeyword(keyword)
                .subscribe({
                    next(postsObj: PostType[] | string) {
                        let errorMessage: string = '';
                        if (typeof postsObj === 'string') {
                            errorMessage = postsObj;
                        } else {
                            setPosts(postsObj);
                        }
                        dispatch(errorMessage, '');
                    }
                });
                return () => subscription.unsubscribe();
    }, []);
    return posts;
}

