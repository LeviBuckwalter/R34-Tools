export const FetchConductor = {
    amtChains: 10,
    chains: [],
    shortestChain: function () {
        let sc = this.chains[0]
        for (let chain of this.chains) {
            if (chain.links < sc.links) {
                sc = chain
            }
        }
        return sc
    },
    ticket: async function (egg) {
        const sc = this.shortestChain()
        let ret
        if (sc.topLink === null) {
            ret = egg()
        } else {
            async function retThunk() {
                await sc.topLink
                return await egg()
            }
            ret = retThunk()
        }
        sc.topLink = ret
        sc.length++

        if (random() < 0.01) {
            this.normalizeChains()
        }

        return await ret
    },
    normalizeChains: function () {
        const fewestLinks = this.chortestChain.links
        for (let chain of this.chains) {
            chain.links -= fewestLinks
        }
    }
}
for (let n = 0; n < FetchConductor.amtChains; n++) {
    FetchConductor.chains.push({ links: 0, topLink: null })
}