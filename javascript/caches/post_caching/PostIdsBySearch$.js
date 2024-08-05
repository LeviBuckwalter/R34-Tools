"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostIdsBySearch$ = void 0;
const Cache_ts_1 = require("cache-tools/classes/Cache.ts");
const utility_functions_ts_1 = require("../../general_functions/utility_functions.ts");
const General__ts_1 = require("../General$.ts");
const PostsByPostId__ts_1 = require("./PostsByPostId$.ts");
exports.PostIdsBySearch$ = new Cache_ts_1.Cache("PostIdsBySearch$", Infinity);
exports.PostIdsBySearch$.makeKey = function (prompt, pid) {
    const Gen$Ret = General__ts_1.General$.retrieve("maxId");
    if (!Gen$Ret) {
        throw new Error(`maxId is undefined. You probably need to reset the anchor`);
    }
    let key = (0, utility_functions_ts_1.normalizePrompt)(prompt);
    key = `id:<${Gen$Ret} ${prompt}`;
    key = `${prompt.replace(" ", "-")}_${pid}`;
    return key;
};
exports.PostIdsBySearch$.retrieve = function (key) {
    const originalRetrieve = Cache_ts_1.Cache.prototype.retrieve.bind(this);
    const originalRet = originalRetrieve(key);
    if (originalRet) {
        for (const id of originalRet) {
            const key = PostsByPostId__ts_1.PostsByPostId$.makeKey(id);
            const posts$Ret = PostsByPostId__ts_1.PostsByPostId$.retrieve(key);
            if (!posts$Ret) {
                exports.PostIdsBySearch$.discard(key);
                return undefined;
            }
        }
    }
    return originalRet;
};
