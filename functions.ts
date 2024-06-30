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
function processRawPosts(rawPosts: rawPost[]): Post[] {
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

async function postsApi(prompt: string, pid: number, limit?: number, json?: boolean): Promise<Post[]> {
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

async function apiCache(prompt: string, pid: number, dontSave?: boolean): Promise<Post[]> {
    const GCReturn: number | undefined = main.GeneralCache.retrieve("maxId")
    if (!GCReturn) {
        throw new Error(`the maxId is undefined, so it's not possible to cache api returns`)
    }
    prompt = `id:<${GCReturn} ${prompt}`
    
    const SCKey = `${pid}_${prompt.replace(" ", "-")}`
    const SCReturn = main.SearchCache.retrieve(SCKey)
    if (SCReturn) {
        const posts: Post[] = []
        for (const id of SCReturn.postIds) {
            const PCReturn = main.PostCache.retrieve(`${id}`)
            if (PCReturn) {
                posts.push(PCReturn.post)
            } else {
                throw new Error(`post under ${id} was not found in PostCache`)
            }
        }
        return posts
    }

    const posts = await postsApi(prompt, pid)
    const postIds: number[] = []
    for (const post of posts) {
        postIds.push(post.id)
    }
    main.SearchCache.store(
        `${pid}_${prompt.replace(" ", "-")}`,
        {
            prompt: prompt,
            pid: pid,
            postIds: postIds
        }
    )
    if (!dontSave) {
        await main.SearchCache.save()
    }
    for (const post of posts) {
        const PCReturn = main.PostCache.retrieve(`${post.id}`)
        if (PCReturn) {
            PCReturn.refs++
        } else {
            main.PostCache.store(`${post.id}`, {refs: 1, post: post})
        }
    }
    if (!dontSave) {
        await main.PostCache.save()
    }
    return posts
}


export async function getPosts(prompt: string, amtPosts: number, dontSave?: boolean): Promise<Post[]> {
    prompt = normalizePrompt(prompt)
    
    const pages = Math.ceil(amtPosts / 1000)
    const promises: Promise<Post[]>[] = []
    for (let pid = 0; pid < pages; pid++) {
        promises.push(apiCache(prompt, pid, true))
    }
    const posts: Post[] = []
    for (const promise of promises) {
        posts.push(...(await promise))
    }
    if (!dontSave) {
        await main.SearchCache.save()
        await main.PostCache.save()
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
    main.SearchCache.clear()
    main.GeneralCache.store("maxId", (await postsApi("", 0, 1))[0].id)
    await main.GeneralCache.save()
    await main.SearchCache.save()
    await main.PostCache.save()
}

export async function saveAll(): Promise<void> {
    await main.SearchCache.save()
    await main.PostCache.save()
    await main.GeneralCache.save()
}

export async function loadAll(): Promise<void> {
    await main.SearchCache.load()
    await main.PostCache.load()
    await main.GeneralCache.load()
}