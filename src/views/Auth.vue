<template lang="pug">
.container
  #box(v-if="type == 'signin'")
    form(type="signin")
      h1.title 歡迎登入
      .wrapper
        label(for="email") 信箱
        input(name="email" id="email")
      .wrapper
        label(for="password") 密碼
        input(type="password" name="password" id="password")
      .wrapper 
        input(type="submit" @click.prevent="signinSubmit" value="登入")
    .murmur 今天也來運動，辛苦囉！
    .changeType(@click="changeType" data-type="signup") 我要註冊
    .status(:class="{ error: error, ok: ok }" ref="statusEl")
  #box(v-if="type == 'signup'")
    form(type="signup")
      h1.title 歡迎註冊
      .wrapper
        label(for="username") 名稱
        input(name="username" id="username")
      .wrapper
        label(for="email") 信箱
        input(name="email" id="email")
      .wrapper
        label(for="password") 密碼
        input(type="password" name="password" id="password")
      .wrapper
        label(for="user") 用戶
        input(type="radio" name="category" id="user" value="user")
        label(for="coach") 個人教練
        input(type="radio" name="category" id="coach" value="coach")
      .wrapper 
        input(type="submit" @click.prevent="signupSubmit" value="註冊")
    .changeType(@click="changeType" data-type="signin") 我要登入
    .status(:class="{ error: error, ok: ok }" ref="statusEl")

  
</template>

<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()
const status = ref(null)
const type = ref("signin")
const error = ref(false)
const ok = ref(false)
const statusEl = ref(null)
const signupData = reactive({})
const emit = defineEmits(["signinSuccess"])
function signinSubmit(e){
    let signinForm = document.querySelector("form[type='signin']")
    
    const endPoint = import.meta.env.VITE_SERVER_URL + "api/auth"
    const formData = new FormData(signinForm)
    return fetch(endPoint, {
      method: "PUT",
      body: formData
    })
    .then( res => res.json() )
    .then( data => {
      if(data.ok){
        localStorage.token = data.token
        ok.value = true
        statusEl.value.textContent = "登入成功"
        
        emit("signinSuccess")
        router.push("/dashboard")
      } 
      else{
        error.value = true
        statusEl.value.textContent = "信箱或密碼輸入錯誤"
      }
      setTimeout(()=>{
        ok.value = false
        error.value = false
      }, 1000)
    })
}
function signupSubmit(e){
  let form = document.querySelector("form[type='signup']")
    
  const endPoint = import.meta.env.VITE_SERVER_URL + "api/auth"
  const formData = new FormData(form)
  return fetch(endPoint, {
      method: "POST",
      body: formData
    })
    .then( res => res.json() )
    .then( data => {
      if(data.ok){
        statusEl.value.textContent = "註冊成功"
        ok.value = true
        setTimeout(() => {
          type.value = "signin"
        }, 1000)
      }else{
        statusEl.value.textContent = data.msg
        error.value = true
      }
    })
}
function changeType(e){
  type.value = e.target.dataset.type
}

</script>

<style lang="sass" scoped>
#box
  width: 320px
  background-color: #fff
  padding: 20px 0px
  *
  text-align: center
form
  // border: 1px solid #000
h1.title
  margin-bottom: 20px
  color: $color_primary
.wrapper
  margin-bottom: 15px
label
  margin-right: 8px
input
  padding: 3px 5px
  color: #999
input[type='submit']
  cursor: pointer
  margin-top: 10px
  background-color: $color_primary
  color: #fff
  border: none
  padding: 5px 10px
  border-radius: 5px

.murmur, .changeType
  margin-bottom: 15px
.changeType
  cursor: pointer
  color: $color_primary
  font-weight: 300
  text-decoration: underline
.murmur
  color: #999
  font-weight: 300
  font-size: 0.8rem
.status
  color: #fff
  &.error
    color: red
  &.ok
    color: green

</style>