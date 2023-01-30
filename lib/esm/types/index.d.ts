/// <reference types="node" />
import * as fs from 'fs';
import { LogFileParser } from './classes';
import { LogFileEntry } from './types';
export { LogFileParser };
export { LogFileEntry };
export declare function parseStream(readable: fs.ReadStream): Promise<LogFileEntry[]>;
//# sourceMappingURL=index.d.ts.map