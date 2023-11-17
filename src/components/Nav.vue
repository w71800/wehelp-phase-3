<template lang="pug">
#nav
.signout(@click="signOut") 登出

</template>

<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()

const userData = inject("userData")
function signOut(){
  userData.value = null
  localStorage.userData = null
  localStorage.token = null

  router.push("/auth")
}

</script>

<style lang="sass" scoped>
#nav
  border: 1px solid #000
  position: fixed
  right: 0
  top: 50%
  width: 100px
  height: 100px

</style>