function ceilPow2(n) {
    let x = 0
    while ((1 << x) < n) x++
    return x
}

class SegTree {
    constructor(nOrArray, options) {
        const { op, e } = options
        const v = Array.isArray(nOrArray) ? nOrArray : Array(nOrArray).fill(0).map(() => e())

        const n = v.length
        const log = ceilPow2(n)
        const size = 1 << this.log
        const d = Array(2 * size)
        for (let i = 0; i < d.length; i++) {
            d[i] = e()
        }
        for (let i = 0; i < n; i++) {
            d[size + i] = v[i]
        }
        for (let i = size - 1; i >= 1; i--) {
            this.update(i)
        }

        this.n = n
        this.log = log
        this.size = size
        this.d = d
        this.options = options
    }
    set(p, x) {
    }
    get(p) {
    }
    prod(l, r) {
    }
    allProd() {
        return this.d[1]
    }
    maxRight(l, f) {
    }
    minLeft(r, f) {
    }

    update(p) {
    }
}

exports.SegTree = SegTree
