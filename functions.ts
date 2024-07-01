import * as globals from "./globals.ts"
import { Post } from "./classes/Post.ts"
import * as main from "./main.ts"


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
        processed.push(new Post(rawPost.id, tagsSet, rawPost.score, rawPost.comment_count, rawPost.preview_url))
    }
    return processed
}

async function postsApi(prompt: string, pid: number, limit?: number, json?: boolean): Promise<rawPost[]> {
    prompt = `id:<${main.GeneralCache.retrieve("maxId")} ${prompt}`
    pid = (pid === undefined) ? 0 : pid
    limit = (limit === undefined) ? 1000 : limit
    json = (json === undefined) ? true : json
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=${pid}&limit=${limit}&json=${(json === true) ? 1 : 0}`

    async function myEgg(): Promise<rawPost[]> {
        const resp = await fetch(url)
        return await resp.json()
        
    }
    const ret = await main.FC.ticket(myEgg)
    return ret
}

export async function percentTags(tags: string[] | string, prompt: string, amtPosts: number): Promise<{[tag: string]: number}> {
    if (!Array.isArray(tags)) {
        tags = [tags]
    }
    prompt = normalizePrompt(prompt)
    function key(tag: string): string {
        return`${prompt.replace(" ", "_")}:${tag}`
    }
    
    const ret: {[tag: string]: number} = {}

    const toDoTags: string[] = []
    for (const tag of tags) {
        const PCRet = main.PercentCache.retrieve(key(tag))
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
        let foundTags = 0
        for (const postTag of post.tags) {
            for (const toDoTag of toDoTags) {
                if (postTag === toDoTag) {
                    counts[toDoTag]++
                    foundTags++
                    break
                }
            }
            if (foundTags === toDoTags.length) {
                break
            }
        }
    }

    const allPostsChecked = posts.length < amtPosts
    for (const tag of toDoTags) {
        ret[tag] = counts[tag]/posts.length
        main.PercentCache.store(
            key(tag),
            {
                percent: ret[tag],
                amtPosts: posts.length,
                allPostsChecked: allPostsChecked
            },
            1000*60*60*24*7
        )
    }

    return ret
}


export async function getPosts(prompt: string, amtPosts: number): Promise<rawPost[]> {
    const pages = Math.ceil(amtPosts / 1000)
    const promises: Promise<rawPost[]>[] = []
    for (let pid = 0; pid < pages; pid++) {
        promises.push(postsApi(prompt, pid))
    }
    const posts: rawPost[] = []
    for (const promise of promises) {
        posts.push(...(await promise))
    }
    
    return posts.slice(0, amtPosts)
}

export function normalizePrompt(prompt: string): string {
    // Trim spaces from the beginning and end of the prompt
    prompt = prompt.trim();

    // Replace multiple spaces with a single space
    prompt = prompt.replace(/\s+/g, ' ');

    return prompt;
}

export async function setAnchor(): Promise<void> {
    main.GeneralCache.store("maxId", (await postsApi("", 0, 1))[0].id)
    main.PercentCache.clear()
    await saveAll()
}

export async function saveAll(): Promise<void> {
    await main.PercentCache.save()
    await main.GeneralCache.save()
}

export async function loadAll(): Promise<void> {
    await main.PercentCache.load()
    await main.GeneralCache.load()
}