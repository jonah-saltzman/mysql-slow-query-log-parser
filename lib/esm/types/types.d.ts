import { AST } from 'node-sql-parser';
type LogFileClient = {
    user: string;
    host: string;
    id: number | null;
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
    sqlStatementAst: AST | AST[] | null;
    tablesVisited: string[];
    columnsVisited: string[];
    schema: string | null;
};
export {};
//# sourceMappingURL=types.d.ts.map