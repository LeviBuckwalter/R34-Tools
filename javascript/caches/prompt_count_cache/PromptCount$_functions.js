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
exports.getCount = getCount;
const the_fetch_conductor_1 = require("../../general_functions/API_access/the_fetch_conductor");
const PromptCount_1 = require("./PromptCount$");
function getCount(prompt, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { lookInCache = true, storeInCache = true } = options;
        const key = PromptCount_1.PromptCount$.makeKey(prompt);
        if (lookInCache) {
            const pc$Ret = PromptCount_1.PromptCount$.retrieve(key);
            if (pc$Ret) {
                return pc$Ret;
            }
        } //else:
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=0&limit=1`;
        function myEgg() {
            return __awaiter(this, void 0, void 0, function* () {
                const resp = yield fetch(url);
                return yield resp.text();
            });
        }
        const text = yield the_fetch_conductor_1.FC.ticket(myEgg);
        const m = text.match(/<posts count="\d*/);
        let ret;
        if (m === null) {
            throw new Error("posts count was not found in corpus");
        }
        else {
            ret = Number(m[0].replace(`<posts count="`, ""));
        }
        if (storeInCache) {
            PromptCount_1.PromptCount$.store(key, ret, 1000 * 60 * 60 * 24 * 7);
        }
        return ret;
    });
}
