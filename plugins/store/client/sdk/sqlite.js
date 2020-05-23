import Vue from 'vue'

class Sqlite {
	constructor(opt={}){
		this.options = Object.assign({
			prefix: 'table_',
			mode: 'chorme',
			name: 'project', // 数据库名
			version: "1.0", // 版本号
			explain: '数据库描述', // 说明
			size: 1024 * 1024, // 数据库大小
			table: {},
			devtools: false
		},opt)

		this.name = null // 模型名
		this.prefix = this.options.prefix // 表前缀
		this.table = {} // 表格式
		this.ready = false // 是否初始化
		this.Pool = {}
		this.reset()

		let { mode, name, version, explain, size } = this.options
		this.dbKey = `${mode}_${name}_${version}`
		if(mode === 'chorme'){
			// 谷歌浏览器
			if(!this.Pool[this.dbKey]){
				try{
					this.Pool[this.dbKey] = window.openDatabase(name,version,explain,size)
				}catch(e){
					console.error('splite [chorme] is not support.')
				}
			}
			if(this.Pool[this.dbKey]){
				this.init()
			}
		}else if(mode === 'uniapp'){
			// UNIAPP
			try{
				console.log(123456)
				console.log(name)
				console.log(`_doc/${name}.db`)
				let path = `_doc/${name}.db`
				let isOpen = plus.sqlite.isOpenDatabase({ name, path, success: (res)=>{ console.log('isOpen-',res) } })
				console.log('isOpen:',isOpen)
				console.log(isOpen)
				plus.sqlite.openDatabase({
					name, path,
					success: (e)=>{
						this.log('splite [uniapp] open success.')
						this.init()
					},
					fail: (e)=>{
						console.log('splite [uniapp] open fail.',JSON.stringify(e))
						this.init()
						//this.create('test',[{ name:'age', type: 'integer' },{ name:'username', type: 'text'}])
					}
				})
			}catch(e){
				console.log('splite [uniapp] is not.')
			}
		}else{
			this.log('sqlite modee error')
		}
	}

	// 获取客户端实例
	get client(){
		return this.Pool[this.dbKey]
	}

	init(){
		//this.ready = false
		//this.table = {}
		Vue.set(this,'ready',false)
		Vue.set(this,'table',{})
		this.execute(`SELECT * from sqlite_master WHERE name LIKE '${this.prefix}%';`,'select').then(res=>{
			if(!res.err){
				for(let row of res.data){
					let { name, sql, type } = row
					let obj = { name, sql, type, map: {} }
					let keys = sql.substring(sql.indexOf('(')+1,sql.lastIndexOf(')')).split(',')					
					for(let item of keys){
						if(item[0] === ' '){
							item = item.substring(1,item.length)
						}
						if(item[item.length-1] === ' '){
							item = item.substring(0,item.length-1)
						}
						let name = item.split(' ')[0]
						let type = item.split(' ')[1]

						if(type.indexOf('(') > 0){
							type = type.substring(0,type.indexOf('('))
						}
						obj.map[name] = { name, type }
					}
					// this.table[name] = obj
					Vue.set(this.table,name,obj)
				}
				Vue.set(this,'ready',true)
				this.log(this.table)
			}
		})		
	}
	reset(){
		this._where = { deleted: 0 }
		this._limit = { page: null, size: null }
		this._order = ''
	}
	log(...msg){
		if(this.options.devtools){
			console.log(...msg)
		}
	}
	// 创建表
	create(name,keys,{ force=false }={}){
		name = this.prefix + name
		let sql = `CREATE TABLE if not exists ${name} ( id integer primary key autoincrement`
		keys = keys.concat([{ name: 'time_create', type: 'datetime' }, { name: 'time_update', type: 'datetime' }, { name: 'deleted', type: 'integer(1) DEFAULT 0' } ])
		for(let item of keys){
			if(typeof item === 'string'){
				sql += `, ${item} text`
			}else{
				let { name, type, length, default: def } = item 
				sql += `, ${name} ${type}`
			}
		}
		sql += ' );'
		return this.execute(sql,'create')
	}
	// 删除表
	drop(name){
		name = this.prefix + name
		let sql = `DROP TABLE ${name};`
		return this.execute(sql,'drop')
	}
	// 清空表
	truncate(name){
		name = this.prefix + name
		return this.execute(`DELETE FROM ${name};`,'truncate').then(res=>{
			if(!res.err){
				return this.execute(`DELETE FROM sqlite_sequence WHERE name = '${name}';`,'delete').then(subres=>{
					return res
				})
			}else{
				res.err = 404
				res.data = false
				res.msg = 'not found.'
				return res
			}
		})
	}

