import request from 'supertest'
import jmaple from '../src'

describe('initialized', function () {
    it('start', function (done) {
        const result = request(
            jmaple.initialize({
                npcs: {
                    1002000: {
                        name: 'Phil',
                        source: 'scripts/1002000.js',
                        image: 'image.jpg'
                    }
                },
                port: 92
            })
        )
        result
            .get('/')
            .expect(200)
            .then((response) => {
                expect(response.status).toBe(200)
                done()
            })
    })
})
