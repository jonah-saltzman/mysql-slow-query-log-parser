import { parseStream } from "../src"
import * as fs from 'fs'
import * as path from 'path'
import { expect } from "chai"

describe('Parser', () => {
    it('processes a readable stream', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'hello.txt'), { encoding: 'utf8' })
        const expected = `hello\nworld\n123\n`
        const output = await parseStream(fileStream)
        console.log({output})
        expect(expected).to.equal(output)
    })
})