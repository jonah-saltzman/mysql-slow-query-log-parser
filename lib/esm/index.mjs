import { LogFileParser } from './classes';
export { LogFileParser } from './classes';
export async function parseStream(readable) {
    return new Promise((resolve, reject) => {
        let chunks = 0;
        const parser = new LogFileParser({ verbose: false });
        let partialLine;
        let prevChunk;
        const processChunk = (chunk, last) => {
            let strChunk = chunk.toString();
            let lines = strChunk.toString().split('\n');
            if (!last) {
                if (partialLine) {
                    lines[0] = partialLine.concat(lines[0]);
                    partialLine = undefined;
                }
                if (!strChunk.endsWith('\n')) {
                    partialLine = lines.pop();
                }
            }
            for (const line of lines) {
                parser.parseLine(line);
            }
        };
        readable.on('data', (chunk) => {
            if (prevChunk) {
                processChunk(prevChunk, false);
            }
            prevChunk = chunk;
            chunks++;
        });
        readable.on('end', () => {
            if (prevChunk) {
                processChunk(prevChunk, true);
            }
            resolve(parser.entries);
        });
        readable.on('error', reject);
    });
}
