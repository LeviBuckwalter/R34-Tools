"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePrompt = normalizePrompt;
exports.processRawPosts = processRawPosts;
const Post_ts_1 = require("../classes/Post.ts");
const globals_ts_1 = require("../globals.ts");
function normalizePrompt(prompt) {
    // Trim spaces from the beginning and end of the prompt
    prompt = prompt.trim();
    // Replace multiple spaces with a single space
    prompt = prompt.replace(/\s+/g, ' ');
    return prompt;
}
function processRawPosts(rawPosts) {
    function isSafe(tag) {
        let safe = true;
        for (const str of globals_ts_1.problemStrs) {
            if (tag.includes(str)) {
                safe = false;
                break;
            }
        }
        return safe;
    }
    const processed = [];
    for (const rawPost of rawPosts) {
        let tags = rawPost.tags.split(" ");
        tags = tags.filter(isSafe);
        const tagsSet = new Set();
        for (const tag of tags) {
            tagsSet.add(tag);
        }
        processed.push(new Post_ts_1.Post(rawPost.id, tagsSet, rawPost.rating, rawPost.score, rawPost.comment_count, rawPost.preview_url.substring(38, rawPost.preview_url.length - 5)));
    }
    return processed;
}
