import {
    LogFileLineType,
    NextLineTypeConstructor,
    NextLineType,
} from './types'

type LineParseErr = {
    expectedType: LogFileLineType
    badString: string
    error: string
}

class BaseLine {
    public rawString: string
    protected tokens: string[]

    constructor(inputLine: string) {
        this.rawString = inputLine
        this.tokens = this.rawString.split(/(\s+)/)
    }
}

export class TimeLine extends BaseLine {
    public lineType: LogFileLineType = LogFileLineType.TIME
    public timestamp: Date
    constructor(inputLine: string) {
        super(inputLine)
        try {
            if (this.tokens.length !== 3 || this.tokens[0] !== '#') {
                throw 'Malformed line'
            }
            this.timestamp = new Date(this.tokens[2])
        } catch (err) {
            throw {
                expectedType: LogFileLineType.TIME,
                badString: this.rawString,
                error: typeof err === 'string' ? err : 'Unparseable timestamp'
            }
        }
    }
}

export class ConnectionLine extends BaseLine {
    public lineType: LogFileLineType = LogFileLineType.CONNECTION
    public user: string
    public host: string
    public connectionId: number
    constructor(inputLine: string) {
        super(inputLine)
        try {
            if (this.tokens[0] !== '#') {
                throw 'Malformed line'
            }
            this.user = this.tokens[this.tokens.indexOf('User@Host:') + 1]
            this.host = this.tokens[this.tokens.indexOf('@') + 1]
            this.connectionId = parseInt(this.tokens[this.tokens.indexOf('Id:') + 1])
        } catch (err) {
            throw {
                expectedType: LogFileLineType.TIME,
                badString: this.rawString,
                error: typeof err === 'string' ? err : 'Unparseable timestamp'
            }
        }
    }
}

export class DataLine extends BaseLine {
    public lineType: LogFileLineType = LogFileLineType.TIME
    public queryTime: number
    public lockTime: number
    public rowsExamined: number
    public rowsSent: number
    constructor(inputLine: string) {
        super(inputLine)
        try {
            if (this.tokens.length !== 9 || this.tokens[0] !== '#') {
                throw 'Malformed line'
            }
            this.queryTime = parseFloat(this.tokens[this.tokens.indexOf('Query_time:') + 1])
            this.lockTime = parseFloat(this.tokens[this.tokens.indexOf('Lock_time:') + 1])
            this.rowsExamined = parseInt(this.tokens[this.tokens.indexOf('Rows_examined:') + 1])
            this.rowsSent = parseInt(this.tokens[this.tokens.indexOf('Rows_sent:') + 1])
        } catch (err) {
            throw {
                expectedType: LogFileLineType.TIME,
                badString: this.rawString,
                error: typeof err === 'string' ? err : 'Unparseable timestamp'
            }
        }
    }
}

export class SetTimeLine extends BaseLine {
    public lineType: LogFileLineType = LogFileLineType.TIME
    public timestamp: number
    constructor(inputLine: string) {
        super(inputLine)
        try {
            if (this.tokens.length !== 2 || this.tokens[0] !== 'SET') {
                throw 'Malformed line'
            }
            this.timestamp = parseInt(this.tokens[1])
        } catch (err) {
            throw {
                expectedType: LogFileLineType.TIME,
                badString: this.rawString,
                error: typeof err === 'string' ? err : 'Unparseable timestamp'
            }
        }
    }
}

export class QueryLine extends BaseLine {
    public lineType: LogFileLineType = LogFileLineType.TIME
    public timestamp: Date
    constructor(inputLine: string) {
        super(inputLine)
        try {
            if (this.tokens.length !== 3 || this.tokens[0] !== '#') {
                throw 'Malformed line'
            }
            this.timestamp = new Date(this.tokens[2])
        } catch (err) {
            throw {
                expectedType: LogFileLineType.TIME,
                badString: this.rawString,
                error: typeof err === 'string' ? err : 'Unparseable timestamp'
            }
        }
    }
}

class LogFileEntry {

}

class LogFileParser {
    private prevLineType = LogFileLineType.UNK

    private TIME: TimeLine | undefined
    private CONNECTION: ConnectionLine | undefined
    private DATA: DataLine | undefined
    private SETTIME: SetTimeLine | undefined
    private QUERY: QueryLine | undefined

    parseLine(lineString: string) {
        try {
            this[NextLineType[this.prevLineType]] = new NextLineTypeConstructor[this.prevLineType](lineString)
        } catch(err) {
            this.prevLineType = LogFileLineType.UNK
            throw err
        }
    }
}