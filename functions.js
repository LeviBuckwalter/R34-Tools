import { globals } from "./globals.js"
import { store, retrieve, inCacheObj } from "./Cache/functions.js"
import { createHash } from "crypto"

function hash(inputString) {
    const h = createHash("sha256")
    h.update(inputString)
    return h.digest("hex")
}

function processPosts(posts) {
    //returns a new array

    if (!Array.isArray(posts)) {
        console.log("error: processPosts was passed something that was not an array")
        return
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
                preview: post.preview_url,
                sample: post.sample_url,
                file: post.file_url
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
    const cacheKey = "postsApi" + prompt + pid + limit + json
    const cacheId = hash(cacheKey)

    if (inCacheObj(cacheId)) {
        return retrieve(cacheId)
    } else {
        let posts = await postsApi(prompt, pid, limit, json)
        store(posts, cacheId)
        return posts
    }
}

export async function getPosts(prompt, amtPosts) {
    /* returns an array of processed posts */
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

function normalizePrompt(prompt) {
    /*
    I will want this function to remove double spaces and spaces from the end or beginning of the prompt
    */
    return prompt
}