"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsByPostId$ = void 0;
const Cache_1 = require("cache-tools/src/classes/Cache");
/*
stores posts, indexed by postIds.
*/
exports.PostsByPostId$ = new Cache_1.Cache("PostsByPostId$", 50000);
exports.PostsByPostId$.makeKey = function (postId) {
    return `${postId}`;
};
