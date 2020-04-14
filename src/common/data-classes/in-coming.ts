export interface GraphNodeIn {
    "identity": NeoInteger,
    "labels": string[],
    "properties": any
}

export interface NeoInteger {
    "low": number,
    "high": number
}
