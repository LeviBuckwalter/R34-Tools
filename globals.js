import { FetchConductor } from "./classes/FetchConductor.js"

export const globals = {
    problemStrs: ["&eacute;", "&#039;", "+", "&amp;", "&gt;", "&lt;", "&uacute;", "&ntilde;", "&iacute;"],
    FC: new FetchConductor(10),
    maxId: undefined
}