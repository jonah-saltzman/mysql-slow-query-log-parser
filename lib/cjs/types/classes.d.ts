import { AST } from 'node-sql-parser';
type LogFileClient = {
    user: string;
    host: string;
    id: number;
};
type LogFileData = {
    queryTime: number;
    lockTime: number;
    rowsSent: number;
    rowsExamined: number;
};
export type LogFileEntry = {
    time: Date;
    client: LogFileClient;
    data: LogFileData;
    setTimestamp: number;
    sqlStatementRaw: string;
    sqlStatementAst: AST | AST[];
    tablesVisited: string[];
    columnsVisited: string[];
};
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
export {};
//# sourceMappingURL=classes.d.ts.map