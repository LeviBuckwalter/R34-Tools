import { Post } from "../classes/Post.ts";
import { postsApi } from "./API_access/posts.ts";
import { countWithCache } from "../outdated_scripts/tag_count_cache/Tag$_functions.ts";
import { postsApiWithCache } from "../caching/post_caching/post_caches_functions.ts";
import { getCount } from "../caching/prompt_count_cache/PromptCount$_functions.ts";

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

export async function getProportion(
    promptSubgroup: string,
    promptBaseline: string,
    options: {lookInCache?: boolean, saveToCache?: boolean} = {}
): Promise<{proportion: number, datapoints: number}> {
    const {lookInCache = true, saveToCache = true} = options

    const countBl = getCount(promptBaseline, lookInCache, saveToCache)
    const countSg = getCount(`${promptBaseline} ${promptSubgroup}`, lookInCache, saveToCache)
    return {
        proportion: (await countSg)/(await countBl),
        datapoints: await countBl
    }
}

export async function getRelativeProportion(
    promptSubgroup: string,
    promptBaseline: string,
    options: {lookInCache?: boolean, saveToCache?: boolean}
): Promise<{relativeProportion: number, datapoints: number}> {
    const {lookInCache = true, saveToCache = true} = options

    const countAll = getCount("", lookInCache, saveToCache)
    const countBl = getCount(promptBaseline, lookInCache, saveToCache)
    const countSgIndependant = getCount(promptSubgroup, lookInCache, saveToCache)
    const countSg = getCount(`${promptBaseline} ${promptSubgroup}`, lookInCache, saveToCache)

    return {
        relativeProportion: ((await countSg)/(await countBl))/((await countSgIndependant)/(await countAll)),
        datapoints: await countSg
    }
}