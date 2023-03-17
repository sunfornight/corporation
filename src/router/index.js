import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/user/UserList.vue'
import Information from '../components/corporation/information.vue'
import List from '../components/client/list.vue'
import Shuju from '../components/user/Shuju.vue'
Vue.use(VueRouter)

const routes = [
 {
   path:"/",
   redirect:"/login"
 },
 {
   path:"/login",
   component: Login
 },
 {
  path:"/home",
  component: Home,
  redirect: "/welcome",
  children:[
    {path:"/welcome",component: Welcome},
    {path:"/userlist",component: UserList},
    {path:"/information",component: Information},
    {path:"/list",component: List},
    {path:"/shuju",component: Shuju}
  ]
}
]

const router = new VueRouter({ 
  routes
})

//挂载路由导航
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next();//若访问首页则放行
  //获取user信息
  const userFlag = window.sessionStorage.getItem("user");
  console.log(userFlag);
  if(!userFlag) return next('/login');//未获取到user信息，返回登入页面
  next();//放行
})
export default router
