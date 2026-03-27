//引入安装的signalr包
import * as signalR from '@aspnet/signalr'
import local from '@/utils/auth'

const signal = new signalR.HubConnectionBuilder()
    //服务器地址
    .withUrl(process.env.VUE_APP_BASE_API + '/api/chatHub')
    // .withAutomaticReconnect([10000, 4000, 10000, 10000])
    .build()
//自动重连
async function start () {
  try {
    console.log('reconnect')
    await signal.start().then(() => {
      const userToken = local.getToken()
      if(userToken){
        signal.invoke("reloadConnnectAsync", userToken)
      }    
    });
    console.log('connected')
  } catch (err) {
    console.log(err)
    setTimeout(() => start(), 5000)
  }
}

signal.onclose(async () => {
  await start()
}) 



//将创建的signal赋值给Vue实例
export default {
    //install方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
    install: function(Vue) {
        Vue.prototype.signalr = signal
    }
}