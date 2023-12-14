<template lang="pug">
.container
  #panel
    .wrapper
      label(for="period") 時間：
      select(id="period" name="period" v-model="queryParams.period")
        option(value="null" disabled) 選擇時間
        option(value=7) 一週
        option(value=14 ) 兩週
        option(value=30 ) 一個月
      img(src="../assets/img/arrow.png")
    .wrapper
      label(for="on") 最舊在前
      input(
        type="radio" 
        id="on" 
        name="sort" 
        v-model="queryParams.sort" 
        value="on" 
        :disabled="data.length == 0")
      label(for="no") 最新在前
      input(
        type="radio" 
        id="no" 
        name="sort" 
        v-model="queryParams.sort" 
        value="no" 
        :disabled="data.length == 0")
    .wrapper
      label(for="part") 部位：
      select(id="part" name="part" v-model="queryParams.part")
        option(value="null" disabled) 選擇部位
        option(value="null") 總覽
        option(value="腿") 腿
        option(value="肩" ) 肩
        option(value="胸" ) 胸
        option(value="背" ) 背
        option(value="混合" ) 混合
      img(src="../assets/img/arrow.png")
    //- 教練部分查詢學生用
    .wrapper(v-if="userData?.category == 'coach'")
      label(for="part") 學員：
      select(
        id="part" 
        name="part" 
        placeholder="學員名稱"
        v-model="queryParams.studentId" 
        )
        option(value="null" disabled) 學員名稱
        option(v-for="student in userData.students" :value="student.id") {{ student.username }}
      img(src="../assets/img/arrow.png")
    button.filter(@click="getLists('filter')") 搜尋
    button.filter(v-if="data.length != 0" @click="makeGraphData") 取得平均統計
  
  #board
    .status(v-if="data.length == 0 && !firstVisited") 沒有符合條件的運動紀錄
    .status(v-if="data.length == 0 && firstVisited") 請輸入搜尋條件
    <TransitionGroup name="list">
      .list(
        v-for="list of data" 
        @click="showData(list.id)" 
        :key="list"
        @test="test"
        :class="{ latest: list.date == query.date && list.part == query.part }"
      )
        img(src="../assets/img/icon.png")
        .sub.date {{ dateTransformer(list.date) }}
        .sub.part {{ list.part }}
        .bubble(v-if="list.unreadsNum !== 0") {{ list.unreadsNum }}
        .latest(v-if="list.date == query.date && list.part == query.part") new!
    </TransitionGroup>
    button.nextPage(
      @click="getLists" 
      v-if="data.length !== 0"
      :class="{ inactive: !queryParams.nextPage }"
    ) {{ queryParams.nextPage? "換下頁" : "沒有下一頁囉" }}
  
  #graphs(:class="{ isShown: graphDatas.length != 0 }")
    <TransitionGroup name="graphs">
      <GraphCard v-for="graphData of graphDatas" :rawData="graphData" :key="graphData"/>
    </TransitionGroup>
    

  #show(v-if="Object.keys(data_show).length !== 0" ref="show")
    .cross(@click="data_show = {}")
      .line
      .line
    <List :data="data_show" :isFromDashBoard="true" ref="listEL"/>
  
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
const router = useRouter()
const route = useRoute()
const list = ref(null)
let { userData } = defineProps(["userData"])
const queryParams = reactive({
  userId: null || userData?.id,
  studentId: null,
  period: null,
  part: null,
  nextPage: 1,
  sort: "on"
})
const data = ref([])
watch(() => queryParams.sort, (sort) => {
  if(sort == "no"){
    data.value.sort((d1, d2) => new Date(d2.created_at) - new Date(d1.created_at))
  }else{
    data.value.sort((d1, d2) => new Date(d1.created_at) - new Date(d2.created_at))
  }
})
const data_show = ref({})
const firstVisited = ref(true)
const graphDatas = ref([])
const show = ref(null)
const listEL = ref(null)
const query = route.query


