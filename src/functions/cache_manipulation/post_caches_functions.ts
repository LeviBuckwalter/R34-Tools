import { Post } from "../../classes/Post.ts";
import { General$ } from "../../caches/General$.ts";
import { PostIdsBySearch$ } from "../../caches/post_caches/PostIdsBySearch$.ts";
import { PostsByPostId$ } from "../../caches/post_caches/PostsByPostId$.ts";
import { postsApi } from "../API_access/posts.ts";
import { normalizePrompt } from "../utility_functions.ts";

export async function postsApiWithCache(prompt: string, pid: number): Promise<Post[]> {
    const Gen$Ret = General$.retrieve("maxId")
    if (!Gen$Ret) {
        throw new Error(`maxId is undefined. You probably need to reset the anchor`)
    }
    prompt = normalizePrompt(prompt)
    prompt = `id:<${Gen$Ret} ${prompt}`
    const search$Key: string = `${prompt.replace(" ", "-")}_${pid}`
    const search$Ret = PostIdsBySearch$.retrieve(search$Key)
    if (search$Ret) {
        const posts: Post[] = []
        for (const postId of search$Ret) {
            const post$Ret = PostsByPostId$.retrieve(`${postId}`)
            if (post$Ret) {
                posts.push(post$Ret)
            } else {
                throw new Error(`PostsByPostIds$ returned undefined for the id "${postId}". PostIdsBySearch$ should have returned undefined if not all the posts exist in PostsByPostIds$.`)
            }
        }
        return posts
    } else {
        const posts = await postsApi(prompt, pid)
        const ids: number[] = []
        for (const post of posts) {
            ids.push(post.id)
            PostsByPostId$.store(`${post.id}`, post)
        }
        PostIdsBySearch$.store(`${search$Key}`, ids)
        
        return posts
    }
}