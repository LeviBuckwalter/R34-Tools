import * as globals from "./globals.ts"
import { Post } from "./classes/Post.ts"
import * as caches from "./caches.ts"
import * as main from "./main.ts"
import { Census } from "./classes/Census.ts";


type rawPost = {
    preview_url: string
    id: number
    score: number
    tags: string
    comment_count: number
}
export function processRawPosts(rawPosts: rawPost[]): Post[] {
    function isSafe(tag: string): boolean {
        let safe = true
        for (const str of globals.problemStrs) {
            if (tag.includes(str)) {
                safe = false
                break;
            }
        }
        return safe
    }
    const processed: Post[] = []
    
    for (const rawPost of rawPosts) {
        let tags: string[] = rawPost.tags.split(" ")
        tags = tags.filter(isSafe)
        const tagsSet: Set<string> = new Set()
        for (const tag of tags) {
            tagsSet.add(tag)
        }
        processed.push(new Post(
            rawPost.id,
            tagsSet,
            rawPost.score,
            rawPost.comment_count,
            rawPost.preview_url
        ))
    }
    return processed
}


async function postsApi(prompt: string, pid: number, limit?: number, json?: boolean): Promise<Post[]> {
    prompt = `id:<${caches.GeneralCache.retrieve("maxId")} ${prompt}`
    pid = (pid === undefined) ? 0 : pid
    limit = (limit === undefined) ? 1000 : limit
    json = (json === undefined) ? true : json
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=${pid}&limit=${limit}&json=${(json === true) ? 1 : 0}`

    async function myEgg(): Promise<Post[]> {
        const resp = await fetch(url)
        return processRawPosts(await resp.json())
        
    }
    const ret = await main.FC.ticket(myEgg)
    return ret
}


export async function validTag(tag: string): Promise<boolean> {
    try {
        await postsApi(tag, 0, 1)
        return true
    } catch {
        return false
    }
}

export async function validTags(tags: string[]): Promise<boolean> {
    const promises = []
    for (const tag of tags) {
        promises.push(caches.ValidTagFC.call(tag))
    }
    for (const promise of promises) {
        if (!(await promise)) {
            return false
        }
    }
    return true
}

export async function percentTags(tags: string[] | string, prompt: string, amtPosts: number): Promise<{[tag: string]: number}> {
    if (!Array.isArray(tags)) {
        tags = [tags]
    }
    
    if (!(await validTags(tags))) {
        console.log(tags)
        throw new Error(`percentTags was given an invalid tag`)
    }
    
    
    prompt = normalizePrompt(prompt)
    function key(tag: string): string {
        return`${prompt.replace(" ", "_")}:${tag}`
    }
    
    const ret: {[tag: string]: number} = {}

    const toDoTags: string[] = []
    for (const tag of tags) {
        const PCRet = caches.PercentCache.retrieve(key(tag))
        if (PCRet && (PCRet.amtPosts >= amtPosts || PCRet.allPostsChecked)) {
            ret[tag] = PCRet.percent
        } else {
            toDoTags.push(tag)
        }
    }
    if (toDoTags.length === 0) {
        return ret
    }
    
    const posts = await getPosts(prompt, amtPosts)
    const counts: {[tag: string]: number} = {}
    for (const tag of toDoTags) {
        counts[tag] = 0
    }
    for (const post of posts) {
        for (const toDoTag of toDoTags) {
            if (post.tags.has(toDoTag)) {
                counts[toDoTag]++
            }
        }
    }

    const allPostsChecked = posts.length < amtPosts
    for (const tag of toDoTags) {
        ret[tag] = counts[tag]/posts.length
        caches.PercentCache.store(
            key(tag),
            {
                percent: ret[tag],
                amtPosts: posts.length,
                allPostsChecked: allPostsChecked
            },
            1000*60*60*24*7
        )
    }
    await caches.PercentCache.save()
    return ret
}


export async function getPosts(prompt: string, amtPosts: number): Promise<Post[]> {
    const pages = Math.ceil(amtPosts / 1000)
    const promises: Promise<Post[]>[] = []
    for (let pid = 0; pid < pages; pid++) {
        promises.push(postsApi(prompt, pid))
    }
    const posts: Post[] = []
    for (const promise of promises) {
        posts.push(...(await promise))
    }
    
    return posts.slice(0, amtPosts)
}

export async function getCensus(prompt: string, amtPosts: number) {
    prompt = normalizePrompt(prompt)
    const posts = await getPosts(prompt, amtPosts)
    return new Census(posts)
}


export function normalizePrompt(prompt: string): string {
    // Trim spaces from the beginning and end of the prompt
    prompt = prompt.trim();

    // Replace multiple spaces with a single space
    prompt = prompt.replace(/\s+/g, ' ');

    return prompt;
}


export async function setAnchor(): Promise<void> {
    caches.GeneralCache.store("maxId", (await postsApi("", 0, 1))[0].id)
    caches.PercentCache.clear()
    caches.GetCensusFC.cache.clear()
    caches.ValidTagFC.cache.clear()
    await saveAll()
}


export async function saveAll(): Promise<void> {
    await caches.PercentCache.save()
    await caches.GeneralCache.save()
    await caches.GetCensusFC.cache.save()
    await caches.ValidTagFC.cache.save()
}
export async function loadAll(): Promise<void> {
    await caches.PercentCache.load()
    await caches.GeneralCache.load()
    await caches.GetCensusFC.cache.load()
    await caches.ValidTagFC.cache.load()
}