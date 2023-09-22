import CommentType from "./CommentType";

type PostType = {
    id: number,
    title: string,
    username: string,
    likes: string[],
    dislikes: string[],
    date: number,
    comments?: CommentType[],
    imageSrc?: string
}
export default PostType;