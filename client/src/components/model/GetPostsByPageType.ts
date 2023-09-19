import PostType from "./PostType";

type GetPostsByPageType = {
    result: PostType[],
    totalPages?: number,
    total?: number,
    page?: number
};
export default GetPostsByPageType;
export const defaultGetPostsByPageType: GetPostsByPageType = {result:[], totalPages: 0, total:0, page:0};