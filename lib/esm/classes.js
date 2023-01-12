import { Parser } from 'node-sql-parser';
export class LogFileParser {
    entries = [];
    get entriesJSON() { return JSON.stringify(this.entries); }
    constructor(options) {
        if (options?.verbose)
            this.verbose = true;
    }
    parseLine(line) {
        this.lines++;
        console.log(line);
        const tokens = line.split(/ +/g);
        if (line === '' || line === '\n' || tokens.length < 2)
            return;
        switch (tokens[1]) {
            case 'Time:':
                this.currentEntry.time = new Date(tokens[2]);
                break;
            case 'User@Host:':
                this.currentEntry.client = {
                    user: tokens[2],
                    host: tokens[4],
                    id: parseInt(tokens[7])
                };
                break;
            case 'Query_time:':
                this.currentEntry.data = {
                    queryTime: parseFloat(tokens[2]),
                    lockTime: parseFloat(tokens[4]),
                    rowsSent: parseInt(tokens[6]),
                    rowsExamined: parseInt(tokens[8])
                };
                break;
            default:
                if (tokens[0] === 'SET')
                    this.currentEntry.setTimestamp = parseInt(tokens[1].split('=')[1]);
                else {
                    try {
                        this.currentEntry.sqlStatementRaw = line;
                        const { tableList, columnList, ast } = this.sqlParser.parse(line);
                        this.currentEntry.columnsVisited = columnList;
                        this.currentEntry.sqlStatementAst = ast;
                        this.currentEntry.tablesVisited = tableList;
                        this.entries.push(this.currentEntry);
                    }
                    catch (err) {
                        if (this.verbose) {
                            const e = err;
                            console.log('Error parsing SQL:');
                            console.log("\t" + e.message);
                            console.log(`on line ${this.lines}:`);
                            console.log("\t" + line);
                        }
                    }
                    finally {
                        this.currentEntry = {};
                    }
                }
        }
    }
    currentEntry = {};
    sqlParser = new Parser();
    verbose = false;
    lines = 0;
}