	// 执行语句
	execute(sql,type){
		return new Promise((resolve,reject)=>{			
			let { mode, name } = this.options
			if(mode === 'chorme'){
				// 谷歌模式
				this.client.transaction(trans=>{
					trans.executeSql(sql,[],
						(trans,res)=>{
							this.log('sqlite execute success.',res)
							let data = []
							if(res.rows && res.rows.length){
								data = Array.from(res.rows)
							}
							let insert = null
							let affected = res.rowsAffected
							if(type === 'insert'){
								insert = res.insertId
							}
							resolve({ err: 0, msg: 'success', sql, data, affected, insert })
						},
						(trans,err)=>{
							this.log('sqlite execute error.',err,sql)
							resolve({ err: 1, msg: err.message, sql, data: null })
						}
					)
				})
			}else if(mode === 'uniapp'){				
				let path = `_doc/${name}.db`
				let userkey = type === 'select' ? 'selectSql' : 'executeSql' // uni模式 [executeSql,selectSql]
				console.log('userkey',userkey)
				plus.sqlite[userkey]({
					name, path, sql,
					success: (res)=>{
						// ['select','find','count']
						this.log(`uniapp [${selectSql}] success!`)
						for(var i in res){
							console.log('',res[i])
						}

						console.log('sql - ',sql)
						console.log('res - ',JSON.stringify(res))

						let data = []
						let insert = null
						let affected = null
						// this.create('test',[{ name: 'nickname', tpye: 'text' },{ name: 'age', tpye: 'integer' }]).then(res=>{
						// 	this.model('test').add({ name: 'abc', age: 23 })
						// })
						resolve({ err: 0, msg: 'success', sql, data, affected, insert })
					},
					fail: (err)=>{
						this.log('uni executeSql fail!')

						console.log('sql - ',sql)
						console.log('err - ',JSON.stringify(err))

						resolve({ err: err.code, msg: err.message, sql, data: null })
					}
				})
			}else{
				resolve({ err: 1, msg: 'unknown sqlite mode.', sql, data: null })
			}
		})	
	}


	model(name){
		this.reset()
		this.name = this.prefix + name
		return this
	}
	where(opt={}){
		this._where = Object.assign(this._where,opt)
		return this
	}
	whereSQL(){
		let where = []
		let _logic = 'AND'
		if(this._where._logic && this._where._logic === 'OR'){
			_logic = 'OR'
		}
		for(let key in this._where){
			if(key[0] != '_' && this._where[key] != undefined){
				let value = this._where[key]
				let act = key
				let logic = '='
				let val = value

				if(typeof value === 'object' && value.length && value[0] && value[1]){
					if(typeof value[0] === 'string'){
						value[0] = value[0].toUpperCase()
					}
					if(['>','<','>=','<=','=','LIKE','NOT'].indexOf(value[0])){
						logic = value[0]
						val = value[1]
					}
				}else{
					val = value
				}
				if(typeof val === 'number'){

				}else if(val === 'string'){
					val = `${val}`
				}else if(val === null){
					val = 'NULL'
				}
				where.push(`${act} ${logic} ${val}`)
			}
		}
		if(where.length){
			return `WHERE ${where.join(` ${_logic} `)}`
		}
		return ''
	}
	order(opt){
		this._order = opt
		return this
	}
	orderSQL(){
		if(typeof this._order === 'object'){
			return `ORDER BY ${this._order.spilt(', ')}`
		}else if(this._order){
			return `ORDER BY ${this._order}`
		}
		return ''
	}
	page(opt){
		this._page = Object.assign(this._page,opt)
		return this
	}
	limit(size){
		this._limit.size = 1
		return this
	}

