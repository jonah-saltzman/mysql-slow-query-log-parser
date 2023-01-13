"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFileParser = void 0;
const node_sql_parser_1 = require("node-sql-parser");
class LogFileParser {
    get entriesJSON() { return JSON.stringify(this.entries); }
    constructor(options) {
        this.entries = [];
        this.currentEntry = {};
        this.sqlParser = new node_sql_parser_1.Parser();
        this.verbose = false;
        this.lines = 0;
        if (options === null || options === void 0 ? void 0 : options.verbose)
            this.verbose = true;
    }
    parseLine(line) {
        this.lines++;
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
}
exports.LogFileParser = LogFileParser;
