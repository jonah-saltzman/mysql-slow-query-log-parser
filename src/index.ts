import * as fs from 'fs'

export async function parseStream(readable: fs.ReadStream) {
    let output = ''
    for await (const chunk of readable) {
        output += chunk
    }
    return output
}