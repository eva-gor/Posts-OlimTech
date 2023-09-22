type CommentType = {
    id: number,
    text: string,
    postId: number,
    username: string,
    likes: string[],
    dislikes: string[],
    date: string,
} | null
export default CommentType;