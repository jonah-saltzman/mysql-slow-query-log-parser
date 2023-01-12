import { LogFileParser } from './classes';
export async function parseStream(readable) {
    return new Promise((resolve, reject) => {
        let chunks = 0;
        const parser = new LogFileParser({ verbose: false });
        let partialLine;
        readable.on('data', (chunk) => {
            let strChunk = chunk.toString();
            //console.log(`received chunk[${chunks}] len=${chunk.length}`)
            let lines = strChunk.toString().split('\n');
            if (partialLine) {
                //console.log(`found existing partial line:\n\t${partialLine}`)
                //console.log(`concatenating with\n\t${lines[0]}`)
                lines[0] = partialLine.concat(lines[0]);
                //console.log(`concatenated: ${lines[0]}`)
                partialLine = undefined;
            }
            if (!strChunk.endsWith('\n')) {
                partialLine = lines.pop();
                //console.log(`partial line:\n\t${partialLine}`)
            }
            for (const line of lines) {
                parser.parseLine(line);
            }
            chunks++;
        });
        readable.on('end', () => {
            resolve(parser.entries);
        });
        readable.on('error', reject);
    });
}
