import { AST, Parser } from 'node-sql-parser'

type LogFileClient = {
    user: string,
    host: string,
    id: number
}

type LogFileData = {
    queryTime: number,
    lockTime: number,
    rowsSent: number
    rowsExamined: number
}

export type LogFileEntry = {
    time: Date,
    client: LogFileClient,
    data: LogFileData,
    setTimestamp: number,
    sqlStatementRaw: string,
    sqlStatementAst: AST | AST[],
    tablesVisited: string[],
    columnsVisited: string[]
}

export class LogFileParser {

    public entries: LogFileEntry[] = []
    public get entriesJSON () { return JSON.stringify(this.entries) }
    public constructor(options?: {verbose: boolean}) {
        if (options?.verbose)
            this.verbose = true
    }

    public parseLine(line: string): void {
        this.lines++
        // console.log(line)
        const tokens = line.split(/ +/g)
        if (line === '' || line === '\n' || tokens.length < 2)
            return
        switch (tokens[1]) {
            case 'Time:':
                this.currentEntry.time = new Date(tokens[2])
                break
            case 'User@Host:':
                this.currentEntry.client = {
                    user: tokens[2],
                    host: tokens[4],
                    id: parseInt(tokens[7])
                }
                break
            case 'Query_time:':
                this.currentEntry.data = {
                    queryTime: parseFloat(tokens[2]),
                    lockTime: parseFloat(tokens[4]),
                    rowsSent: parseInt(tokens[6]),
                    rowsExamined: parseInt(tokens[8])
                }
                break
            default:
                if (tokens[0] === 'SET')
                    this.currentEntry.setTimestamp = parseInt(tokens[1].split('=')[1])
                else {
                    try {
                        this.currentEntry.sqlStatementRaw = line
                        const { tableList, columnList, ast } = this.sqlParser.parse(line)
                        this.currentEntry.columnsVisited = columnList
                        this.currentEntry.sqlStatementAst = ast
                        this.currentEntry.tablesVisited = tableList
                        this.entries.push(this.currentEntry as LogFileEntry)
                    } catch(err) {
                        if (this.verbose) {
                            const e = err as Error
                            console.log('Error parsing SQL:')
                            console.log("\t" + e.message)
                            console.log(`on line ${this.lines}:`)
                            console.log("\t" + line)
                        }
                    } finally {
                        this.currentEntry = {}
                    }
                }
        }
    }

    private currentEntry: Partial<LogFileEntry> = {}
    private sqlParser: Parser = new Parser()
    private verbose = false
    private lines = 0
}