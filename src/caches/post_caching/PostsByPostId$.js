import { Cache } from "../../../node_modules/cache-tools/src/classes/Cache.js";
/*
stores posts, indexed by postIds.
*/
export const PostsByPostId$ = new Cache("PostsByPostId$", 50000);
PostsByPostId$.makeKey = function (postId) {
    return `${postId}`;
};
