# MySQL Slow Query Log Parser

## Usage
At the moment, two interfaces are exposed: a class that handles line-by-line parsing of the slow query log, and a function that accepts a NodeJS readable stream of the slow query log file and processes the log in chunks.

### Types
```ts
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

type LogFileEntry = {
    time: Date,
    client: LogFileClient,
    data: LogFileData,
    setTimestamp: number,
    sqlStatementRaw: string,
    sqlStatementAst: AST | AST[],
    tablesVisited: string[],
    columnsVisited: string[]
}
```

### Class `LogFileParser`

#### `constructor(options?: {verbose: boolean})`
If verbose, prints `node-sql-parser` errors to standard output

#### `parseLine(line: string)`
Parses a single line of the slow query log. Pass the lines in order to not mix log file entries.

#### `entries: LogFileEntry[]`
An array containing all the complete entries processed thus far.

#### `entriesJSON (): string`
Returns a JSON string of all the complete entries processed thus far.

### Function `parseStream`
#### `parseStream(readable: fs.ReadStream): Promise<LogFileEntry[]>`
Accepts a readable stream representing the log file, and processes the file in chunks/