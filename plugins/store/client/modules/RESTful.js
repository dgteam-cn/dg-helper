import Vue from 'vue'

    // 带有焦点属性
    // 传参 ：query or [query,dataBase]
    // query :
    //  undefined or null 重置焦点
    //  {key:val} 检索第一个匹配的字段
    //  -1 0 x 查找指定索引（-1代表最后一个索引）
    // 焦点变化 mutations 方法

export default function(options,model,ctx){
    
    let store = options.store.toUpperCase()
    let MODEL = model.toUpperCase()
    let opt = options.state[model].options
    if(opt.url){
        for(let action of [
			{ name: 'GET', method: 'GET' },
			{ name: 'MORE', method: 'GET' },
			{ name: 'POST', method: 'POST' },
			{ name: 'PUT', method: 'PUT' },
			{ name: 'DELETE', method: 'DELETE' },
		]){
			let { name, method } = action
			let path = `${name}_${MODEL}`
            options.actions[path] = ({ state, dispatch, commit },data={})=> {
				let fetchData = {
					method,
					url: data.id ? `${opt.url}/${data.id}` : opt.url,
					data: data.data || {},
					params: data.params,
					model,
					only: data.only !== undefined ? data.only : ( method === 'GET'),
					silent: data.silent ? true : false
                }
				if(name === 'MORE'){
					fetchData.params.page = state[model].page + 1
				}
				const fetchHandle = res=>{
                    if(res && res.data){
                        switch(method){
                            case 'GET':
                                if(data.id || res.data.id || res.data.sn){
                                    // 单行数据
                                    commit('STORE_UPDATE',[ model, 'item', res.data ])
                                    commit('STORE_UPDATE',[ model, 'id', data.id ])
                                }else if(Array.isArray(res.data)){
                                    // 列表数据
									if(name === 'MORE'){
										commit('STORE_MORE',[ model, 'list', res.data ])
									}else{
										commit('STORE_UPDATE',[ model, 'list', res.data ])
									}
                                    commit('STORE_UPDATE',[ model, 'page', res.page ])
                                    commit('STORE_UPDATE',[ model, 'count', res.count != undefined && res.count >= 0 ? res.count : undefined ])
                                    commit('STORE_UPDATE',[ model, 'total', res.total ])
                                    commit('STORE_UPDATE',[ model, 'empty', res.page == 1 && !res.data.length ? true : false ])
									commit('STORE_UPDATE',[ model, 'more', res.page < res.total ])
                                }else{
                                    // 特殊数据
                                    commit('STORE_UPDATE',[model, 'list', res.data || res ])
                                    commit('STORE_UPDATE',[model, 'item', res.data || res ])
                                }
                                break;
                            case 'POST':
                                if(opt.linkage || opt.linkage === undefined){
                                    if(state[model].count != undefined && state[model].count >= 0){
                                        commit('STORE_UPDATE',[ model, 'count', state[model].count + 1 ]) // 影响统计数
                                    }
                                }
                                break;
                            case 'PUT':
                                if(opt.linkage || opt.linkage === undefined){
									// commit('STORE_EXTEND_ROW',[ model, res.data ])
                                    // options.mutations[`${store}_UPDATE`] = (state, { base, key, value, id, sn, extend, } )=> {
                                }
                                break;
                            case 'DELETE':
                                if(opt.linkage || opt.linkage === undefined){
                                    commit('STORE_REMOVE',{ id: data.id, base: model, key: 'list' })
                                    if(state[model].item && state[model].item.id === data.id){
                                        commit('STORE_UPDATE',[ model, 'id', null ])
                                        commit('STORE_UPDATE',[ model, 'active', null ])
                                        commit('STORE_UPDATE',[ model, 'item', null ])
                                    }
                                    if(state[model].count != undefined && state[model].count > 0){
                                        commit('STORE_UPDATE',[ model, 'count', state[model].count - 1 ]) // 影响统计数
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    if(data.active || data.active == 0){
                        dispatch(`ACTIVE_${MODEL}`,data.active)
                    }
                    return res
				}
				
                return dispatch('FETCH',fetchData).then( res=> {
					// 中间件
					// if(data.middleware && typeof data.middleware ==="function"){
					// 	return data.middleware(res,fetchHandle)
					// }
					return fetchHandle(res)
                },err=>{
					return err
				})
            }
        }
    }
}
