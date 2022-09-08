const { SegTree } = require('segtree')

function op(a, b) {
    expect(a === '$' || b === '$' || a <= b).toBe(true)
    if (a === '$') return b
    if (b === '$') return a
    return a + b
}
function e() {
    return '$'
}

describe('SegTree', () => {
    it('Zero', () => {
        const s = new SegTree(0, { op, e })
        expect(s.allProd()).toBe('$')
    })
})
