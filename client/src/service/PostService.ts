import CommentType from "../components/model/CommentType";
import GetPostsByPageType from "../components/model/GetPostsByPageType";
import PostType from "../components/model/PostType";
import UserData from "../components/model/UserData";
import IPostsService from "./IPostsService";
import { Observable, Subscriber } from "rxjs";

const POLLER_INTERVAL = 3000;
class CachePosts {
    cacheString: string = '';
    set(posts: PostType[]): void {
        this.cacheString = JSON.stringify(posts);
    }
    reset() {
        this.cacheString = ''
    }
    isEqual(posts: PostType[]): boolean {
        return this.cacheString === JSON.stringify(posts)
    }
    getCache(): PostType[] {
        return !this.isEmpty() ? JSON.parse(this.cacheString) : []
    }
    isEmpty(): boolean {
        return this.cacheString.length === 0;
    }
}

function getUrl(baseUrl: string, tale: string): string {
    return `${baseUrl}${tale}`;
}
async function fetchRequest(url: string, method: string, body: Object, errorText?: string): Promise<any> {
    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const { success, result } = await response.json();
    if (!success) {
        throw 'Server is unavailable';
    }
    if (!result) {
        throw errorText || 'Not found';
    }
    return result;
}
async function fetchPostsOnPage(url: string, page: number): Promise<GetPostsByPageType | string> {
    let res: GetPostsByPageType | string;
    const response = await fetch(getUrl(url, `/post/page/${page}`), {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    });
    const responseJson: { success: boolean, resp: GetPostsByPageType } = await response.json();
    const totalPages = responseJson.resp.totalPages || 0;
    if (!responseJson.success) {
        res = "Server is unavailable";
    } else if (totalPages < page) {
        res = `Total number of pages ${totalPages} less than the given page number`;
    } else {
        res = responseJson.resp;
    }
    return res;
}
async function loadImageByUrl(url_image: string) {
    try{
        const response = await fetch(url_image);
        if (!response.ok) throw 'Chose another image';
        return response.blob();
    } catch (e){
        throw 'Chose another image';
    }
}

export default class PostService implements IPostsService {
    private observable: Observable<GetPostsByPageType | string> | null = null;
    private cachePosts: CachePosts = new CachePosts();

    constructor(private baseUrl: string) { }

    async createPost(title: string, userData: UserData): Promise<PostType> {
        return await fetchRequest(getUrl(this.baseUrl, '/post'), 'POST', { title, username: userData!.username });
    }
    async deletePost(id: number): Promise<PostType> {
        return await fetchRequest(getUrl(this.baseUrl, `/post/${id}`), 'DELETE', {}, `No post with id ${id} was found`);
    }
    async updatePost(id: number, title: string, likes: string[], dislikes: string[]): Promise<PostType> {
        return await fetchRequest(getUrl(this.baseUrl, `/post/${id}`), 'PUT', { title, likes, dislikes }, `No post with id ${id} was found`);
    }
    private sibscriberNext(url: string, page: number, subscriber: Subscriber<GetPostsByPageType | string>): void {
        fetchPostsOnPage(url, page).then(posts => {
            if (typeof posts === 'string') {
                throw 'posts';
            }
            if (this.cachePosts.isEmpty() || !this.cachePosts.isEqual(posts.result as PostType[])) {
                this.cachePosts.set(posts.result as PostType[]);
                subscriber.next(posts);
            }
        }).catch(error => subscriber.next(error));
    }

    getPostsByPage(page: number): Observable<GetPostsByPageType | string> {
        let intervalId: any;
        if (!this.observable) {
            this.observable = new Observable<GetPostsByPageType | string>(subscriber => {
                this.cachePosts.reset();
                this.sibscriberNext(this.baseUrl, page, subscriber);
                intervalId = setInterval(() => this.sibscriberNext(this.baseUrl, page, subscriber), POLLER_INTERVAL);
                return () => clearInterval(intervalId)
            })
        }
        return this.observable;
    }
    async createComment(text: string, postId: number, userData: UserData): Promise<CommentType> {
        return await fetchRequest(getUrl(this.baseUrl, '/comment'), 'POST', { text, postId, username: userData!.username });
    }
    async updateComment(commentId: number, text: string, likes: string[], dislikes: string[]): Promise<CommentType> {
        return await fetchRequest(getUrl(this.baseUrl, `/comment/${commentId}`), 'PUT', { text, likes, dislikes }, `No comment with id ${commentId} was found`);
    }
    async deleteComment(commentId: number): Promise<CommentType> {
        return await fetchRequest(getUrl(this.baseUrl, `/comment/${commentId}`), 'DELETE', {}, `No comment with id ${commentId} was found`);
    }

    async searchByKeyword(keyword: string): Promise<PostType[]> {
        return await fetchRequest(getUrl(this.baseUrl, `/post/search/${keyword}`), 'GET', {});
    }
    async uploadPostPicture(id: number, file: string): Promise<PostType> {
        const imageUpload = await loadImageByUrl(file);
        const formData = new FormData();
        formData.append("picture", imageUpload);
        const response = await fetch(getUrl(this.baseUrl, `/post/${id}/picture`), {
            method: "POST",
            body: formData
        });
        const resp = await response.json();
        if (resp.message){
            throw resp.message;
        }
        const { success, result } = resp;
        if (!success || !result) {
            throw 'Error while loading';
        }
        return result;
    }
}