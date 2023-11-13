<template lang="pug">
.container
  h1 {{ hello }}
</template>

<script setup>
import { reactive, ref, isRef, isReactive, toRefs } from 'vue'
let hello = ref("Dashboard")
function getList(){
  console.log("getList");
  return fetch("http://localhost:3000/api/list")
    .then( response => response.json() )
    .then( data => data.data )
    .catch((e)=>{
    })
}
const list = await getList()
const data = ref(list)

</script>

<style lang="sass" scoped>

</style>