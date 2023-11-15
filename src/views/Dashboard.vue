<template lang="pug">
.container
  h1 HELLO {{ userData.username }}
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
let { userData } = defineProps(["userData"])

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