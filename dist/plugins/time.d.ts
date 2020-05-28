/**
 *  Time && UnTimestamp
 * @param date [string | int | Date | undefined]
 * @param format string like 'yyyy-MM-dd hh:mm:ss'
 */
declare const Time: (time?: number | string | Date | undefined, format?: string) => string;
declare const Timestamp: (date?: number | Date | undefined) => number;
export { Time, Timestamp };