watch(() => show.value, (newStatus, oldStatus) => {
  let ww = window.innerWidth
  if(newStatus){
    let containerEl = document.querySelector(".container")
    let delta = window.getComputedStyle(containerEl).marginLeft.split("p")[0]
    show.value.style.width = `${ww}px`
    show.value.style.left = `${-delta}px`
  }
})
// methods //

function getLists(mode){
  if(mode == "filter"){
    firstVisited.value = false
    queryParams.nextPage = 1
    queryParams.sort = "on"
    data.value = []
    graphDatas.value = []
  }
  let { userId, period, part, nextPage, studentId } = queryParams
  /**
   * 教練頁面的特殊需求：
   * 1. 選擇學生
   * 2. coach 不會有對應到 userId 身份的 list，但可以關聯到他的 studentID 所對應的 list
   */

  if(!nextPage) return

  let queryStr = `id=${userId}`
  if(userData?.category == "coach") queryStr += `&studentId=${studentId}`
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
      data.value = data.value.map( d => {
        let unreadsNum = d.unreads.filter( m => m.userId != userData.id ).length
        return { ...d, unreadsNum }
      })
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
  let result = await getList(id);
  data_show.value = result
  // let ww = window.innerWidth
  // nextTick(() => {
  //   show.value.style.width = ww + "px"
  //   show.value.style.position = "fixed"
  //   show.value.style.left = "0px"
  // })

  // data_show.value = data.value.filter( d => d.id == id )[0]
  
  /**
   * 這段的用途：
   * 在抓到該清單的並且要渲染時，如果一開始就會超出高度，就將 show 的高度設為 auto
   */
  let wh = window.innerHeight
  let listBottom = listEL.value?.getBoundingClientRect().bottom
  if(listBottom > wh){
    show.value.classList.add("listExpanding")
  }
  nextTick(()=>{
    window.scrollTo({
      top: 0,
    })
    
  })
}

function dateTransformer(dateStr){
  let isRecent = new Date().getDate() - new Date(dateStr).getDate()
  let r = undefined
  if(isRecent == 0){
    r = "今天"
  } else if(isRecent == 1) {
    r = "昨天"
  } else if(isRecent == 2) {
    r = "前天"
  } else {
    r = dateStr
  }
  return r
}

function getGraphData(){
  let { userId, period, part, studentId } = queryParams

  let queryStr = `id=${userId}`
  if(userData.category == "coach") queryStr += `&studentId=${studentId}`
  if(part) queryStr += `&part=${part}`
  if(period) queryStr += `&period=${period}`
  // queryStr += `&page=${nextPage}`
  console.log(queryStr);
  let endPoint = `${import.meta.env.VITE_SERVER_URL}/api/graphdata?${queryStr}`
  return fetch(endPoint)
  .then( res => res.json() )
  .then( data => data.data )
}

async function makeGraphData(){
  try{
    let data = await getGraphData()
    let result = []
    for(let [ item, d ] of Object.entries(data)){
      let temp = {}
      temp.item = item
      temp.data = d

      result.push(temp)
    }
    graphDatas.value = result
  }
  catch(e){
    console.log(e);
  }
}



onMounted( async () => {
  data.value = await getLists()
})

