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
exports.count = count;
const the_fetch_conductor_1 = require("./the_fetch_conductor");
function count(tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index&name=${tag}`;
        function myEgg() {
            return __awaiter(this, void 0, void 0, function* () {
                const resp = yield fetch(url);
                return yield resp.text();
            });
        }
        let ret = yield the_fetch_conductor_1.FC.ticket(myEgg);
        ret = ret.match(/count="\d*/);
        if (ret === null) {
            return 0;
        }
        else {
            ret = ret[0].replace(`count="`, "");
            ret = Number(ret);
            return ret;
        }
    });
}
