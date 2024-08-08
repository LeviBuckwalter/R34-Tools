"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptCount$ = void 0;
const Cache_1 = require("cache-tools/src/classes/Cache");
const utility_functions_1 = require("../../general_functions/utility_functions");
exports.PromptCount$ = new Cache_1.Cache("PromptCount$", 50000);
exports.PromptCount$.makeKey = function (prompt) {
    prompt = (0, utility_functions_1.normalizePrompt)(prompt);
    const key = prompt.replace(" ", "-");
    return key;
};
