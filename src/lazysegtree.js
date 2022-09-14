function ceilPow2(n) {
    let x = 0
    while ((1 << x) < n) x++
    return x
}

class LazySegTree {
    constructor(nOrArray, options) {
        const { op, e, mapping, composition, id } = options
        this.op = op
        this.e = e
        const v = Array.isArray(nOrArray) ? nOrArray : Array(nOrArray).fill(0).map(() => e())

        const n = v.length
        const log = ceilPow2(n)
        const size = 1 << log
        const d = Array(2 * size)
        const lz = Array(size)
        this.n = n
        this.log = log
        this.size = size
        this.d = d
        this.lz = lz
        this.mapping = mapping
        this.composition = composition
        this.id = id

        for (let i = 0; i < d.length; i++) {
            d[i] = e()
        }
        for (let i = 0; i < lz.length; i++) {
            lz[i] = id()
        }
        for (let i = 0; i < n; i++) {
            d[size + i] = v[i]
        }
        for (let i = size - 1; i >= 1; i--) {
            this.update(i)
        }
    }
    set(p, x) {
        p += this.size
        for (let i = this.log; i >= 1; i--) this.push(p >> i);
        this.d[p] = x
        for (let i = 1; i <= this.log; i++) this.update(p >> i)
    }
    get(p) {
        const { size, log } = this
        p += size
        for (let i = log; i >= 1; i--) this.push(p >> i)
        return this.d[p]
    }
    prod(l, r) {
        const { log, size, d, op, e } = this
        if (l === r) return e()

        let sml = e(), smr = e()
        l += size
        r += size

        for (let i = log; i >= 1; i--) {
            if (((l >> i) << i) != l) this.push(l >> i)
            if (((r >> i) << i) != r) this.push((r - 1) >> i)
        }

        while (l < r) {
            if (l & 1) sml = op(sml, d[l++])
            if (r & 1) smr = op(d[--r], smr)
            l >>= 1
            r >>= 1
        }
        return op(sml, smr)
    }
    allProd() {
        return this.d[1]
    }
    apply(p, f) {
        const { size, log, d, mapping } = this
        p += size
        for (let i = log; i >= 1; i--) this.push(p >> i)
        d[p] = mapping(f, d[p])
        for (let i = 1; i <= log; i++) this.update(p >> i)
    }
    applyRange(l, r, f) {
        if (l == r) return

        const { size, log } = this
        l += size
        r += size

        for (let i = log; i >= 1; i--) {
            if (((l >> i) << i) != l) this.push(l >> i)
            if (((r >> i) << i) != r) this.push((r - 1) >> i)
        }

        {
            let l2 = l, r2 = r
            while (l < r) {
                if (l & 1) this.allApply(l++, f)
                if (r & 1) this.allApply(--r, f)
                l >>= 1
                r >>= 1
            }
            l = l2
            r = r2
        }

        for (let i = 1; i <= log; i++) {
            if (((l >> i) << i) != l) this.update(l >> i)
            if (((r >> i) << i) != r) this.update((r - 1) >> i)
        }
    }
    maxRight(l, f) {
        const { n, size, log, d, op, e} = this
        if (l == n) return n
        l += size
        for (let i = log; i >= 1; i--) this.push(l >> i)
        let sm = e()
        do {
            while (l % 2 == 0) l >>= 1
            if (!f(op(sm, d[l]))) {
                while (l < size) {
                    this.push(l)
                    l = (2 * l)
                    if (f(op(sm, d[l]))) {
                        sm = op(sm, d[l])
                        l++
                    }
                }
                return l - size
            }
            sm = op(sm, d[l])
            l++
        } while ((l & -l) != l)
        return n
    }
    minLeft(r, f) {
        if (r == 0) return 0
        const { size, log, d, op, e} = this
        r += size
        for (let i = log; i >= 1; i--) this.push((r - 1) >> i)
        let sm = e()
        do {
            r--
            while (r > 1 && (r % 2)) r >>= 1
            if (!f(op(d[r], sm))) {
                while (r < size) {
                    this.push(r)
                    r = (2 * r + 1)
                    if (f(op(d[r], sm))) {
                        sm = op(d[r], sm)
                        r--
                    }
                }
                return r + 1 - size
            }
            sm = op(d[r], sm)
        } while ((r & -r) != r)
        return 0
    }

    update(k) {
        const { d, op } = this
        d[k] = op(d[2 * k], d[2 * k + 1])
    }
    allApply(k, f) {
        const { size, d, lz, mapping, composition } = this
        d[k] = mapping(f, d[k])
        if (k < size) lz[k] = composition(f, lz[k])
    }
    push(k) {
        const { lz, id } = this
        this.allApply(2 * k, lz[k])
        this.allApply(2 * k + 1, lz[k])
        lz[k] = id()
    }
}

exports.LazySegTree = LazySegTree
