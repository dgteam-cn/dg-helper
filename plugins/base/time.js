const time = {
    Time: (data,format="yyyy-MM-dd hh:mm")=>{
        if(data === null || data === undefined){
            data = new Date()
        }
        return this.UnTimestamp(data,format)
    },
    Timestamp: (date)=>{
        let time = date ? new Date(date) : new Date()
        return Date.parse(time) / 1000
    },
    UnTimestamp: (time=new Date(),format="yyyy-MM-dd hh:mm:ss") => {
        if(typeof time === 'string' || typeof time === 'number'){
            if(time % 1 === 0 && time < 10000000000){
                time = new Date(time * 1000) // 如果时间戳单位是秒，则自动转为毫秒
            }else{
                time = new Date(time)
            }
        }
        if(time === null || time === '0000-00-00 00:00:00' || time == ''){
            time = new Date(0)
        }
        let date = {
           "M+" : time.getMonth() + 1,
           "d+" : time.getDate(),
           "h+" : time.getHours(),
           "m+" : time.getMinutes(),
           "s+" : time.getSeconds(),
           "q+" : Math.floor((time.getMonth() + 3) / 3),
           "S+" : time.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
        }
        return format
    }
}

module.exports.Time = time.Time
module.exports.Timestamp = time.Timestamp
module.exports.UnTimestamp = time.UnTimestamp