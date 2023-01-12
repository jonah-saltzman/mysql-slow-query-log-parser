import * as fs from 'fs'
import { LogFileParser, LogFileEntry } from './classes'

export {LogFileParser, LogFileEntry} from './classes'

export async function parseStream(readable: fs.ReadStream): Promise<LogFileEntry[]> {
    return new Promise((resolve, reject) => {
        let chunks = 0
        const parser = new LogFileParser({verbose: false})
        let partialLine: string | undefined
        let prevChunk: (string | Buffer) | undefined

        const processChunk = (chunk: string | Buffer, last: boolean): void => {
            let strChunk = chunk.toString()
            let lines = strChunk.toString().split('\n')
            if (!last) {
                if (partialLine) {
                    lines[0] = partialLine.concat(lines[0])
                    partialLine = undefined
                }
                if (!strChunk.endsWith('\n')) {
                    partialLine = lines.pop()
                }
            }
            for (const line of lines) {
                parser.parseLine(line)
            }
        }

        readable.on('data', (chunk) => {
            if (prevChunk) {
                processChunk(prevChunk, false)
            }
            prevChunk = chunk
            chunks++
        })
        readable.on('end', () => {
            if (prevChunk) {
                processChunk(prevChunk, true)
            }
            resolve(parser.entries)
        })
        readable.on('error', reject)
    })
}