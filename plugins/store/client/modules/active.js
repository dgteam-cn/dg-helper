import Vue from 'vue'
import { IsArray } from '../../base/determine.js'

    // 带有焦点属性
    // 传参 ：query or [query,db]
    // query :
    //  undefined or null 重置焦点
    //  {key:val} 检索第一个匹配的字段
    //  -1 0 x 查找指定索引（-1代表最后一个索引）
    // 焦点变化 mutations 方法

export default function(options,model){
    
    let store = options.store.toUpperCase()
    let MODEL = model.toUpperCase()

    options.actions[`ACTIVE_${MODEL}`] = ({state, dispatch, commit},active)=>{

        let db = 'list'
        if(IsArray(active) && active[0]){
            if(active[1]){
                db = active[1]
            }
            active = active[0]
        }
        if(active===undefined || active===null){
            // 重置
            dispatch(`ACTIVE_${MODEL}_RESET`)
        }else if(typeof active==="object"){

            // 以 对象条件 来确定焦点
            //let id = active.id
            let list = state[model].list
            for(let o in active){
                for(let i=0;i<list.length;i++){
                    if(list[i][o] && list[i][o] == active[o]){
                        return dispatch(`ACTIVE_${MODEL}_CHANGE`,{ id: list[i].id || undefined, active: i, item:list[i] })
                    }
                }
            }
        } else {
            // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
            if(active==-1){
                active = state[model].list.length > 0 ? state[model].list.length - 1 : 0
            }
            // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0
            let queue = [active, state[model].active, 0]
            for(let i=0;i<queue.length;i++){
                if(state[model].list[queue[i]]){
                    active = queue[i]
                    break
                }
            }
            // 如果列表存在键值
            if( state[model].list && state[model].list[active]){
                return dispatch(`ACTIVE_${MODEL}_CHANGE`,{ id:state[model].list[active].id, active, item:state[model].list[active] })
            }
            dispatch(`ACTIVE_${MODEL}_RESET`)
        }
    }

    // 数据变更
    options.actions[`ACTIVE_${MODEL}_CHANGE`] = ({state, dispatch, commit}, config={} )=> {
        for(let i of ['id','active','item']){
            if(config[i] || config[i]==0){
                commit(`${store}_UPDATE`,{ base:model, key:`${i}`, value:config[i] })                
            }
        }
        return config.item
    }

    // 数据重置
    options.actions[`ACTIVE_${MODEL}_RESET`] = ({state, dispatch, commit}, config={} )=> {
        for(let i of ['id','active','item']){
            commit(`${store}_UPDATE`,{ base:model, key:`${i}`, value:undefined })
        }
    }
}
