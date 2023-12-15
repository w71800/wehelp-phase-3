<script setup>
import { ref, computed, toRefs, inject, onMounted } from 'vue'
const { data, index } = defineProps(["data", "index"])
const { item, sets } = toRefs(data)
const keyID = data.keyID
const isExpanding = ref(false)
const histories = inject("histories")
const exercises = computed( () => histories.value.map( history => history.item ) )
const recommends = ref([])
const chosenNum = ref(0)
const addsetIsClicked = ref(false)
const deletesetIsClicked = ref(false)
const isEmpty = computed(() => {
  if(!item.value){
    return true
  }
})
const setsEl = ref(null)
const setsUltimateHeight = ref(0)
const resizeObserver = new ResizeObserver(entries => {
  for(entries of entries){
    let height = entries.contentRect.height
    
    if(addsetIsClicked.value || deletesetIsClicked.value){
      setsUltimateHeight.value = height
    }
  }
});

function expandSets(e){
  isExpanding.value = !isExpanding.value
  // if(!isExpanding.value){
  //   setsEl.value.style.height = setsUltimateHeight.value + "px"
  //   setsEl.value.style.overflow = "hidden"
  //   setTimeout(()=>{
  //     setsEl.value.style.height = "0px"
  //   }, 1)
  // }else{
  //   setsEl.value.style.height = setsUltimateHeight.value + "px"
  //   setTimeout(()=>{
  //     setsEl.value.style.height = "auto"
  //   }, 600)
  // }
}

function addSet(e){
  addsetIsClicked.value = true
  let newSet = {
    "times": 12,
    "load": 20,
    "unit": "kg",
    "rpe": 6
  }
  if(data.sets.length != 0){
    newSet = JSON.parse(JSON.stringify(data.sets[data.sets.length - 1]))
  }else{
    let historyObj = histories.value.filter( history => history.item == item.value )[0]
    if(historyObj) newSet = historyObj.last
  }

  data.sets.push(newSet)

  setTimeout(()=>{
    addsetIsClicked.value = false
  }, 50)
}

function deleteSet(arg){
  deletesetIsClicked.value = true
  sets.value.splice(arg, 1)

  setTimeout(()=>{
    deletesetIsClicked.value = false
  }, 50)
}

function fillItem(recommend){
  item.value = recommend
}

function setRecommend(e){
  item.value = recommends.value[chosenNum.value]
  e.target.blur()
}

function changeRecommend(e){
  console.log(e.key);
  if(e.key == "ArrowUp") {
    chosenNum.value --
    if(chosenNum.value == -1) chosenNum.value = recommends.value.length - 1
  }
  else if(e.key == "ArrowDown"){
    chosenNum.value ++
    if(chosenNum.value == recommends.value.length) {
      chosenNum.value = 0
    }
  } 
  
  
}

const vRecommendsCollapse = {
  mounted: (el) => { 
    let input = el
    let recommendsEl = input.nextElementSibling

    input.onfocus = () => {
      recommendsEl.classList.add("expand")
    }
    input.onblur = () => {
      setTimeout(()=>{
        recommendsEl.classList.remove("expand")
      }, 30)
    }
    input.oninput = () => {
      let result = Array.from(exercises.value).filter( recommend => recommend.includes(input.value) )
      recommends.value = result
    }
  }
}


onMounted(() => {
  resizeObserver.observe(setsEl.value)
})

</script>

<template lang="pug">
#item
  .item_info
    .item_name
      input.item_input(
        v-model="item" 
        placeholder="請輸入項目" 
        :class="{ isEmpty: isEmpty }" 
        v-RecommendsCollapse
        @keydown.enter="setRecommend"
        @keydown.down="changeRecommend"
        @keydown.up="changeRecommend"
        )
      ul.item_recommends()
        li.recommend(
          v-for="(recommend, i) of recommends"
          @click="fillItem(recommend)"
          :class="{ isChosen: i == chosenNum }") {{ recommend }}
    .sets_hint {{ sets.length }} 組
    .item_arrow(@click="expandSets")
      img(src="/src/assets/img/arrow.png" :class="{ expand: isExpanding }")
    .item_delete(@click="$emit('deleteItem', keyID)")
      img(src="/src/assets/img/delete.png")
  .item_sets(:class="{ expand: isExpanding }" ref="setsEl")
    //- iframe(v-sets-height-change)
    <Set v-for="(set, index) of sets" :data="set" :index="index" @delete-set="deleteSet"/>
    .btn.add_set(@click="addSet") + 加入一組
</template>



<style lang="sass" scoped>
:root
  --sets-height: 0px
#item
  width: 280px
  // border: 1px solid #000
  margin-bottom: 10px

.item_info
  padding: 10px 20px
  margin-bottom: 10px
  border-radius: 35px
  box-shadow: 0px 5px 0px 0px darken(rgba(#eee, .7), 10)
  background-color: #eee
.item_name
.item_input
  color: #777
  font-weight: 700
  width: 80%
  height: 30px
  background-color: transparent
  font-size: 1rem
  padding: 10px 5px
  outline: none
  border-radius: 5px
  border: none
  &.isEmpty
    border: 2px solid rgba(#999, .7)
ul.item_recommends
  width: 100%
  // 收起來用的
  overflow: hidden
  height: 0
  margin-top: 5px
  .recommend
    list-style: none
    border-top: 1px solid #000
    cursor: pointer
    background-color: #fff
    font-size: 0.8rem
    padding: 1px 10px
    z-index: 30
    &:hover, &.isChosen
      background-color: $color_secondary 
      color: #fff
    

.sets_hint
  font-size: 0.8rem
  text-align: right
  color: $color_secondary
.item_arrow
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)
  cursor: pointer
  opacity: 0.6
  & img
    transition: .3s
    width: 20px
    height: 20px
    transform: rotate(-90deg)
  & img.expand
    transform: rotate(90deg)
.item_sets
  overflow: hidden 
  height: 0
  // border: 1px solid #000
  z-index: 1
  transition: .5s
  &.expand
    height: auto
    overflow: visible

.item_delete
  cursor: pointer
  // border: 1px solid #000
  position: absolute
  top: 5px
  right: 15px
  opacity: 0.6
  img
    width: 15px
    height: 15px
.btn
  display: block
  width: 80px
  margin: 0 auto
  text-align: center
  color: rgba($color_secondary, .4)
  font-weight: 500
  font-size: 0.8rem
  cursor: pointer
  &.add_set


// function
input.item_input
  &+ul.expand
    overflow: visible
#item
  .wrapper.editing
    input
      border: 1px solid #000 
      background-color: #fff 
    .buttons
      display: block
    &.rpe
      input[type="range"]
        display: inline-block
</style>