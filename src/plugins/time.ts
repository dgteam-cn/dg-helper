
/**
 *  Time && UnTimestamp
 * @param date [string | int | Date | undefined]
 * @param format string like 'yyyy-MM-dd hh:mm:ss'
 */

const Time = (time: number | string | Date | undefined = new Date(), format: string = "yyyy-MM-dd hh:mm:ss"): string => {
    if(time === null || time === undefined){
        time = new Date(0)
    }else if(typeof time === 'string'){
        if(time === '' || time === '0000-00-00' || time === '0000-00-00 00:00:00' || time === '0000-00-00 00:00'){
            time = new Date(0)
        }else{
            // time = new Date(time)
            time = new Date(time.replace(/-/g, "/")) // 为了支持 Safari 浏览器
        }
    }else if(typeof time === 'number'){
        if(time % 1 === 0 && time < 10000000000){
            time = new Date(time * 1000) // 如果时间戳单位是秒，则自动转为毫秒
        }else{
            time = new Date(time)
        }
    }
    const date: any = {
        "M+": time.getMonth() + 1,
        "d+": time.getDate(),
        "h+": time.getHours(),
        "m+": time.getMinutes(),
        "s+": time.getSeconds(),
        "q+": Math.floor((time.getMonth() + 3) / 3),
        "S+": time.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
        }
    }
    return format
}

const Timestamp = (date?: number | Date): number => {
    const time: Date = date ? new Date(date) : new Date()
    return Date.parse(time.toString()) / 1000
}

export { Time, Timestamp }