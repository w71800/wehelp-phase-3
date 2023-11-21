<template lang="pug">
.container
  #panel
    .wrapper
      label(for="period") 時間：
      select(id="period" name="period" v-model="queryParams.period")
        option(value="week" selected default) 一週
        option(value="biweeks" ) 兩週
        option(value="month" ) 一個月
    .wrapper
      label(for="part") 部位：
      select(id="part" name="part" v-model="queryParams.part")
        option(value="null") 總覽
        option(value="腿") 腿
        option(value="肩" ) 肩
        option(value="胸" ) 胸
        option(value="背" ) 背
        option(value="混合" ) 混合
    //- label(for="") 
    //- select(id="") 
    button.filter(@click="getLists('filter')") 搜尋
  #board
    .status(v-if="data.length == 0") 沒有符合條件的運動紀錄
    .list(v-for="list of data" @click="showData(list.id)")
      img(src="../assets/img/icon.png")
      .sub.date {{ list.date }}
      .sub.part {{ list.part }}
    button.nextPage(
      @click="getLists('filter')" 
      v-if="data.length !== 0"
      :class="{ inactive: !queryParams.nextPage }") {{ queryParams.nextPage? "換下頁" : "沒有下一頁囉" }}
  #show(v-if="Object.keys(data_show).length !== 0")
    .cross(@click="data_show = {}")
      img(src="../assets/img/close.png")
    <List :data="data_show"/>
  
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let { userData } = defineProps(["userData"])
const queryParams = reactive({
  userId: userData?.id,
  period: "week",
  part: null,
  nextPage: 1,
})
const data = ref([])
const data_show = ref({})
// const showStatus = computed(()=>{
//   if(data.value.length == 0) return "沒有符合條件的運動紀錄"
//   else if(!localStorage.token) return "看起來還沒<router-link to='/auth'>登入</router-link>喔！"
// })

function getLists(mode){
  if(mode == "filter"){
    queryParams.nextPage = 1
    data.value = []
  }
  let { userId, period, part, nextPage } = queryParams
 
  if(!nextPage) return

  let queryStr = `id=${userId}&period=${period}&part=${part}&page=${nextPage}`
  let endPoint = `${import.meta.env.VITE_SERVER_URL}/api/lists?${queryStr}`
  
  return fetch(endPoint)
    .then( response => response.json() )
    .then( data => {
      queryParams.nextPage = data.nextPage
      return data.data
    } )
    .then( lists => {
      data.value = data.value.concat(lists)
      return data.value
    })
    .catch((e)=>{
    })
}

function getList(id){
  let endPoint = `${import.meta.env.VITE_SERVER_URL}/api/list?id=${id}`
  return fetch(endPoint)
  .then( res => res.json() )
  .then( data => data.data )
}

async function showData(id){
  data_show.value = await getList(id);
}



// onBeforeMount( () => {
//   if(!userData || !localStorage.token){
//     router.push("/auth")
//   }
// })



onMounted( async () => {
  // console.log("dashboard mounted");
  data.value = await getLists()
})

</script>

<style lang="sass" scoped>
$gap_width: 20px
@mixin splitList($num, $gap: $gap_width)
  width: calc( (100% - ($num - 1) * $gap) / $num )

.container
  display: block
button
  cursor: pointer
  padding: 5px 8px
  border-radius: 3px
  border: none
#panel
  display: flex
  margin-bottom: 20px
  button
    padding: 3px 5px
    margin-left: 10px
#board
  display: flex
  justify-content: flex-start
  gap: $gap_width
  flex-wrap: wrap
  // border: 1px solid #000
  *
    text-align: center
  .list
    +splitList(4)
    // border: 1px solid #000
    cursor: pointer
    max-width: 175px
    background-color: #fff
    border-radius: 5px
    padding-bottom: 10px
    box-shadow: 0px 6px 10px -4px
    transition: .2s
  img
    object-fit: contain
    width: 50%
    // border: 1px solid #000

  .sub
    // border: 1px solid #000
    font-size: 0.8rem
    color: #888
  .sub.date
    margin-top: -10px
  button.nextPage
    position: absolute
    left: 50%
    bottom: -50px
    transform: translateX(-50%)

#board
  button.nextPage
    &.inactive
      color: grey
      background-color: lignten(grey, 25)
      // cursor: not-allowed
      pointer-events: none
  .list
    &:hover
      transform: translateY(-6px)
      box-shadow: 0px 12px 10px -4px rgba(black, .8)
    &.latest
      box-shadow: 0px 0px 8px 5px white
#show
  position: absolute
  top: 0
  left: 0
  background-color: rgba(black,.7)
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  .cross
    position: absolute
    top: 20px
    right: 20px
    cursor: pointer


</style>