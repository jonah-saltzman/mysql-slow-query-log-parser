import { TimeLine, ConnectionLine, DataLine, SetTimeLine, QueryLine } from "./classes"

export enum LogFileLineType {
    UNK = "UNK",
    TIME = "TIME",
    CONNECTION = "CONNECTION",
    DATA = "DATA",
    SETTIME = "SETTIME",
    QUERY = "QUERY"
}

export const NextLineTypeConstructor = {
    "UNK": TimeLine,
    "TIME": ConnectionLine,
    "CONNECTION": DataLine,
    "DATA": SetTimeLine,
    "SETTIME": QueryLine,
    "QUERY": TimeLine
}

export const NextLineType: {[key in LogFileLineType]: LogFileLineType} = {
    "UNK": LogFileLineType.TIME,
    "TIME": LogFileLineType.CONNECTION,
    "CONNECTION": LogFileLineType.DATA,
    "DATA": LogFileLineType.SETTIME,
    "SETTIME": LogFileLineType.QUERY,
    "QUERY": LogFileLineType.TIME
}