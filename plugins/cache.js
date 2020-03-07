module.exports = {
    // 缓存
    // Cache(key,val,timeout){
    //     if(key){
    //         let date = Date.now()
    //         if(val===null){
    //             // 清除缓存
				// uni.removeStorageSync(key)
    //             uni.removeStorageSync(`${key}_timeout`)
    //             return null
    //         }else if(val===undefined && timeout===undefined){
    //             // 获取缓存
    //             let cache = uni.getStorageSync(key)
    //             if(cache === undefined){
    //                 return undefined
    //             }else{
    //                 let expired = uni.getStorageSync(`${key}_timeout`)
    //                 // if(expired){
    //                 //     console.log('Cache GET',key,date,expired,date > expired)
    //                 // }
    //                 if(expired && date > expired){
    //                     uni.removeStorageSync(key)
    //                     uni.removeStorageSync(`${key}_timeout`)
    //                     return undefined
    //                 }
    //                 return cache
    //             }
    //         }else if(val !== undefined){
    //             // 存储缓存
    //             if(timeout){
    //                 let throughSecond = 0
    //                 if(typeof timeout === 'number'){
    //                     throughSecond = timeout
    //                 }else if(typeof timeout === 'string'){
    //                     let number = parseInt(timeout)
    //                     let unit = timeout.charAt(timeout.length-1)
    //                     if(number && number > 0){
    //                         if(unit === 'd' || unit === 'day' || unit === 'D'){
    //                             throughSecond = number * 60 * 60 * 24
    //                         }else if(unit === 'h' || unit === 'hour' || unit === 'H'){
    //                             throughSecond = number * 60 * 60
    //                         }else if(unit === 'm' || unit === 'minute' || unit === 'H'){
    //                             throughSecond = number * 60
    //                         }else{
    //                             throughSecond = number
    //                         }
    //                     }
    //                 }
    //                 if(throughSecond){
    //                     let expired = throughSecond * 1000 + Date.now()
    //                     uni.setStorageSync(`${key}_timeout`,expired)
    //                 }
    //             }
    //             return uni.setStorageSync(key,val)
    //         }
    //     }
    //     return undefined
    // },
    // CacheClean(){
    //     uni.clearStorage()
    // },
}