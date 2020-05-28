import big from 'big.js';
declare const Big: (opt: any) => big;
declare const Price: (num: string | number, { float, mode, force, separate, format, unit, }?: {
    float?: number | undefined;
    mode?: number | undefined;
    force?: boolean | undefined;
    separate?: number | undefined;
    format?: string | undefined;
    unit?: string | undefined;
}) => string | number | string[] | undefined;
declare const PriceUppercase: (price: number | string) => string;
declare const PrefixZero: (num: number | string, n: number) => string;
declare const Uuid: (len: number, radix?: number) => string;
export { Big, Price, PriceUppercase, PrefixZero, Uuid };
