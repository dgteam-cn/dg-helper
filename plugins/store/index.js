import Vue from 'vue'
import dgx from '~nuxt/plugins/dgx/main.js'
import ajax from '~nuxt/plugins/ajax.js'
import socket from '~nuxt/plugins/socket.js'
import Sqlite from '~nuxt/plugins/sqlite.js'

var sqlite = null
if(process.client) {
	sqlite = new Sqlite({
		prefix: 'bo_',
		mode: 'chorme',
		name: 'bo', // 数据库名
		version: "1.0", // 版本号
		// explain: '数据库描述', // 说明
		// path: '', // 文件路径
		size: 1024 * 1024, // 数据库大小
		table: {}, // 表同步
		devtools: true
	})
	window.DB = sqlite
}

const DGX = new dgx({
    fetch: {
        ajax, socket, handle: 'auto', // ajax auto
    },
    sqlite,
})
export default DGX