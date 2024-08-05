"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsByPostId$ = void 0;
const Cache_ts_1 = require("cache-tools/classes/Cache.ts");
/*
stores posts, indexed by postIds.
*/
exports.PostsByPostId$ = new Cache_ts_1.Cache("PostsByPostId$", 50000);
exports.PostsByPostId$.makeKey = function (postId) {
    return `${postId}`;
};
