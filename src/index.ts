import * as fs from 'fs'

export async function parseStream(readable: fs.ReadStream): Promise<void> {
    return new Promise((resolve, reject) => {
        let nLines = 0
        readable.on('data', (chunk) => {
            const lines = chunk.toString().split('\n')
            for (const line of lines) {
                nLines++
            }
        })
        readable.on('end', () => {
            console.log({nLines})
            resolve()
        })
        readable.on('error', reject)
    })
}