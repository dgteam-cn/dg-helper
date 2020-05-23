import Vue from 'vue'
import axios   from 'axios'
import config  from '~nuxt/plugins/config'
import Methods  from '~nuxt/plugins/methods'

var CancelToken = axios.CancelToken

const ajax = axios.create({
    baseURL : '/api',
    timeout : 15000,
    // withCredentials: true,
    // 转换为 from-data 格式
    // transformRequest: [function (data) {
    //     let ret = ''
    //     for (let it in data) {
    //       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //     }
    //     return ret
    // }],
})


// 添加请求拦截器
ajax.interceptors.request.use( config=> {
    if(!config.data){
        config.data = {}
    }
    // 添加 token
    let token = Methods.Cache('token')
    if(token){
        config.headers['Token'] = token
    }
    return config
}, error=> {
    console.warn('请求拦截器：请求错误',error)
    return Promise.reject(error);
})

// 添加响应拦截器
ajax.interceptors.response.use(res=>{
    if(res && res.status == 200){
        if(process.client){
            if(res.data.err && !res.config.trial){
                switch(res.data.err){
                    case 401:
                        Methods.Token(null)
                        window.App.Toast('请重新登陆')
                        window.App.Rd('login')
                        break;
                    default:
                        if(!res.config.silent){
                            let msg = res.data.msg
                            if(msg === 'parameter error!' && typeof res.data.data === 'object'){
                                try {
                                    for(let key in res.data.data){
                                        if(typeof res.data.data[key] === 'string'){
                                            msg = res.data.data[key]
                                            break
                                        }
                                    }
                                }catch(err){}
                            }
                            window.App.Err(msg)
                        }
                }
            }else{
                return res
            }
        }
    }
    console.warn(res,'响应拦截器：服务端错误');
    return Promise.reject(res)
}, error=> {
    console.warn('响应拦截器：本地网络错误，或服务器无响应',error)
    return Promise.reject({
        data : {
            err  : 500,
            data : null,
            msg  : `${error.name ? error.name + ':' : ''}${error.message}`
        }
    })
})

var count = 0
export default function(config={}){

    // 计数器
    count ++
    // 取消令牌
    let cancel = null
    let cancelToken = new CancelToken( fun=> {
        cancel = fun
        if(config.getCancel){
            config.getCancel(count,cancel)
        }
    })
    
    // 返回封装后的 ajax 对象
    return ajax({
        validateStatus : status=> {
            return status >= 200 && status < 600
        },
        id:count,
        cancelToken,
        cancel,
        ...config
    })
}