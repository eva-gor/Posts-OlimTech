import CommentType from "./CommentType";
import UserData from "./UserData";

type PostType = {
    id: number,
    title: string,
    username: UserData,
    likes: string[],
    dislikes: string[],
    date: number,
    comments?: CommentType[],
    imageSrc?: string
}
export default PostType;