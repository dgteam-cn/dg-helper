import big from 'big.js';
declare const Big: (opt: any) => big;
/**
 * @name 将数字转换为可以显示的格式（价格模式）
 * @param opt.float [number] 保留几位小数
 * @param opt.mode [number] 小数（尾数）取整方式，见下方 floatdir 对象具体解释
 * @param opt.force [number] 若为真，小数不足 float 字段位数时，将会强制补 0
 * @param opt.separate [number] 每间隔多少位数加入逗号 例如：10000000 一千万 输出为 10,000,000，若填 0 或 false 将取消逗号分隔符
 * @param opt.format [number] string - 返回字符串  array - 返回数组
 * @param opt.unit [number] 输出单位，可传入 个 十 百 千 万
 * @return string | array
 */
export interface priceOptions {
    float?: number;
    mode?: number;
    force?: boolean;
    separate?: number | boolean;
    format?: string;
    unit?: string;
}
declare const Price: (num: string | number, { float, mode, force, separate, format, unit }?: priceOptions) => number | string | string[];
/**
 * @name 将数字价格转换为中文大写价格
 * @param price [number | string] 价格
 * @return string
 */
declare const PriceUppercase: (price: number | string) => string;
/**
 * @name 强制浮点位数，不足的强制补 0
 * @param num [number | string] 数值
 * @return string
 */
declare const PrefixZero: (num: number | string, n: number) => string;
/**
 * @name 随机生成一段字符串
 * @param len [number] 长度
 * @return string
 */
declare const Uuid: (len: number, radix?: number) => string;
export { Big, Price, PriceUppercase, PrefixZero, Uuid };
