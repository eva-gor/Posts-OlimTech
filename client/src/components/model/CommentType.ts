import UserData from "./UserData";

type CommentType = {
    id: number,
    text: string,
    postId: number,
    username: UserData,
    likes: string[],
    dislikes: string[],
    date: string,
} | null
export default CommentType;