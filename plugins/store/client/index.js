import Vue from 'vue'
import { deepCopy, isObject, isArray } from '../helper.js'

import Active  from './modules/active'
import RESTful from './modules/RESTful'
import Crud    from './modules/crud'

export default class {

    constructor(opt={}){
        this.options = Object.assign({
            fetch: {
                ajax: null,
                socket: null,
                handle: 'auto'
            },
            sqlite: null
			// localCache: null,
			// md5: null,
        },opt)
        this.fetch = this.options.fetch
    }
    register(name,opt){

    }
    install(opt){

        let options = Object.assign({ state: {}, actions: {}, mutations: {}, getters: {} },opt)
        let name = options.store.toUpperCase()

         // 赋值全局变量        
        options.state.ajax = []
        options.state.models = []
        options.state.actions = []
        options.state.mutations = []
        options.state.common = { options: {} }

        // 遍历所有 state 查找 dgx 模块并创建方法
        for(let model in options.state){
            if(isObject(options.state[model]) && options.state[model].options){

                // 模块通用状态属性
                options.state.ajax[model] = 0
                options.state.models.push(model)

                options.state[model] = Object.assign({
                    name: model,
                    auth: options.state[model].options.auth ? options.state[model].options.auth : (options.auth ? options.auth : null),
                    init: false,
                    loading: false,
                    editing: false,
                    ajax: [],
                    error: false,
                    page: 1,
                    total: null,
                    count: undefined,
                    empty: false,
                    list: [],
                    id: null,
                    active: null,
                    item: null,
                },options.state[model])

                Active(options,model)

                // 备份重置对象
                options.state[model].reset = deepCopy(options.state[model])
                // 带有 RESTful 
                RESTful(options,model)
            }
        }

        options = this.Fetch(options)
        Crud(options)

        return {
            namespaced: true,
            ...options
        }
    }

    Fetch(opt){
        let store = opt.store.toUpperCase()

        opt.state.actions.push('FETCH')
        opt.actions['FETCH'] = ({ state, dispatch, commit },config={})=> {

            let model = config.model || 'common'
            let base = model
            let { method, silent, only, middleware } = config

            // 检测是否重复，如果重复则取消之前相同的方法
            // if(only){
            //     commit('FETCH_CANCEL',[model, only ]) //console.warn('dgx 请求重复，自动取消前一个请求。',config)
            // }

            if(!config.headers){
                config.headers = {}
            }
            if(state[model].auth){
                config.headers['Auth'] = state[model].auth
                if(!config.auth){
                    config.auth = state[model].auth
                }
            }
            if(config.auth){
                config.headers['Auth'] = config.auth
            }

            // 返回 Fetch 方法
            return new Promise((resolve, reject)=>{
                const callback = {
                    // 成功回调
                    success: res => {
                        commit('STORE_UPDATE',[ model, 'init', true ])
                        commit('STORE_UPDATE',[ model, 'error', false ])
                        dispatch(`FETCH_FINISH`,[ model, res.config.id ])
                        resolve({ ...res.data, config: res.config })
                    },
                    // 失败回调
                    error: res => {
                        if(res && res.config && res.config.id){
                            dispatch('FETCH_FINISH',[ model, res.config.id ])
                        }
                        commit('STORE_UPDATE',[ model, 'error', true ])
						console.log('dgx ajax error',res)
                        reject({ ...res.data, config: res.config ? res.config : {} })
                    }
                }
                const getCancel = (id,cancel) => {
                    commit('STORE_ADD',[ model, 'ajax', { id, model, only, method, cancel, silent } ])
                    // commit(`${store}_ADD`,{ base, key: 'ajax', value: { id, model, only, method, cancel, silent } })
                    commit('FETCH_UPDATE',[model])
                }

                if(this.fetch.socket && this.fetch.socket.status === 'online' && this.fetch.handle === 'auto' && config.use != 'ajax'){
                    config.use = 'socket'
                    return this.fetch.socket.proxy({ getCancel, ...config }).then( callback.success, callback.error )
                }else{
                    config.use = 'ajax'                    
                    return this.fetch.ajax({ getCancel, ...config }).then( callback.success, callback.error )
                }
            })
        }

        // Fetch 结束请求
        opt.state.actions.push('FETCH_FINISH')
        opt.actions['FETCH_FINISH'] = ({ state, dispatch, commit },[model,id]=[])=> {
            for(let i=0; i<state[model].ajax.length; i++){
                if(state[model].ajax[i].id == id){
                    commit('STORE_REMOVE',{ base: model, key: 'ajax', index: i })
                    return commit('FETCH_UPDATE',[model])
                }
            }
        }

        // Fetch 取消请求
        opt.state.mutations.push(`FETCH_CANCEL`)
        opt.mutations[`FETCH_CANCEL`] = (state,config={})=> {
            let opt = Object.assign({ model: undefined, only: undefined, id: undefined },config)
            let models = opt.model ? opt.model : state.models
            if(typeof models != 'object'){
                models = [models]
            }
            finish:
            for(let m of models){
                for(let i=0;i<state[m].ajax.length;i++){                
                    // 当存在 only 条件时且不满足 only 条件时候进行 break 操作
                    if(opt.only !== undefined && opt.only != state[m].ajax[i].only){
                        break
                    }
                    // 当存在 id 条件时且不满足 id 条件时候进行 break 操作
                    if(opt.id !== undefined && opt.id != state[m].ajax[i].id){
                        break
                    }
                    // 剩余为满足取消条件
                    state[m].ajax[i].cancel()
                    state[m].ajax.splice(i,1)
                    break finish
                }
            }
        }

        // Fetch 数据更新
        opt.state.mutations.push('FETCH_UPDATE')
        opt.mutations['FETCH_UPDATE'] = (state,[model]=[])=> {
            let loading = 0
            let editing = 0
            for(let fetch of state[model].ajax){
                if(fetch.method){
                    let method = fetch.method.toUpperCase()
                    if(method === 'GET'){
                        loading += 1
                    }else if(~['POST','PUT','DELETE'].indexOf(method)){
                        editing += 1
                    }
                }
            }
            Vue.set(state[model],'loading',loading)
            Vue.set(state[model],'editing',editing)
        }
        
        // Fetch 数据移除
        opt.state.mutations.push('FETCH_REMOVE')
        opt.mutations['FETCH_REMOVE'] = (state,[ model, index ]=[])=> {
			 state[model].ajax.splice( index, 1)
		}
        return opt
    }
}