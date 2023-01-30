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
exports.parseStream = exports.LogFileParser = void 0;
const classes_1 = require("./classes");
Object.defineProperty(exports, "LogFileParser", { enumerable: true, get: function () { return classes_1.LogFileParser; } });
function parseStream(readable) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let chunks = 0;
            const parser = new classes_1.LogFileParser({ verbose: false });
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
    });
}
exports.parseStream = parseStream;
