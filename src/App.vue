<script setup>
import { onBeforeMount, onBeforeUnmount, provide, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const userData = ref(null)
provide("userData", userData)
const useTransition = ref(true)

function updateUserData(e){
  const endPoint = import.meta.env.VITE_SERVER_URL + "/api/auth"
  return fetch(endPoint, {
    method: "GET",
    headers: {
      "authorization": localStorage.token
    }
  })
    .then( res => res.json() )
    .then( data => {
      userData.value = data
      localStorage.setItem("userData", JSON.stringify(userData.value))

      if(userData.value.category == "user") {
        router.push("/")
        console.log("");
      }
      else if(userData.value.category == "coach") router.push("/dashboard")
    })
}

watch(() => route.fullPath, (to, from) => {
  // useTransition.value = to !== '/dashboard'
})


onBeforeMount(()=>{
  userData.value = JSON.parse(localStorage.getItem("userData")) || null
})
onBeforeUnmount(()=>{
  localStorage.setItem("userData", JSON.stringify(userData.value)) || null
})
</script>

<template lang="pug">
Suspense
  router-view(
    :userData="userData" 
    @signin-success="updateUserData" 
    v-slot="{ Component }"
    )
    Transition(name="fade" mode="out-in" )
      component(:is="Component")
Nav(:key="route.fullPath")
</template>

<style lang="sass">
*

.fade-enter-active, .fade-leave-active
  transition: all 0.4s cubic-bezier(.25,.06,.29,1)

.fade-enter-from
  position: absolute
  right: -100%
.fade-enter-to
  position: absolute
  right: 0
.fade-leave-from
  position: absolute
  left: 0
.fade-leave-to
  position: absolute
  left: -100%
  
  
</style>
