"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getProportion = getProportion;
exports.getRelativeProportion = getRelativeProportion;
// import { countWithCache } from "../outdated_scripts/tag_count_cache/Tag$_functions.ts";
const post_caching_functions_ts_1 = require("../caches/post_caching/post_caching_functions.ts");
const PromptCount__functions_ts_1 = require("../caches/prompt_count_cache/PromptCount$_functions.ts");
function getPosts(prompt, amtPosts, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lookInCache = true, storeInCache = true } = options;
        const pages = Math.ceil(amtPosts / 1000);
        const promises = [];
        for (let pid = 0; pid < pages; pid++) {
            promises.push((0, post_caching_functions_ts_1.postsApiWithCache)(prompt, pid, { lookInCache, storeInCache }));
        }
        const posts = [];
        for (const promise of promises) {
            posts.push(...(yield promise));
        }
        return posts.slice(0, amtPosts);
    });
}
// export async function validTags(...tags: string[]): Promise<boolean> {
//     const promises: Promise<number>[] = []
//     for (const tag of tags) {
//         promises.push(countWithCache(tag))
//     }
//     for (const promise of promises) {
//         if ((await promise) === 0) {
//             return false
//         }
//     }//else:
//     return true
// }
function getProportion(promptSubgroup_1, promptBaseline_1) {
    return __awaiter(this, arguments, void 0, function* (promptSubgroup, promptBaseline, options = {}) {
        const { lookInCache = true, storeInCache = true } = options;
        const countBl = (0, PromptCount__functions_ts_1.getCount)(promptBaseline, { lookInCache, storeInCache });
        const countSg = (0, PromptCount__functions_ts_1.getCount)(`${promptBaseline} ${promptSubgroup}`, { lookInCache, storeInCache });
        return {
            proportion: (yield countSg) / (yield countBl),
            datapoints: yield countBl
        };
    });
}
function getRelativeProportion(promptSubgroup, promptBaseline, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lookInCache = true, storeInCache = true } = options;
        const countAll = (0, PromptCount__functions_ts_1.getCount)("", { lookInCache, storeInCache });
        const countBl = (0, PromptCount__functions_ts_1.getCount)(promptBaseline, { lookInCache, storeInCache });
        const countSgIndependant = (0, PromptCount__functions_ts_1.getCount)(promptSubgroup, { lookInCache, storeInCache });
        const countSg = (0, PromptCount__functions_ts_1.getCount)(`${promptBaseline} ${promptSubgroup}`, { lookInCache, storeInCache });
        return {
            relativeProportion: ((yield countSg) / (yield countBl)) / ((yield countSgIndependant) / (yield countAll)),
            datapoints: yield countSg
        };
    });
}
