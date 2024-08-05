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
exports.scoresOverTime = scoresOverTime;
exports.amtPostsOverTime = amtPostsOverTime;
exports.rateOverTime = rateOverTime;
const tags_ts_1 = require("../general_functions/API_access/tags.ts");
const end_user_ts_1 = require("../general_functions/end_user.ts");
const id_timestamp_conversion_ts_1 = require("../general_functions/id_timestamp_conversion.ts");
function scoresOverTime(tag, amtPosts) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield (0, tags_ts_1.count)(tag));
        const posts = yield (0, end_user_ts_1.getPosts)(tag + " sort:score:desc", amtPosts, {});
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            console.log(`${i}, ${post.score}`);
        }
    });
}
function amtPostsOverTime(tag, amtPosts, postsPerPoint, ts) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield (0, end_user_ts_1.getPosts)(tag, amtPosts, {});
        let miniAvg = 0;
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            if (ts) {
                miniAvg += (0, id_timestamp_conversion_ts_1.idToTs)(post.id) / postsPerPoint;
            }
            else {
                miniAvg += post.id / postsPerPoint;
            }
            if (i % postsPerPoint === postsPerPoint - 1) {
                console.log(`${miniAvg}, ${posts.length - 1 - i}`);
                miniAvg = 0;
            }
        }
    });
}
function rateOverTime(tag, amtPosts, amtPoints) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield (0, end_user_ts_1.getPosts)(tag, amtPosts, {});
        const timeSpan = (0, id_timestamp_conversion_ts_1.idToTs)(posts[0].id) - (0, id_timestamp_conversion_ts_1.idToTs)(posts[posts.length - 1].id);
        const bucketSize = timeSpan / amtPoints;
        let minTs = (0, id_timestamp_conversion_ts_1.idToTs)(posts[posts.length - 1].id);
        let tally = 0;
        for (let i = posts.length - 1; i >= 0; i--) {
            const postTs = (0, id_timestamp_conversion_ts_1.idToTs)(posts[i].id);
            if (postTs < minTs + bucketSize) {
                tally++;
            }
            else {
                console.log(`${minTs + bucketSize / 2}, ${tally / bucketSize}`);
                tally = 0;
                minTs += bucketSize;
            }
        }
    });
}
