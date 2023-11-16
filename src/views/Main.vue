<template lang="pug">
.container
  RouterLink(to="/dialog") 新增一個清單
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const { userData } = defineProps(["userData"])

onBeforeMount(() => {
  if(!userData || !localStorage.token){
    router.push("/auth")
  }
})


</script>

<style lang="sass" scoped>
*
  color: #fff
  font-weight: 700

</style>