import { FC } from "./the_fetch_conductor.ts";

export async function count(tag: string): Promise<number> /*| Promise<null> */{
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index&name=${tag}`
    async function myEgg(): Promise<string> {
        const resp = await fetch(url)
        return await resp.text()
    }
    let ret: any = await FC.ticket(myEgg)
    ret = ret.match(/count="\d*/)
    if (ret === null) {
        return 0
    } else {
        ret = ret[0].replace(`count="`, "")
        ret = Number(ret)
        return ret
    }
}