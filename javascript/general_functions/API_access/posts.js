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
exports.postsApi = postsApi;
const utility_functions_1 = require("../utility_functions");
const the_fetch_conductor_1 = require("./the_fetch_conductor");
function postsApi(prompt, pid, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        pid = (pid === undefined) ? 0 : pid;
        limit = (limit === undefined) ? 1000 : limit;
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=${pid}&limit=${limit}&json=1`;
        function myEgg() {
            return __awaiter(this, void 0, void 0, function* () {
                const resp = yield fetch(url);
                return (0, utility_functions_1.processRawPosts)(yield resp.json());
            });
        }
        const ret = yield the_fetch_conductor_1.FC.ticket(myEgg);
        return ret;
    });
}
