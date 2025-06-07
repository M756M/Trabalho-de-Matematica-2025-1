export function parse(){};


export function parseArray(str: string): string[];
export function parseArray<T>(str: string, toType: (obj: string) => T): T[];

export function parseArray<T>(str: string, toType?: (obj: string) => T){
    const rawData = str.replace(/(\[|\]| )/g, "").split(",");
    return toType ? rawData.map((value) => toType(value)) : rawData;
};