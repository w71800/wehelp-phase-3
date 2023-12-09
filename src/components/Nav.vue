<template lang="pug">
#nav(v-show="nowPath.fullPath !== '/auth'" @click.self="toggleNav" ref="nav")
  .container
    .option(
      :class="{ active: nowPath.fullPath == '/' }"
      v-if="userData?.category !== 'coach'")
      RouterLink(to="/") 
        //- https://www.flaticon.com/free-icon/home_25694?term=home&page=1&position=1&origin=search&related_id=25694
        img(v-if="isMobile && nowPath.fullPath !== '/'" src="../assets/img/nav_home.png")
        img(v-if="isMobile && nowPath.fullPath == '/'" src="../assets/img/nav_home_active.png")
        div 回首頁
    .option.signin(
      :class="{ active: nowPath.fullPath == '/auth' || nowPath.fullPath == '/' }" 
      v-if="!userData" ) 
      RouterLink(to="/auth") 
        //- https://www.flaticon.com/free-icon/log-in_3596092?term=sign+in&page=1&position=8&origin=search&related_id=3596092
        img(v-if="isMobile && nowPath.fullPath !== '/auth'" src="../assets/img/nav_signin.png")
        img(v-if="isMobile && nowPath.fullPath == '/auth'" src="../assets/img/nav_signin_active.png")
        div 登入
    .option(
      :class="{ active: nowPath.fullPath == '/dialog' || nowPath.fullPath == '/newpost' }" 
      v-if="userData && userData.category == 'user'") 
      RouterLink(to="/dialog") 
        //- https://www.flaticon.com/free-icon/add_2312400?term=add+list&page=1&position=7&origin=search&related_id=2312400
        img(v-if="isMobile && nowPath.fullPath !== '/dialog' && nowPath.fullPath !== '/newpost'" src="../assets/img/nav_addlist.png")
        img(v-if="isMobile && (nowPath.fullPath == '/dialog' || nowPath.fullPath == '/newpost')" src="../assets/img/nav_addlist_active.png")
        div 動滋一下
    .option(
      :class="{ active: nowPath.fullPath == '/dashboard' }" 
      v-if="userData")
      RouterLink(to="/dashboard") 
        //- https://www.flaticon.com/free-icon/bullet-list_4052102
        img(v-if="isMobile && nowPath.fullPath !== '/dashboard'" src="../assets/img/nav_lists.png")
        img(v-if="isMobile && nowPath.fullPath == '/dashboard'" src="../assets/img/nav_lists_active.png")
        div {{ userData.category == "user" ? "管理紀錄" : "管理學員紀錄"}}
    .option.signout(@click="signOut" v-if="userData" ) 
      //- https://www.flaticon.com/free-icon/logout_1828479?term=sign+out&page=1&position=2&origin=search&related_id=1828479
      img(v-if="isMobile" src="../assets/img/nav_signout.png")
      div 登出
  .hello(v-if="userData") 哈囉！ {{ hello }}

  

</template>

<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
const router = useRouter()
const nowPath = ref(useRoute())
const userData = inject("userData")
const hello = computed(()=>{
  return userData.value.username
})
const nav = ref(null)
const isMobile = ref(false)

watch(() => nowPath.value.fullPath, (newV, oldV) => {
  if(nav.value){
    nav.value.classList.remove("expand")
  }
})

function signOut(){
  let yes = confirm("確定要登出了嗎？")
  if(!yes) return
  
  userData.value = null
  localStorage.userData = null
  localStorage.token = null

  router.push("/auth")
}

function toggleNav(e){
  if(isMobile.value) return

  let navEl = e.target
  navEl.classList.toggle("expand")
}

function mobileInit(){
  let ww = window.innerWidth
  if(ww <= 871){
    isMobile.value = true
  }

  if(isMobile.value) return

  let container = document.querySelector("#nav .container")
  let root = document.documentElement
  let defaultHeight = window.getComputedStyle(container).height
  root.style.setProperty("--default-height", defaultHeight)
  container.style.height = "0px"
}


onMounted(()=>{
  mobileInit()
  
  let prevPos = 0
  window.onscroll = () => {
    let nowPos = window.scrollY
    if(prevPos < nowPos){
      nav.value.classList.add("inactive")
    }
    else{
      nav.value.classList.remove("inactive")
    }

    prevPos = nowPos
  }

})

</script>

<style lang="sass" scoped>
:root
  --default-height: 0px
#nav
  border: 1px solid #000
  position: fixed
  right: 40px
  bottom: 40px
  width: 50px
  height: 50px
  border-radius: 50%
  background-color: #fff
  border: 8px solid darken(#fff, 6)
  box-shadow: 0 0.4em darken(#fff, 25)
  transition: .3s cubic-bezier(.05,.69,.24,.97)
  cursor: pointer
  // overflow: hidden
  
.container
  display: block
  width: 100px
  height: auto
  transform: translate(-33px, -100%)
  transition: .3s
  overflow: hidden
  // box-shadow: inset 0px 0px 10px 2px rgba(black, .5)
.option
  // border: 1px solid #000
  color: #fff
  margin-bottom: 20px
  text-align: center
  cursor: pointer
  a
    text-decoration: none
    color: #fff
  img
    width: 23px
    height: 23px
  &.signout
    // color: $color_hint
  &.active
    pointer-events: none
    a, div
      color: #999
.hello
  width: 150px
  position: absolute
  bottom: -35px
  left: 50%
  text-align: center
  transform: translateX(-50%)
  font-size: 0.8rem
  color: #999


#nav
  .option:not(.signout), .option:not(.signout) a
    &:hover
      color: $color_list
  

#nav.expand
  overflow: visible
  box-shadow: 0 0.15em darken(#fff, 25)
  transform: translateY(.15em)
  background-color: lighten($color_hint, 10)
  border-color: $color_hint
  box-shadow: 0 .15em darken($color_hint, 25), 0 0 10px 6px rgba($color_hint, .5)
  .container
    height: var(--default-height) !important
  .option
    &.hide
      display: none

@media screen and (max-width: 871px)
  #nav
    width: 100%
    border-radius: 0px
    border: none
    right: 0
    bottom: 0
    height: auto
    &.inactive
      transform: translateY(100%)
    .container
      width: 100%
      height: 100% 
      transform: translate(0px, 0px)
      overflow: visible
      display: flex
      .option
        padding: 7px 0px
        flex: 1
        height: 100%
        margin: 0
        // border: 1px solid #000
        &.active
          a, div
            color: $color_primary
      div
        color: #888
        font-size: 0.8rem
      img
        display: block
        margin: 0 auto
        margin-bottom: 3px
      
</style>