onBeforeRouteLeave(()=>{
  const body = document.querySelector("body")
  if(body.classList.contains("listExpanding")){
    body.classList.remove("listExpanding")
  }
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
  margin: 0 auto
  padding-top: 30px
button
  margin-right: 10px
#panel
  // background-color: darken(#fff, 10)
  padding: 20px
  padding-bottom: 40px
  // border-radius: 10px
  margin-bottom: 20px
  border-bottom: 1px solid #eee
  .wrapper
    display: inline-flex
    align-items: center
    justify-content: center
    vertical-align: middle
    border: 2px solid #eee
    margin-right: 20px
    background-color: #fff
    padding: 5px 8px
    border-radius: 5px
    height: 50px
    // box-shadow: inset 0px 0px 3px 3px darken(#eee, 20)
  label
    font-weight: 700
    color: #888
  select
    color: #555
    font-weight: 700
    font-size: 1rem
  input[type="radio"]
    margin: 0px 5px
    &:nth-child(2)
      margin-right: 20px
      
  img
    cursor: pointer
    transition: .2s
    height: 18px
    width: 18px
    transform: rotate(-90deg)
    opacity: 0.6

#board
  display: flex
  justify-content: flex-start
  gap: $gap_width
  flex-wrap: wrap
  margin-bottom: 20px
  padding-bottom: 100px
  // border-bottom: 2px solid #eee
  *
    text-align: center
  .status
    width: 100%
    text-align: center
    color: $color_list
    font-size: 1.5rem
  .list
    +splitList(4)
    // border: 1px solid #000
    cursor: pointer
    max-width: 175px
    min-width: 110px
    background-color: #fff
    border-radius: 5px
    padding: 0px 5px
    padding-bottom: 10px
    box-shadow: 0px 6px 10px -4px
    transition: .2s
    .latest
      background-color: $color_hint
      color: #fff
      position: absolute
      bottom: -7px
      right: -7px
      font-size: 0.6rem
      padding: 3px 5px
      border-radius: 3px
      box-shadow: -2px 4px 7px 0px rgba(black, .6)
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
    bottom: 30px
    transform: translateX(-50%)
  .bubble
    color: #fff
    font-size: .8rem
    line-height: 18px
    width: 20px
    height: 20px
    border-radius: 50%
    background-color: $color_hint
    position: absolute
    top: -10px
    right: -10px
    box-shadow: 0px 3px 4px 0px rgba(black, .4)

#board
  button.nextPage
  .list
    &.latest
      box-shadow: 0px 6px 10px -4px, 0px 0px 10px 5px rgba(#fff, .6)
    &:hover
      transform: translateY(-6px)
      box-shadow: 0px 12px 10px -4px rgba(black, .8)
      &.latest
        box-shadow: 0px 12px 10px -4px rgba(black, .8), 0px 0px 10px 10px rgba(#fff, .7)
#show
  position: absolute
  top: 0
  left: 0
  background-color: rgba(black, 1)
  width: 100%
  height: 100%
  // display: flex
  // justify-content: center
  // align-items: center
  display: block
  &.listExpanding
    height: auto
      
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
    z-index: 100
  .line
    position: absolute
    border: 1px solid white
    width: 100%
    transform-origin: 50% 50%
    background-color: white
    transform: rotate(0deg)
    transition: .2s
    &:nth-child(1)
      transform: rotate(45deg)  
    &:nth-child(2)
      transform: rotate(-45deg)

#graphs
  padding-bottom: 30px
  padding-top: 30px
  &.isShown
    border-top: 1px solid #eee

#show
  .cross:hover
    .line
      transition: .5s
      background-color: $color_hint
      border-color: $color_hint
      // &:nth-child(1)
      //   transform: rotate(45deg)
      // &:nth-child(2)
      //   transform: rotate(-45deg)

#panel
  .wrapper
    select:focus +img
      transform: rotate(90deg)


// RWD //
@media screen and (max-width: 1050px)
  #panel
    // display: flex
    .wrapper
      width: 60%
      min-width: 260px
      left: 50%
      transform: translateX(-50%)
      margin-bottom: 20px
    button
      display: block
      margin: 0 auto
      margin-bottom: 20px
@media screen and (max-width: 500px)
  #board
    .list
      +splitList(3)
@media screen and (max-width: 350px)
  #board
    .list
      +splitList(2)


  
// Vue transition //
.list-enter-active, .list-leave-active, .graphs-enter-active, .graphs-leave-active
  transition: all .4s ease
.list-enter-from, .list-leave-to, .graphs-enter-from, .graphs-leave-to
  opacity: 0
  transform: translateX(-20px)
.list-enter-to, .list-leave-from, .graphs-enter-to, .graphs-leave-from
  opacity: 1
  transform: translateX(0px)

</style>