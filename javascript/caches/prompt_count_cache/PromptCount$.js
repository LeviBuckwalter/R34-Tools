"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptCount$ = void 0;
const Cache_ts_1 = require("cache-tools/classes/Cache.ts");
const utility_functions_ts_1 = require("../../general_functions/utility_functions.ts");
exports.PromptCount$ = new Cache_ts_1.Cache("PromptCount$", 50000);
exports.PromptCount$.makeKey = function (prompt) {
    prompt = (0, utility_functions_ts_1.normalizePrompt)(prompt);
    const key = prompt.replace(" ", "-");
    return key;
};
