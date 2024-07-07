import { Post } from "../classes/Post.ts";
import { postsApi } from "./API_access/posts.ts";
import { postsApiWithCache } from "./cache_manipulation/post_caches_functions.ts";

export async function getPosts(prompt: string, amtPosts: number, cache?: boolean): Promise<Post[]> {
    const pages = Math.ceil(amtPosts / 1000)
    const promises: Promise<Post[]>[] = []
    
    for (let pid = 0; pid < pages; pid++) {
        if (cache) {
            promises.push(postsApiWithCache(prompt, pid))
        } else {
            promises.push(postsApi(prompt, pid))
        }
        
    }
    const posts: Post[] = []
    for (const promise of promises) {
        posts.push(...(await promise))
    }
    
    return posts.slice(0, amtPosts)
}