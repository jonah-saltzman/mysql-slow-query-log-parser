import { parseStream } from "../src"
import * as fs from 'fs'
import * as path from 'path'
import { LogFileEntry, LogFileParser } from "../src"
import { assert, expect } from "chai"
import { Parser } from 'node-sql-parser'

describe('Parser', () => {
    it('processes a small readable stream', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'hello.txt'), { encoding: 'utf8' })
        const output = await parseStream(fileStream)
        expect(output.length).to.equal(0)
    })
    it('processes a large readable stream', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'admin.txt'), { encoding: 'utf8' })
        const output = await parseStream(fileStream)
        expect(true)
    })
    it('parses a line from the slow query log', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'testlog.txt'), { encoding: 'utf8' })
        const output = await parseStream(fileStream)
        expect(output.length).to.equal(1)
        const sql = 'SELECT last_update_timestamp FROM information_schema.replica_host_status;'
        const parsedSql = new Parser().parse(sql)
        const expected: LogFileEntry = {
            time: new Date('2022-12-19T18:43:40.051328Z'),
            client: {
                user: 'rdsadmin[rdsadmin]',
                host: 'localhost',
                id: 39117
            },
            data: {
                queryTime: 0.000468,
                lockTime: 0.000084,
                rowsExamined: 2,
                rowsSent: 2
            },
            setTimestamp: 1671475420,
            sqlStatementRaw: sql,
            sqlStatementAst: parsedSql.ast,
            columnsVisited: parsedSql.columnList,
            tablesVisited: parsedSql.tableList,
            schema: null
        }
        expect(output[0]).to.deep.equal(expected)
    })
    it('parses 1000 lines from the slow query log', async () => {
        const fileStream = fs.createReadStream(path.join(__dirname, 'admin.txt'), { encoding: 'utf8' })
        const output = await parseStream(fileStream)
        expect(output.length).to.equal(200)
    })

    it('parses a large logfile', async () => {
        const logFile = fs.readFileSync(path.join(__dirname, 'logfile.txt'), { encoding: 'utf8' })
        const parser = new LogFileParser()
        for (const line of logFile.split('\n')) {
            parser.parseLine(line)
        }
        let count = 0
        for (const entry of parser.entries) {
            if (entry.client && entry.data && entry.time)
                count++
            else {
                console.log(entry)
                assert.fail(entry)
            }
        }
        console.log({count})
    }).timeout(10000)
})