<template lang="pug">
#nav(@click.self="toggleNav")
  .container
    .option
      RouterLink(to="/") 回首頁
    .option.signin(v-if="!userData" ) 
      RouterLink(to="/auth") 登入
    .option(v-if="userData") 
      RouterLink(to="/dashboard") {{ userData.category == "user" ? "管理紀錄" : "管理學員紀錄"}}
    .option(v-if="userData && userData.category == 'user'") 
      RouterLink(to="/dialog") 動滋一下
    .option.signout(@click="signOut" v-if="userData" ) 登出

</template>

<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
const router = useRouter()
const route = useRoute()
const navStatus = reactive({
  now: route.path,
})
const userData = inject("userData")

function signOut(){
  let yes = confirm("確定要登出了嗎？")
  if(!yes) return
  
  userData.value = null
  localStorage.userData = null
  localStorage.token = null

  router.push("/auth")
}

function toggleNav(e){
  let navEl = e.target
  navEl.classList.toggle("expand")
}

onMounted(()=>{
  let container = document.querySelector("#nav .container")
  let root = document.documentElement
  let defaultHeight = window.getComputedStyle(container).height
  root.style.setProperty("--default-height", defaultHeight)
  container.style.height = "0px"

})

// onBeforeRouteLeave((to, from, next)=>{
//   console.log("object");
//   navStatus.now = to.path

//   next()
// })

</script>

<style lang="sass" scoped>
:root
  --default-height: 0px
#nav
  border: 1px solid #000
  position: fixed
  right: 20px
  bottom: 20px
  width: 50px
  height: 50px
  border-radius: 50%
  background-color: #fff
  
.container
  display: block
  width: 100px
  height: auto
  transform: translate(-25px, -100%)
  // border: 1px solid #000
  transition: .3s
  overflow: hidden
.option
  // border: 1px solid #000
  color: #fff
  margin-bottom: 20px
  text-align: center
  cursor: pointer
  a
    text-decoration: none
    color: #fff
  &.signout
    color: $color_hint

#nav
  .option:not(.signout), .option:not(.signout) a
    &:hover
      color: $color_list
  

#nav.expand
  overflow: visible
  .container
    height: var(--default-height) !important
  .option
    &.hide
      display: none
      


</style>