import Vue from 'vue'
import Config  from '~nuxt/plugins/config'
import Helper from '~nuxt/plugins/helper'
import Events from 'events'

const EventEmitter = Events.EventEmitter
const Event = new EventEmitter()

const WS_STATUS = {
    CONNECTING: 0, // 正在连接
    OPEN: 1, // 可以通信
    CLOSING: 2, // 关闭中
    CLOSED: 3 // 已关闭或未连接成功
}


class Socket {
    constructor(){
        this.wss = null
        this.status = 'close' // close-未开启  connect-正在连接  online-连接成功  offline-已关闭  shutdown-被强制关闭
        this.options = {
            url: Config.socket.center + '?type=web',
            timeout: 8000, // 代理返回超时时间
            count: 1, // 代理请求数量统计
        }
        this.retry = {
            enable: true, // 是否启用自动重连
            intervals: [1500,3000,5000,10000], // 自动重连间隔 
            attempt: 6, // 最大尝试次数
            timer: null, // 重连运行计时器
            count: 0, // 当前已重连次数
        }
    }
    get online(){
        return this.status === 'online'
    }
    get state(){ 
        if(this.wss && this.wss.readyState ){
            return this.wss.readyState 
        }
        return null
    }
    get Event(){
        return Event
    }
    connect(token){
        if(process.client && this.status != 'connect' && this.status != 'online') {
            if(!this.wss || this.wss.readyState === WS_STATUS.CLOSING || this.wss.readyState === WS_STATUS.CLOSED){                
                if(!token){
                    token = Helper.Cache('token')
                }
                const self = this
                const options = {
                    onopen(event){
                        //console.log('socket-onopen',event)
                        clearTimeout(self.retry.timer)
                        self.retry.enable = true
                        self.retry.count = 0
                        self.status = 'online'
                        self.ping()
                        Event.emit('status','online')
                    },
                    onmessage(message){
                        let data = JSON.parse(message.data)
                        Event.emit(`${data.event}`,data)
                        if(data.event == 'proxy' && data.message && data.message.id){
                            Event.emit(`proxy.${data.message.id}`,data.message)
                        }
                    },
                    onclose(event){                        
                        // this 指向 this.wss
                        //console.log('socket-close',event)
                        this.removeEventListener('open',options.onopen,false)
                        this.removeEventListener('message',options.onmessage,false)
                        this.removeEventListener('close',options.onclose,false)
                        this.removeEventListener('error',options.onerror,false)
                        
                        // 1006 网络连接（握手）失败
                        if(event.code === 1005){
                            //console.log('连接被服务端主动关闭')
                            self.retry.enable = false
                            self.retry.count = 0
                            self.status = 'shutdown'
                            Event.emit('status','shutdown')
                        }else if(self.retry.enable){
                            // 获取尝试重连间隔
                            if(self.retry.count < self.retry.attempt){
                                let interval = self.retry.intervals[self.retry.count - 1]
                                if(!interval){
                                    interval = self.retry.intervals[self.retry.intervals.length - 1]
                                }
                                self.status = 'connect'
                                Event.emit('status','connect')
                                clearTimeout(self.retry.timer)
                                let count = self.retry.count
                                self.retry.timer = setTimeout(()=>{
                                    self.connect()
                                    //console.log(`第${count}次重连，本次等待时间为${interval}`)
                                },interval)
                            }else{
                                //console.log('超过最大重连次数')
                                self.retry.enable = false
                                self.retry.count = 0
                                self.status = 'close'
                                Event.emit('status','close')
                            }
                        }else{
                            self.status = 'close'
                            Event.emit('status','close')
                        }
                    },
                    onerror(){
                        //console.log('socket-error')
                    },
                }

                this.wss = new WebSocket(this.options.url,token)
                this.retry.count ++
                this.wss.addEventListener('open',options.onopen,false)
                this.wss.addEventListener('message',options.onmessage,false)
                this.wss.addEventListener('close',options.onclose,false)
                this.wss.addEventListener('error',options.onerror,false)
            }
        }else{
            //console.log('socket err')
        }
    }
    close(){
        if(this.online){
            this.retry.E = false
            this.wss.close()
        }
    }
    ping(){
        setTimeout(()=>{
            if(this.status == 'online'){
                this.send('ping')
                this.ping()
            }
        },52000)
    }
    send(event,message={}){
        if(this.online){
            this.wss.send(JSON.stringify({ event, message }))
        }
        return false
    }
    room(){
        if(this.online){
            
        }
    }
    proxy({ method="GET", url="", auth="none", token=Helper.Cache('token'), verify="", data={}, params={}, getCancel, silent=false } = {}){
        if(this.online){
            let id = 'socket.' + this.options.count
            this.options.count++
            let errData = { err: 500, msg: 'server error.', data: null }
            let busyData = { err: 504, msg: 'server is busy.', data: null }
            let config = { id, method, url, auth, verify, data, params }
            let timer = null            
            return new Promise((resolve, reject)=>{
                // let time = Date.now()
                timer = setTimeout(()=>{
                    reject({ status: 504, config, data: busyData })
                    clearTimeout(timer)
                },this.options.timeout)
                if(getCancel){
                    getCancel(id,()=>{
                        // 取消
                        // reject({ status： 504, config, data: busyData })
                    })
                }
                Event.once(`proxy.${id}`,res=>{
                    let { status, data } = res
                    if(status === 200){
                        if(data.err && !silent){
                            console.log('socket fetch err',{ ...data, config })
                            if(data.err === 401){
                                // let App = getApp()
                                // App.$store.dispatch('base/RELOGIN')
                            }else{
                                let msg = data.msg
                                if(msg === 'parameter error!' && typeof data.data === 'object'){
                                    try {
                                        for(let key in data.data){
                                            if(typeof data.data[key] === 'string'){
                                                msg = data.data[key]
                                                break
                                            }
                                        }
                                    }catch(err){}
                                }
                                window.App.Err(msg)
                            }
                        }                    
                        resolve({ status, config, data })
                    }else{
                        reject({ status, config, data: errData })
                    }
                    clearTimeout(timer)
                })
                this.wss.send(JSON.stringify({ event: 'proxy', id, method, url, auth, token, verify, data, params }))
            })
        }else{
            return Promise.reject({ status: 500, config, data: errData })
        }
    }
}
const client = new Socket()

if(process.client){
    window.client = client
}

export default client