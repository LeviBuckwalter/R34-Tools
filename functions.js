import { removeFromArray } from "./utility.js"
import { problemStrs } from "./global variables.js"


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