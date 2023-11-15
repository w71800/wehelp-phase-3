<template lang="pug">
.container
  <List :data="data" />
</template>
  
<script setup>
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router';
const { userData } = defineProps(["userData"])
const histories = ref(null)
provide("histories", histories)


let part = prompt("今天想練什麼部位？")
if(!part) useRouter().push("/dashboard")

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
    items: []
  }

  return listObj
}
function getHistories(){
  let endPoint = `${import.meta.env.VITE_SERVER_URL}/api/history?part=${part}&id=${userData.id}`
  return fetch(endPoint)
  .then( res => res.json() )
  .then( data => {
    histories.value = data.data
  }) 
}


// 初始化
onMounted(() => {
  getHistories()
})

const data = ref(newList(getDate(), part))
</script>
  
<style lang="sass" scoped>

</style>