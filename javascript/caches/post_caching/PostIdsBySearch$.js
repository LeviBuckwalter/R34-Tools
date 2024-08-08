"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostIdsBySearch$ = void 0;
const Cache_1 = require("cache-tools/src/classes/Cache");
const utility_functions_1 = require("../../general_functions/utility_functions");
const General_1 = require("../General$");
const PostsByPostId_1 = require("./PostsByPostId$");
exports.PostIdsBySearch$ = new Cache_1.Cache("PostIdsBySearch$", Infinity);
exports.PostIdsBySearch$.makeKey = function (prompt, pid) {
    const Gen$Ret = General_1.General$.retrieve("maxId");
    if (!Gen$Ret) {
        throw new Error(`maxId is undefined. You probably need to reset the anchor`);
    }
    let key = (0, utility_functions_1.normalizePrompt)(prompt);
    key = `id:<${Gen$Ret} ${prompt}`;
    key = `${prompt.replace(" ", "-")}_${pid}`;
    return key;
};
exports.PostIdsBySearch$.retrieve = function (key) {
    const originalRetrieve = Cache_1.Cache.prototype.retrieve.bind(this);
    const originalRet = originalRetrieve(key);
    if (originalRet) {
        for (const id of originalRet) {
            const key = PostsByPostId_1.PostsByPostId$.makeKey(id);
            const posts$Ret = PostsByPostId_1.PostsByPostId$.retrieve(key);
            if (!posts$Ret) {
                exports.PostIdsBySearch$.discard(key);
                return undefined;
            }
        }
    }
    return originalRet;
};
