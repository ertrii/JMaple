import Reader from '../src/core/reader'

describe('Reader', function () {
    it('text cleaned', function () {
        const val = 'abc'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe(val)
    })

    it('text listed', function () {
        const val = '#L1#item 1#l#L2#item 2#l'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe(
            '<ul class="list"><li value="1">item 1</li><li value="2">item 2</li></ul>'
        )
    })

    it('colorize text', function () {
        const val = '#babc'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe('<div class="color color-blue">abc</div>')
    })

    it('multi colorize text', function () {
        const val = '#babc #dabcd'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe(
            '<div class="color color-blue">abc </div><div class="color color-purple">abcd</div>'
        )
    })
})
