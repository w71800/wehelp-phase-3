<template lang="pug">
.container
  <List :data="data" />
</template>
  
<script setup>
import { onBeforeMount, onMounted, provide, ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
const route = useRoute()
const router = useRouter()
const { userData } = defineProps(["userData"])
const histories = ref(null)
const part = route.params.part
provide("histories", histories)



function getDate(){
  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1
  let day = new Date().getDate()

  return `${year} / ${month} / ${day}`
}
function newList(date, part){
  let listObj = { 
    date,
    part,
    items: [],
    messages: [],
    unreads: []
  }

  return listObj
}
function getHistories(){
  let endPoint = `${ import.meta.env.VITE_SERVER_URL }/api/history?part=${ part }&id=${ userData.id }`
  return fetch(endPoint)
  .then( res => res.json() )
  .then( data => {
    histories.value = data.data
  }) 
}

onBeforeMount(()=>{
  if(!part){
    alert("沒有輸入部位，請重新輸入！")
    router.push("/dialog")
  }
  if(!userData || !localStorage.token){
    // router.push("/auth")
  }
})

// 初始化
onMounted(() => {
  getHistories()
})

// onBeforeRouteLeave( to => {
//   if(to == "/dashboard"){
//   }
// })

const data = ref(newList(getDate(), part))
</script>
  
<style lang="sass" scoped>

</style>