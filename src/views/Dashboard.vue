<template lang="pug">
.container
  #panel
    .wrapper
      label(for="period") 時間：
      select(id="period" name="period" v-model="period")
        option(value="week" selected default) 一週
        option(value="biweeks" ) 兩週
        option(value="month" ) 一個月
    .wrapper
      label(for="part") 部位：
      select(id="part" name="part" v-model="part")
        option(value="腿") 腿
        option(value="肩" ) 肩
        option(value="胸" ) 胸
        option(value="背" ) 背
        option(value="混合" ) 混合
    //- label(for="") 
    //- select(id="") 
    button.submit 搜尋
  #board
    .status(v-if="true") 沒有符合條件的運動紀錄
  
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
let { userData } = defineProps(["userData"])
const period = ref("week")
const part = ref(null)
const nextPage = ref(1)
const data = ref(null)

function getList(){
  if(!nextPage) return

  let queryStr = `id=${userData.id}&period=${period.value}&part=${part.value}&page=${nextPage.value}`
  let endPoint = `${import.meta.env.VITE_SERVER_URL}/api/lists?${queryStr}`
  
  return fetch(endPoint)
    .then( response => response.json() )
    .then( data => {
      nextPage.value = data.nextPage
      return data.data
    } )
    .catch((e)=>{
    })
}

data.value = await getList()
</script>

<style lang="sass" scoped>
.container
  display: block
#panel
  display: flex

</style>