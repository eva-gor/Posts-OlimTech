import IPostService from "../service/IPostsService";
import PostService from "../service/PostService";

 export const postService: IPostService = new PostService("http://localhost:8080", 1,'');