	// 查询列表
	select(page,size){
		let sql = `SELECT * FROM ${this.name} ${this.whereSQL()} ${this.orderSQL()};`
		return this.execute(sql,'select')
	}
	// 查询单条
	find(){
		let sql = `SELECT * FROM ${this.name} ${this.whereSQL()} ${this.orderSQL()} LIMIT 1;`
		return this.execute(sql,'select').then(res=>{
			if(!res.err && res.data && res.data[0]){
				res.data = res.data[0]
			}
			return res
		})
	}
	// 查询总条数
	count(){
		let sql = `SELECT COUNT(*) FROM ${this.name} ${this.whereSQL()};`
		return this.execute(sql,'select','count').then(res=>{
			if(!res.err && res.data && res.data[0]){
				res.data = res.data[0]['COUNT(*)']
			}
			return res
		})
	}

	// 插入数据
	add(obj={}){
		let keys = []
		let values = []
		let check = this._checkRowData(obj)
		if(check.err){
			return Promise.resolve(check)
		}
		let sql = `INSERT INTO ${this.name} (${check.data.keys.join(', ')}) VALUES (${check.data.values.join(', ')});`
		return this.execute(sql,'insert').then(res=>{
			if(!res.err && res.affected){
				res.data = true
			}else{
				res.err = 404
				res.data = false
				res.msg = 'not found.'
			}
			return res
		})
	}
	update(obj={}){
		let check = this._checkRowData(obj)
		if(check.err){
			return Promise.resolve(check)
		}
		let sql = `UPDATE ${this.name} SET ${check.data.sets.join(', ')} ${this.whereSQL()}`
		return this.execute(sql,'update').then(res=>{
			if(!res.err && res.affected){
				res.data = obj
			}else{
				res.err = 404
				res.data = false
				res.msg = 'not found.'
			}
			return res
		})
	}
	delete(force=true){
		if(force){
			// 物理删除
			let sql = `DELETE FROM ${this.name} ${this.whereSQL()};`
			return this.execute(sql,'delete').then(res=>{
				if(!res.err && res.affected){
					res.data = true
				}else{
					res.err = 404
					res.data = false
					res.msg = 'not found.'
				}
				return res
			})
		}else{
			// 逻辑删除
			return this.update({ deleted: 1 }).then(res=>{
				if(!res.err && res.affected){
					res.data = true
				}else{
					res.err = 404
					res.data = false
					res.msg = 'not found.'
				}
				return res
			})
		}
	}
	err(err=1,msg,sql,data=null){
		return { err, msg, sql, data }
	}

	_checkRowData(obj){
		let table = this.table[this.name]
		if(!table){
			return this.err(404,'table not found.')
		}
		let res = { keys:[], values: [], row: {}, sets: [] }
		for(let key in obj){
			if(table.map[key]){
				let value = obj[key]
				if(table.map[key].type === 'integer' || table.map[key].type === 'real'){
					if(typeof value != 'number'){
						value = Number(value)
					}
					if(!value && value !== 0){
						return this.err(403,'table key error.')
					}
					res.keys.push(key)
					res.values.push(value)
					res.row[key] = value
					res.sets.push(`${key} = ${value}`)
				}else{
					if(typeof value != 'string'){
						value = JSON.stringify(value)
					}
					res.keys.push(key)
					res.values.push(`'${value}'`)
					res.row[key] = value
					res.sets.push(`${key} = '${value}'`)
				}
			}
		}
		if(res.keys.length === 0){
			return this.err(403,'row data is empty.')
		}
		return { err: 0, data: res }
	}
}

export default Sqlite