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
exports.postsApiWithCache = postsApiWithCache;
exports.resetAnchor = resetAnchor;
const PostIdsBySearch_1 = require("./PostIdsBySearch$");
const PostsByPostId_1 = require("./PostsByPostId$");
const posts_1 = require("../../general_functions/API_access/posts");
const General_1 = require("../General$");
function postsApiWithCache(prompt, pid, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lookInCache = true, storeInCache = true } = options;
        const search$Key = PostIdsBySearch_1.PostIdsBySearch$.makeKey(prompt, pid);
        const search$Ret = PostIdsBySearch_1.PostIdsBySearch$.retrieve(search$Key);
        if (lookInCache && search$Ret) {
            const posts = [];
            for (const postId of search$Ret) {
                const post$Key = PostsByPostId_1.PostsByPostId$.makeKey(postId);
                const post$Ret = PostsByPostId_1.PostsByPostId$.retrieve(post$Key);
                if (post$Ret) {
                    posts.push(post$Ret);
                }
                else {
                    throw new Error(`PostsByPostIds$ returned undefined for the id "${postId}". PostIdsBySearch$ should have returned undefined if not all the posts exist in PostsByPostIds$.`);
                }
            }
            return posts;
        } //else:
        const posts = yield (0, posts_1.postsApi)(prompt, pid);
        if (storeInCache) {
            const ids = [];
            for (const post of posts) {
                ids.push(post.id);
                const key = PostsByPostId_1.PostsByPostId$.makeKey(post.id);
                PostsByPostId_1.PostsByPostId$.store(key, post);
            }
            PostIdsBySearch_1.PostIdsBySearch$.store(search$Key, ids);
        }
        return posts;
    });
}
function resetAnchor() {
    return __awaiter(this, void 0, void 0, function* () {
        General_1.General$.store("maxId", (yield (0, posts_1.postsApi)("", 0, 1))[0].id);
        PostIdsBySearch_1.PostIdsBySearch$.clear();
        PostsByPostId_1.PostsByPostId$.clear();
    });
}
