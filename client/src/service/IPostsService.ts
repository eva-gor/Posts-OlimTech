import { Observable } from "rxjs";
import CommentType from "../components/model/CommentType";
import PostType from "../components/model/PostType";
import GetPostsByPageType from "../components/model/GetPostsByPageType";


export default interface IPostsService{
    createPost(title: string, username: string): Promise<PostType>
    deletePost(id: number): Promise<PostType>
    updatePost(id: number, title: string, likes: string[], dislikes: string[]): Promise<PostType>
    getPostsByPage(page: number): Observable<GetPostsByPageType | string> 

    createComment(text: string, postId: number, username: string): Promise<CommentType>
    updateComment(commentId: number, text: string, likes: string[], dislikes: string[]): Promise<CommentType>
    deleteComment(commentId: number): Promise<CommentType>

    searchByKeyword(keyword: string): Promise<PostType[]>
    uploadPostPicture(id: number,  file: any): Promise<PostType>
}