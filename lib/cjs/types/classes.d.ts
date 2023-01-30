import { LogFileEntry } from './types';
export declare class LogFileParser {
    entries: LogFileEntry[];
    get entriesJSON(): string;
    constructor(options?: {
        verbose: boolean;
    });
    parseLine(line: string): void;
    private currentEntry;
    private sqlParser;
    private verbose;
    private lines;
}
//# sourceMappingURL=classes.d.ts.map