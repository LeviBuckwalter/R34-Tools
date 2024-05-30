import { removeFromArray } from "./utility.js"
import { problemStrs } from "./global variables.js"
import { Search } from "./classes/Search.js"


export function processPosts(posts, keepIds) {
    //returns a new array

    if (keepIds === undefined) {
        keepIds = true
    }
    if (!Array.isArray(posts)) {
        console.log("error: processPosts was passed something that was not an array")
        return
    }

    let processed = []
    for (let post of posts) {
        let tags = post.tags.split(" ")
        function isProblematic(tag) {
            let problem = false
            for (let str of problemStrs) {
                if (tag.includes(str)) {
                    problem = true
                    break;
                }
            }
            return problem
        }
        removeFromArray(tags, isProblematic)

        let tagsSet = new Set()
        for (let tag of tags) {
            tagsSet.add(tag)
        }

        if (keepIds) {
            processed.push({ id: post.id, tags: tagsSet })
        } else {
            processed.push(tagsSet)
        }
    }

    return processed
}

export async function sample(prompt, amtPosts) {
    /* returns an array of processed posts */
    const batches = Math.ceil(amtPosts / 1000)
    const finalBatchAmt = amtPosts % 1000

    let fetches = []
    for (let pid = 0; pid < batches - 1; pid++) {
        fetches.push(new Search(prompt, pid).fetch())
    }
    fetches.push(new Search(prompt, batches - 1, finalBatchAmt).fetch())

    let posts = []
    for (let fetch of fetches) {
        posts.push(...processPosts(await fetch))
    }

    return posts
}