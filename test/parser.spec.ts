import { parseStream } from "../src"
import * as fs from 'fs'
import * as path from 'path'
import { expect } from "chai"

describe('Parser', () => {
    it('processes a small readable stream', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'hello.txt'), { encoding: 'utf8' })
        const output = await parseStream(fileStream)
        const expected = fs.readFileSync(path.join(__dirname, 'hello.txt'), { encoding: 'utf8' })
        //expect(expected).to.equal(output)
    })
    it('processes a large readable stream', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'admin.txt'), { encoding: 'utf8' })
        const output = await parseStream(fileStream)
        const expected = fs.readFileSync(path.join(__dirname, 'admin.txt'), { encoding: 'utf8' })
        //expect(expected).to.equal(output)
    })
})