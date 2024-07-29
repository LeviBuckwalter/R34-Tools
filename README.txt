maybe change keyword "search" to "batch"?

How to update cache import:
1) delete deno.lock
2) in terminal, run "deno cache --reload ./src/caches/shortcut_caches/Percent$.ts" (or replace main.ts with another file that imports cache stuff)

import { getPosts } from "./src/functions/end_user.ts"; import * as all$Funcs from "./src/functions/cache_manipulation/all_cache_functions.ts"; import {getCensus} from "./src/functions/cache_manipulation/Census$_functions.ts"; import {percentTags} from "./src/functions/cache_manipulation/Percent$_functions.ts"; await all$Funcs.loadAll()