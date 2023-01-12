"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStream = void 0;
const classes_1 = require("./classes");
function parseStream(readable) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let chunks = 0;
            const parser = new classes_1.LogFileParser({ verbose: false });
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
    });
}
exports.parseStream = parseStream;
