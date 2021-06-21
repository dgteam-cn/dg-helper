/**
 * 函数防抖
 * 执行后会 wait 指定的时间之后调用绑定的方法，如果在时间内重复执行，会自动取消上一次并重新计算时间
 * @param {Function} func - 绑定的函数
 * @param {number} [wait = 0] - 需要防抖的时间（毫秒）
 * @param {object} opt
 * @param {boolean} [opt.leading = false] - 指定在延迟开始前调用
 * @param {number} opt.maxWait - 设置 func 允许被延迟的最大值
 * @param {boolean} [opt.trailing = false] - 指定在延迟结束后调用
 */
const debounce = require('lodash/debounce.js');
exports.debounce = debounce;
/**
 * 函数节流
 * 执行后会立即调用绑定的方法，并在一定时间内无法重复调用此方法
 * @param {Function} func - 绑定的函数
 * @param {number} [wait = 0] - 需要节流的时间（毫秒）
 * @param {object} opt
 * @param {boolean} [opt.leading = true] - 指定在延迟开始前调用
 * @param {boolean} [opt.trailing = true] - 指定在延迟结束后调用
 */
const throttle = require('lodash/throttle.js');
exports.throttle = throttle;
/**
 * Vue view 内节流或防抖调用案例
 * ==========================================
 * import {debounce, throttle} from "lodash";
 * module.exports = {
 *      data: function () {
 *          return {
 *              searchInput: '',
 *              filterKey: ''
 *          }
 *      },
 *      methods: {
 *          debounceInput() {
 *              this.filterKey = this.searchInput;
 *          },
 *          throttleInput: _.throttle(function() {
 *              this.filterKey = this.searchInput;
 *          }, 1000)
 *      },
 *      created(){
 *          this.debounceInput = debounce(this.debounceInput, 1000)
 *      }
 *  }
 * ==========================================
 */
// module.exports = {debounce, throttle}
