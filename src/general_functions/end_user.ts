import { Post } from "../classes/Post.ts";
import { postsApi } from "./API_access/posts.ts";
import { countWithCache } from "../caching/tag_count_cache/Tag$_functions.ts";
import { postsApiWithCache } from "../caching/post_caching/post_caches_functions.ts";

export async function getPosts(prompt: string, amtPosts: number, cache?: boolean): Promise<Post[]> {
    const pages = Math.ceil(amtPosts / 1000)
    const promises: Promise<Post[]>[] = []
    
    for (let pid = 0; pid < pages; pid++) {
        if (cache) {
            promises.push(postsApiWithCache(prompt, pid))
        } else {
            promises.push(postsApi(prompt, pid, Math.min(1000, amtPosts - 1000*pid)))
        }
    }
    const posts: Post[] = []
    for (const promise of promises) {
        posts.push(...(await promise))
    }
    
    return posts.slice(0, amtPosts)
}

export async function validTags(...tags: string[]): Promise<boolean> {
    const promises: Promise<number>[] = []
    for (const tag of tags) {
        promises.push(countWithCache(tag))
    }
    for (const promise of promises) {
        if ((await promise) === 0) {
            return false
        }
    }//else:
    return true
}

// export async function validPrompt(prompt: string): Promise<boolean> {
//     /*
//     -valid if:
//         1) valid tag
//         2) "-" + 1||4||5||6
//         3) "(" is valid if next str is valid tag, and then "~", and then valid tag, repeat any number of times, must end with ")" after valid tag
//         4) "rating:" + safe||questionable||explicit
//         5) "sort:" + "id"||"score"||"rating"||"height"||"width"||"parent"||"updated" + "asc"||"desc"
//         6) "width"||"height" + ":" + ">"||"<"||"" + "=" + number


//     bleah... I think I should just build in preperation for an API request to fail.
//     */
    
//     const ignoreStrs: RegExp[] = ["(", "~", ")", ]

//     const promptArray: string[] = prompt.split(" ")
//     for (const str of promptArray) {

//     }
// }