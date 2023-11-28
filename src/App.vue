<script setup>
import { onBeforeMount, onBeforeUnmount, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const userData = ref(null)
provide("userData", userData)

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

      if(userData.value.category == "user") router.push("/")
      else if(userData.value.category == "coach") router.push("/dashboard")
    })
}

onBeforeMount(()=>{
  userData.value = JSON.parse(localStorage.getItem("userData")) || null
})
onBeforeUnmount(()=>{
  localStorage.setItem("userData", JSON.stringify(userData.value)) || null
})
</script>

<template lang="pug">
Suspense
  router-view(:userData="userData" @signin-success="updateUserData")
Nav
</template>

<style lang="sass">
*
  
</style>
