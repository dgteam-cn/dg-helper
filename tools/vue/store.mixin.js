module.exports = {
    data(){
        return {
            Page: 1,
            Filter: {},
            Editer: { view: false, title: null, form: null }
        }
    },
    computed: {
        Main(){
            if(this.StorePath){
                let [ model, store ] = this.StorePath
                return this.$store.state[model][store]
            }
            return {}
        },
        StorePath(){
            if(this.store) return this.store.split('/');
            if(this.Store) return this.Store.split('/');
            return null
        }
    },
    methods: {
        Get(page,paths,filter,opt={}){
            if(typeof page === 'string'){
                filter = paths
                paths = page
                page = null
            }
            let params = this.Origin( typeof filter === 'object' ? filter : this.Filter )
            params.page = page ? page : 1
            let { store, model, path } = this.ModelFormat(paths,'get')
            return this.Dp(path,{ ...opt, params }).then(res=>{
                return res
            })
        },
        GetInit(paths,params={},opt={}){
            let { store, model, path } = this.ModelFormat(paths,'get')
            return this.$store.state[store][model].init ? 
                Promise.resolve(this.$store.state[store][model].list) :
                this.Dp(path,{ ...opt, params }).then(res=>{
                    if(!res.err){
                        return res.data
                    }
                    return null
                })
        },
        Item(id,paths,params={}){
            let { store, model, path } = this.ModelFormat(paths,'get')
            return this.Dp(path,{ id, params }).then(res=>{
                if(!res.err){
                    if(Array.isArray(res.data)){
                        return res.data[0] ? res.data[0] : null
                    }
                    return res.data
                }
                return null
            })
        },
        LoadMore(paths,{ loading=false }={}){
            let { store, model, path } = this.ModelFormat(paths,'more')
            let main = this.$store.state[store][model]
            if(main.init && !main.loading && main.more && !main.empty){
                if(loading){
                    this.Loading()
                }
                let params = this.Origin( this.Filter ? this.Filter : {} )
                console.log(path,{ params })
                return this.Dp(path,{ params }).then(res=>{
                    if(loading){
                        this.HideLoading()
                    }
                    return res
                })
            }else{
                console.log(`无法加载更多 - init:${main.init} loading:${!main.loading} more:${main.more} empty:${!main.empty}`)
                return Promise.resolve(null)
            }
        },
        Action(name='POST',paths,data={}){
            let { path } = this.ModelFormat(paths,name)
            console.log('Action',name,paths,data)
            return this.Dp(path,data)
        },
        Active(item,paths){
            return this.Action('active',paths,item)
        },
        Post( data=this.Origin(this.Params), paths, callback ){
            let { path } = this.ModelFormat(paths,'post')
            if(!callback){
                callback = (res) =>{
                    if(res && !res.err){                        
                        this.Suc('操作成功')
                        this.$emit('finish',res ? res : 1)
                        this.view = false                        
                    }
                    return res
                }
            }
            return this.Dp(path,{ data }).then(callback)
        },
        Put( data=this.Origin(this.Params), paths, callback ){
            let { path } = this.ModelFormat(paths,'put')
            if(!callback){
                callback = (res) =>{
                    if(res && !res.err){                        
                        this.Suc('操作成功')
                        this.$emit('finish',res ? res : 1)
                        this.view = false                        
                    }
                    return res
                }
            }
            return this.Dp(path,{ data, id: data.id || data.sequence }).then(callback)
        },
        Del(data=this.Origin(this.Params),paths,callback,{ confirm=true }={}){
            let { path } = this.ModelFormat(model,'delete')
            if(!callback){
                callback = (res) =>{
                    if(res && !res.err){
                        this.Suc('删除成功')                        
                    }
                    return res
                }
            }
            return confirm ?
                this.DelConfirm(()=>{
                    return this.Dp(path,{ data, id: data.id }).then(callback)
                }) :
                this.Dp(path,{ data, id: data.id }).then(callback)
        },
        Clean(model=this.StorePath[1]){
            let path = `${this.StorePath[0]}/STORE_RESET`
            this.Cm(path,model)
        },
        Submit(model=this.StorePath[1],callback){
            let params = this.Origin(this.Params)
            return params.id ?
                this.Put(params,model,callback) :
                this.Post(params,model,callback)
        },
        Edit(row,title,model='Editer'){
            if(this[model]){
                this[model].view  = true
                this[model].title = title ? title : (row ? '修改数据' : '新增数据')
                this[model].form  = row ? this.Origin(row) : null
            }
        },
        Next(router,item,model=this.store){
            if(!item){
                this.Edit()
            }else if(item.id && model){
                let [ base, store ] = model.split('/')
                this.Dp(`${base}/ACTIVE_${store.toUpperCase()}`,item)
                this.$nextTick(()=>{
                    this.Go(router,{ id: item.id })
                })                
            }
        },
        Reset(model=this.StorePath[1]){
            let path = `${this.StorePath[0]}/STORE_RESET`
            return this.$store.commit(path,{name:model.toLowerCase()})
        },
        MakeFilterInit(){
            // if(this.key) this.key = null
            // if(this.timePicker) this.timePicker = null
            this.DataReset('Filter')
            // this.Filter = this.origin(this.$options.data().filter)
        },
        MakeFilter(query=[]){
            this.Page = 1
            this.Get(1)
        },



        Dp(name,data){
            return this.$store.dispatch(this.ModelFormat(name).path,data)
        },
        Cm(name,data){
            return this.$store.commit(this.ModelFormat(name).path,data)
        },

        // 模型格式化
        ModelFormat(paths,action=''){
            if(!paths){
                paths = this.store
            }
            if(typeof paths === 'string'){
                paths = paths.split('/')
            }
            let [ store, model ] = paths
            if(paths.length === 1 && this.StorePath){
                store = this.StorePath[0]
                model = paths[0]
            }
            let MODEL = model.toUpperCase()
            let ACTION = action.toUpperCase()            
            return { store, model, action, MODEL, ACTION, path: `${store}/${action ? `${ACTION}_` : '' }${MODEL}` }
        }
    }
}
