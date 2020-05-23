import Vue from 'vue'
import { deepCopy } from '../../helper.js'

    // 带有焦点属性
    // 传参 ：query or [query,dataBase]
    // query :
    //  undefined or null 重置焦点
    //  {key:val} 检索第一个匹配的字段
    //  -1 0 x 查找指定索引（-1代表最后一个索引）
    // 焦点变化 mutations 方法

export default function(options,ajax){
    
    let store = options.store.toUpperCase()
    //let MODEL = model.toUpperCase()
    
    // 数据添加
    const MODEL_ADD = ( state, [ model, key='list', value, position=-1 ]=[] )=> {
        if(typeof position === 'string'){
            if(~['start','begin','head'].indexOf(position)){
                position = 0
            }else if(~['end','finish','foot','last'].indexOf(position)){
                position = -1
            }
        }
        if(position === 0){
            state[model][key].unshift(value)
        }else if(position === -1){
            state[model][key].push(value)
        } else if(Number.isInteger(position)){
            state[model][key].splice(position,0,value)
        }
    }
    options.mutations['STORE_ADD'] = (state,opt) => MODEL_ADD(state,opt)
    options.mutations['STORE_LIST_ADD'] = (state,[ model, value, position ]) => MODEL_ADD(state,[ model, 'list', value, position ])


    // 数据更新
    // 
    options.mutations[`${store}_UPDATE`] = (state, { base, key, value, id, sn, extend, } )=> {
    　  try {
            if(id || sn){
                let list = eval(`state.${base}.${key}`)
                for(let i=0; i<list.length; i++){
                    if(list[i].id == id || list[i].sn == id){
                        if(extend){
                            Object.assign(state[base][key][i],value)
                        }else{
                            eval(`state.${base}.${key}.splice(i,1,value)`)
                        }
                        break;
                    }
                }
            }else{
                if(extend){
                    Object.assign(state[base][key][i],value)
                }else{
                    eval(`state.${base}.${key} = value`)
                }
            }
    　　} catch(error) {
            console.info(`dgx error`,error)
    　　}　
    }
    const MODEL_UPDATE = ( state, [ model, key='list', value, extend=false ]=[] )=> {
        if(!extend){
            Vue.set(state[model],key,value)
        }        
    }
    options.mutations['STORE_UPDATE'] = (state,opt) => MODEL_UPDATE(state,opt)
    options.mutations['MODEL_UPDATE'] = (state,opt) => MODEL_UPDATE(state,opt)
    //options.mutations['STORE_LIST_UPDATE'] = (state,opt) => MODEL_UPDATE(state,opt)
    
    //
    //  数据移除
    //    
    options.mutations[`${store}_REMOVE`] = ( state, { base, key, id, index } )=> {
        if(id){
            let list = eval(`state.${base}`)[key]
            for(let i=0; i<list.length; i++){
                if(list[i].id == id){
                    eval(`state.${base}`)[key].splice( i, 1)
                    break;
                }
            }
        }else if(index || index == 0){
            eval(`state.${base}`)[key].splice(index,1)
        }else{
            delete eval(`state.${base}`)[key]
        }
    }
    //
    // 数据移除
    //
    options.mutations['STORE_REMOVE'] = ( state, { base, key, id, index } )=> {
        if(id){
            let list = eval(`state.${base}`)[key]
            for(let i=0; i<list.length; i++){
                if(list[i].id == id){
                    eval(`state.${base}`)[key].splice( i, 1)
                    break;
                }
            }
        }else if(index || index == 0){
            eval(`state.${base}`)[key].splice(index,1)
        }else{
            delete eval(`state.${base}`)[key]
        }
    }

    //  重置模块
    const MODEL_RESET = ( state, model )=> {
        if(model && state[model] && state[model].reset){
            let reset = deepCopy(state[model].reset)
            state[model] = deepCopy(reset)
            state[model].reset = deepCopy(reset)
        }
    }
    options.mutations['STORE_RESET'] = (state,opt) => MODEL_RESET(state,opt)
}
