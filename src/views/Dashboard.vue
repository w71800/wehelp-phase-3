<template lang="pug">
.container
  #panel
    .wrapper
      label(for="period") 時間：
      select(id="period" name="period" v-model="queryParams.period")
        option(value=7) 一週
        option(value=14 ) 兩週
        option(value=30 ) 一個月
      label(for="on") 由舊到新
      input(type="radio" id="on" name="sort" v-model="queryParams.sort" value="on")
      label(for="no") 由新到舊
      input(type="radio" id="no" name="sort" v-model="queryParams.sort" value="no")
    .wrapper
      label(for="part") 部位：
      select(id="part" name="part" v-model="queryParams.part")
        option(value="null") 總覽
        option(value="腿") 腿
        option(value="肩" ) 肩
        option(value="胸" ) 胸
        option(value="背" ) 背
        option(value="混合" ) 混合
    //- 教練部分查詢學生用
    .wrapper(v-if="userData.category == 'coach'")
      label(for="part") 學員：
      select(id="part" name="part" v-model="queryParams.studentId")
    //- label(for="") 
    //- select(id="") 
    button.filter(@click="getLists('filter')") 搜尋
  #board
    .status(v-if="data.length == 0") 沒有符合條件的運動紀錄
    .list(v-for="list of data" @click="showData(list.id)")
      img(src="../assets/img/icon.png")
      .sub.date {{ dateTransformer(list.date) }}
      .sub.part {{ list.part }}
    button.nextPage(
      @click="getLists" 
      v-if="data.length !== 0"
      :class="{ inactive: !queryParams.nextPage }") {{ queryParams.nextPage? "換下頁" : "沒有下一頁囉" }}
  #show(v-if="Object.keys(data_show).length !== 0")
    .cross(@click="data_show = {}")
      .line
      .line
    <List :data="data_show" :isFromDashBoard="true"/>
  
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let { userData } = defineProps(["userData"])
const queryParams = reactive({
  userId: null || userData?.id,
  studentId: null,
  period: null,
  part: null,
  nextPage: 1,
  sort: "no"
})
const data = ref([])
watch(() => queryParams.sort, (sort) => {
  console.log(sort);
  if(sort == "no"){
    data.value.sort((d1, d2) => new Date(d2.created_at) - new Date(d1.created_at))
  }else{
    data.value.sort((d1, d2) => new Date(d1.created_at) - new Date(d2.created_at))
  }
})
const data_show = ref({})
// const showStatus = computed(()=>{
//   if(data.value.length == 0) return "沒有符合條件的運動紀錄"
//   else if(!localStorage.token) return "看起來還沒<router-link to='/auth'>登入</router-link>喔！"
// })

// methods //

function getLists(mode, identity){
  if(mode == "filter"){
    queryParams.nextPage = 1
    data.value = []
  }
  let { userId, period, part, nextPage, studentId } = queryParams
  /**
   * 教練頁面的特殊需求：
   * 1. 選擇學生
   * 2. coach 不會有對應到 userId 身份的 list，但可以關聯到他的 studentID 所對應的 list
   */

  if(!nextPage) return

  let queryStr = `id=${userId}`
  if(identity == "coach") queryStr += `&studentId=${studentId}`
  if(part) queryStr += `&part=${part}`
  if(period) queryStr += `&period=${period}`
  queryStr += `&page=${nextPage}`
  
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

function dateTransformer(dateStr){
  let isRecent = new Date().getDate() - new Date(dateStr).getDate()
  let r = undefined
  if(isRecent == 1) {
    r = "昨天"
  } else if(isRecent == 2) {
    r = "前天"
  } else {
    r = dateStr
  }
  return r
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
@keyframes cross_1
  0%
    transform: rotate(0deg)
  // 50%
  100%
    transform: rotate(45deg)
    // transform: rotate(0deg)
@keyframes cross_2
  0%
    transform: rotate(0deg)
  // 50%
  100%
    transform: rotate(-45deg)
    // transform: rotate(0deg)

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
    margin-bottom: 5px
    font-weight: 300
  .sub.part
    font-weight: 700
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
    width: 20px
    height: 20px
    display: flex
    justify-content: center
    align-items: center
  .line
    position: absolute
    border: 1px solid white
    width: 100%
    transform-origin: 50% 50%
    background-color: white
    transform: rotate(0deg)
    transition: .2s
    // &:nth-child(1)
    //   transform: rotate(45deg)  
    // &:nth-child(2)
    //   transform: rotate(-45deg)

#show
  .cross:hover
    .line
      transition: .5s
      background-color: $color_hint
      border-color: $color_hint
      &:nth-child(1)
        transform: rotate(45deg)
      &:nth-child(2)
        transform: rotate(-45deg)
    

</style>