<template lang="pug">
.container
  <List :data="data" />
</template>
  
<script setup>
import { reactive, ref, isRef, isReactive, toRefs } from 'vue'
import { useRouter } from 'vue-router';

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

const data = ref(newList(getDate(), part))
// const list = await getList()
// const data = ref(list)

// function getList(){
//   console.log("getList");
//   return fetch("http://localhost:3000/api/list")
//     .then( response => response.json() )
//     .then( data => data.data )
//     .catch((e)=>{
//       console.log(e);
//     })
// }


</script>
  
<style lang="sass" scoped>

</style>