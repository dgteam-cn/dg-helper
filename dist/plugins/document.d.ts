declare const big: any;
/**
 * 把字节数转换为指定的格式
 * @param {number} size - 原字节数大小
 * @param {number} [opt.round = 2] 保留几位小数
 * @returns {string}
 */
declare const fileSizeName: (size: number | string, { round }?: {
    round?: number;
}) => string;
