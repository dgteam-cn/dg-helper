
// 随机字符串
export const randomString = function(len) {
　　len = len || 32;
　　let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　let maxPos = chars.length;
　　let pwd = '';
　　for (let i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

// 完美复制一个对象
export const extend = function(to, from) {
    for (var property in from) {
        var descriptor = Object.getOwnPropertyDescriptor(from, property);

        if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || !descriptor.get || !descriptor.set)) {
            Object.defineProperty(to, property, descriptor);
        } else {
            to[property] = from[property];
        }
    }
};

// 判断是否是空对象、数组
export const isEmpty = function(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

export const deepCopy = function(obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    }else if(JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
}
export const origin = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export const isObject = function(obj){
    return (obj && typeof obj === 'object' && !isArray(obj));
}


export const isArray = function(obj){
    if(Array.isArray){
        return Array.isArray(obj);
    }else{  
     	return Object.prototype.toString.call(obj)==="[object Array]";
    }  
}

export const isInt = function(obj){
    return (obj | 0) === obj
}