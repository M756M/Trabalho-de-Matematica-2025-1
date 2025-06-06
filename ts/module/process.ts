export function handleOutput(output: string, errorMessage: string): [number, number, number] {
    if(errorMessage) throw new Error(errorMessage);
    if(!/\[\d+(?:\.\d+)?, *\d+(?:\.\d+)?, *\d+(?:\.\d+)?\]/.test(output)){
        throw new Error("O arquivo do octave tá dando pau");
    };

    return parseArray(output, Number) as [number, number, number];
};

function parseArray<T>(str: string, toType: (obj: string) => T): T[];
function parseArray<T>(str: string): string[];

function parseArray<T>(str: string, toType?: (obj: string) => T) {
    if(typeof str !== "string") throw new TypeError("'str' parameter must be of type 'string'");
    if(typeof toType !== "function") throw new TypeError("'toType' parameter must be of type 'function'");

    const arr = str.replaceAll(/(\[|\])/g, "").split(",");

    return arr.map((val) => toType ? toType(val) : val);
};