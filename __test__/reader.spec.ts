import Reader from '../src/core/reader'

describe('Reader', function () {
    it('text cleaned', function () {
        const val = 'abc'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe(val)
    })

    it('colorize text', function () {
        const val = '#babc'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe('<span class="color-blue">abc</span>')
    })

    it('multi colorize text', function () {
        const val = '#babc #dabcd'
        const reader = new Reader(val)
        expect(reader.interpret()).toBe(
            '<span class="color-blue">abc </span><span class="color-purple">abcd</span>'
        )
    })
})
