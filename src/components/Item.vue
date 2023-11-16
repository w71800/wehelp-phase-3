<script setup>
import { ref, computed, toRefs, inject } from 'vue'
const { data, index } = defineProps(["data", "index"])
const { item, sets } = toRefs(data)
const thisIndex  = ref(index)
const isExpanding = ref(false)
const histories = inject("histories")
const excercises = computed( () => histories.value.map( history => history.item ) )
const recommends = ref([])
const chosenNum = ref(0)
const isEmpty = computed(() => {
  if(!item.value){
    return true
  }
})

function expendSets(e){
  isExpanding.value = !isExpanding.value
}

function addSet(e){
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
}

function deleteSet(arg){
  sets.value.splice(arg, 1)
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
      let result = Array.from(excercises.value).filter( recommend => recommend.includes(input.value) )
      recommends.value = result
    }
  }
}

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
    .item_arrow(@click="expendSets")
      img(src="/src/assets/img/arrow.png" :class="{ expand: isExpanding }")
    .item_delete(@click="$emit('deleteItem', thisIndex)")
      img(src="/src/assets/img/delete.png")
  .item_sets(:class="{ expand: isExpanding }")
    <Set v-for="(set, index) of sets" :data="set" :index="index" @delete-set="deleteSet"/>
    .btn.add_set(@click="addSet") + 加入一組
</template>



<style lang="sass" scoped>
#item
  // border: 1px solid #000
  margin-bottom: 10px

.item_info
  border: 1px solid #000
  padding: 10px 20px
  margin-bottom: 10px
  border-radius: 30px
  box-shadow: 0px 3px 10px 0px rgba(#888, .7)
.item_name
.item_input
  height: 25px
  background-color: transparent
  font-size: 1rem
  padding: 3px 5px
  outline: none
  border: none
  &.isEmpty
    border: 1px solid #000
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
  &.expand
    height: auto
    overflow: visible
.item_delete
  cursor: pointer
  // border: 1px solid #000
  position: absolute
  top: 5px
  right: 15px
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