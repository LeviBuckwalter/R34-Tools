import { globals } from "./globals.js"
import { store, retrieve, inCache, discard, keysThatStartWith } from "./Cache/endUser.js"

function processPosts(posts) {
    //returns a new array

    if (!Array.isArray(posts)) {
        posts = [posts]
    }

    let processed = []
    for (let post of posts) {
        let tags = post.tags.split(" ")
        function isSafe(tag) {
            let safe = true
            for (let str of globals.problemStrs) {
                if (tag.includes(str)) {
                    safe = false
                    break;
                }
            }
            return safe
        }
        tags = tags.filter(isSafe)

        let tagsSet = new Set()
        for (let tag of tags) {
            tagsSet.add(tag)
        }

        processed.push({
            id: post.id,
            tags: tagsSet,
            url: {
                page: `https://rule34.xxx/index.php?page=post&s=view&id=${post.id}`,
                image: {
                    preview: post.preview_url,
                    sample: post.sample_url,
                    file: post.file_url
                }
            }
        })
    }

    return processed
}

async function postsApi(prompt, pid, limit, json) {
    prompt = (prompt === undefined) ? "" : prompt
    pid = (pid === undefined) ? 0 : pid
    limit = (limit === undefined) ? 1000 : limit
    json = (json === undefined) ? true : json
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=${pid}&limit=${limit}&json=${(json === true) ? 1 : 0}`

    async function myEgg() {
        let resp = await fetch(url)
        return processPosts(await resp.json())
    }
    const ret = await globals.FC.ticket(myEgg)
    return ret
}

async function postsCache(prompt, pid, limit, json) {
    /* implements maxId in prompt. The caching system for posts requires an anchor for things to work right. */
    prompt = normalizePrompt(prompt)
    if (globals.maxId === undefined) {
        console.log("maxId === undefined, you need to set the anchor first")
        return
    }
    prompt = `id:<${globals.maxId} ${prompt}`

    const cacheKey = `postsApi_${prompt.replace(" ", "_")}_${pid}_${limit}_${json}`

    if (inCache(cacheKey)) {
        return retrieve(cacheKey)
    } else {
        let posts = await postsApi(prompt, pid, limit, json)
        store(posts, cacheKey, 48 * 60 * 60 * 1000)
        return posts
    }
}

export async function getPosts(prompt, amtPosts) {

    const pages = Math.ceil(amtPosts / 1000)

    let promises = []
    for (let pid = 0; pid < pages; pid++) {
        promises.push(postsCache(prompt, pid))
    }

    let posts = []
    for (let promise of promises) {
        posts.push(...await promise)
    }

    return posts.slice(0, amtPosts)
}

export function normalizePrompt(prompt) {
    // Trim spaces from the beginning and end of the prompt
    prompt = prompt.trim();

    // Replace multiple spaces with a single space
    prompt = prompt.replace(/\s+/g, ' ');

    return prompt;
}

export function initializeAnchor() {
    if (!inCache("anchor")) {
        console.log("There is no saved anchor in the cache.")
    } else {
        globals.maxId = retrieve("anchor")
    }
}

export async function setAnchor() {
    let keys = keysThatStartWith("postsApi")
    for (let key of keys) {
        discard(key)
    }

    globals.maxId = (await postsApi("", 0, 1))[0].id
    store(globals.maxId, "anchor", null)
}