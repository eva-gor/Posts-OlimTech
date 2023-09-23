import CommentType from "../components/model/CommentType";
import GetPostsByPageType from "../components/model/GetPostsByPageType";
import PostType from "../components/model/PostType";
import IPostsService from "./IPostsService";
import { Observable, Subscriber } from "rxjs";

const POLLER_INTERVAL = 3000;
class CachePosts {
    cacheString: string = '';
    cacheSearchString = '';
    set(posts: PostType[]): void {
        this.cacheString = JSON.stringify(posts);
    }
    setSearch(posts: PostType[]): void {
        this.cacheSearchString = JSON.stringify(posts);
    }

    reset() {
        this.cacheString = ''
    }
    resetSearch() {
        this.cacheSearchString = ''
    }
    isEqual(posts: PostType[]): boolean {
        return this.cacheString === JSON.stringify(posts)
    }
    isEqualSearch(posts: PostType[]): boolean {
        return this.cacheSearchString === JSON.stringify(posts)
    }
    getCache(): PostType[] {
        return !this.isEmpty() ? JSON.parse(this.cacheString) : []
    }
    getCacheSearch(): PostType[] {
        return !this.isEmpty() ? JSON.parse(this.cacheSearchString) : []
    }
    isEmpty(): boolean {
        return this.cacheString.length === 0;
    }
    isEmptysearch(): boolean {
        return this.cacheSearchString.length === 0;
    }
}

function getUrl(baseUrl: string, tale: string): string {
    return `${baseUrl}${tale}`;
}

async function fetchPostsOnPage(url: string, page: number): Promise<GetPostsByPageType | string> {
    let res: GetPostsByPageType | string;
    try {
        const response = await fetch(getUrl(url, `/post/page/${page}`), {
            method: 'GET'
        });
        const responseJson = await response.json();

        const totalPages = responseJson.totalPages || 1;
        if (!responseJson.success) {
            res = "Error. Try it later";
        } else if (totalPages < page) {
            res = `Total number of pages ${totalPages} less than the given page number`;
        } else {
            delete responseJson.success;
            res = { ...responseJson };
        }
        return res;
    } catch (e) {
        throw 'Server is unavailable. Try it later'
    }
}

export default class PostService implements IPostsService {
    private observable: Observable<GetPostsByPageType | string> | null = null;
    private observableSearch: Observable<PostType[] | string> | null = null;
    private cachePosts: CachePosts = new CachePosts();

    constructor(private baseUrl: string) { }

    async createPost(title: string, username: string): Promise<PostType> {
        const init = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, username })
        };
        return await fetchPosts(getUrl(this.baseUrl, '/post'), init);
    }
    async deletePost(id: number): Promise<PostType> {
        return await fetchPosts(getUrl(this.baseUrl, `/post/${id}`), { method: 'DELETE' }, 'Post is not found');
    }
    async updatePost(id: number, title: string, likes: string[], dislikes: string[]): Promise<PostType> {
        const init = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, likes, dislikes })
        };
        return await fetchPosts(getUrl(this.baseUrl, `/post/${id}`), init, 'Post is not found');
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
    private sibscriberNextSearch(url: string, subscriber: Subscriber<PostType[] | string>): void {
        fetchPosts(url, { method: 'GET' }).then(posts => {
            if (typeof posts === 'string') {
                throw 'posts';
            }
            if (this.cachePosts.isEmptysearch() || !this.cachePosts.isEqualSearch(posts as PostType[])) {
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

    searchByKeyword(keyword: string): Observable<PostType[] | string> {
        let intervalId: any;
        if (!this.observableSearch) {
            this.observableSearch = new Observable<PostType[] | string>(subscriber => {
                this.cachePosts.resetSearch();
                this.sibscriberNextSearch(getUrl(this.baseUrl, `/post/search/${keyword}`), subscriber);
                intervalId = setInterval(() => this.sibscriberNextSearch(getUrl(this.baseUrl, `/post/search/${keyword}`), subscriber), POLLER_INTERVAL);
                return () => clearInterval(intervalId)
            })
        }
        return this.observableSearch;
    }
    async createComment(text: string, postId: number, username: string): Promise<CommentType> {
        const init = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, postId, username })
        };
        return await fetchPosts(getUrl(this.baseUrl, '/comment'), init);
    }
    async updateComment(commentId: number, text: string, likes: string[], dislikes: string[]): Promise<CommentType> {
        const init = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, likes, dislikes })
        };
        return await fetchPosts(getUrl(this.baseUrl, `/comment/${commentId}`), init, 'Comment is not found');
    }
    async deleteComment(commentId: number): Promise<CommentType> {
        return await fetchPosts(getUrl(this.baseUrl, `/comment/${commentId}`), { method: 'DELETE' }, 'Comment is not found');
    }
    async uploadPostPicture(id: number, file: any): Promise<PostType> {
        const formData = new FormData();
        formData.append("picture", file);
        try {
            const response = await fetch(getUrl(this.baseUrl, `/post/${id}/picture`), {
                method: "POST",
                body: formData
            });
            const resp = await response.json();
            if (resp.message) {
                throw resp.message;
            }
            const { success, result } = resp;
            if (!success || !result) {
                throw 'Error while loading';
            }
            return result;
        }
        catch (e) {
            throw e ? e.toString() : 'Server is not available. Try later'
        }
    }
}

async function fetchPosts(url: string, init: RequestInit, errorString?: string) {
    try {
        const response = await fetch(url, init);
        const resp = await response.json();
        if (!resp.success || (!errorString && !resp.result)) throw "Service doesn't work. Try later";
        if (errorString && !resp.result) throw errorString;
        return resp.result;
    }
    catch (e) {
        throw 'Server is not available. Try later'
    }
}