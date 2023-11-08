<script setup>
import { ref, onMounted, defineProps, reactive, computed, toRefs } from 'vue'
const { data } = defineProps(["data"])
const { times, load, unit, rpe } = toRefs(data)
const isKg = computed(()=>{
  if(unit){
    return unit.value == "kg"? true : false  
  }
  
})

onMounted(()=>{

})

// 清除掉 editing 狀態
function changeEditing(e){
  let input = e.target
  let wrapper = input.parentElement
  
  if(e.type == "blur") {
    wrapper.classList.remove("editing")
    return
  }
  wrapper.classList.add("editing")

  
}

function editData(e){
  let button = e.target
  let wrapper = button.parentElement.parentElement
  console.log(wrapper);
  let dataEl = button.parentElement.parentElement.querySelector(".raw")
  if(button.classList.contains("plus")){
    if(wrapper.classList.contains("times")){
      times.value ++
    }
    else if(wrapper.classList.contains("load")){
      load.value ++
    }
  }
  else if(button.classList.contains("minus")){
    if(wrapper.classList.contains("times")){
      times.value --
    }
    else if(wrapper.classList.contains("load")){
      load.value --
    }
  }

}

function changeUnit(e){
  let span = e.target
  if(span.textContent.includes("lb")){
    unit.value = "lb"
    load.value = (load.value * 2.2).toFixed(2)
  }else if(span.textContent.includes("kg")){
    unit.value = "kg"
    load.value = (load.value / 2.2).toFixed(2)
  }
  console.log(unit.value, isKg.value);
}

</script>

<template lang="pug">
.set
  form
    .wrapper.times
      label(for="times") 次數：
      input.raw(
        type="text" 
        name="times" 
        id="times" 
        v-model="times" 
        @focus="changeEditing")
      .buttons.manual(@click.prevent="editData")
        button.plus +
        button.minus -
    .wrapper.load
      label(for="load") 負重：
      input.raw(
        type="text" 
        name="load" 
        id="load" 
        v-model="load" 
        @focus="changeEditing")
      span.spans
        span(:class="{ active: isKg }" @click="changeUnit") kg&nbsp; 
        span /
        span(:class="{ active: !isKg }" @click="changeUnit") &nbsp;lb
      .buttons.manual(@click.prevent="editData")
        button.plus +
        button.minus -
    .wrapper.rpe
      label(for="rpe") 疲勞度：
      input.raw(
        type="text" 
        name="rpe"
        id="rpe"
        v-model="rpe" 
        @focus="changeEditing")
      input.manual(min=1 max=10 type="range" v-model="rpe" @blur="changeEditing")
  hr
</template>

<style lang="sass" scoped>
.set
  padding-left: 10px
  margin-bottom: 10px
  hr
    width: 80%
    background-color: #999
    height: 1px
    border: none
    margin-top: 10px
.wrapper
  display: flex
  align-items: center
  justify-content: flex-start
  margin-bottom: 3px
  *
    color: $color_secondary
    font-size: .8rem
  label
    margin-right: 5px
  input
    background: transparent
    border: none
    outline: none
  input[type="text"]
    width: 30px
  .buttons
    font-size: 0
    display: none
    position: absolute
    right: 0px
    button
      display: inline-block
      width: 20px
      height: 20px
      font-size: 1.5rem
      line-height: 1rem
      border-radius: 3px
      margin-right: 10px
      color: rgba($color_secondary, .6)
      background-color: #fff
      border: 1px solid rgba($color_secondary, .6)
      cursor: pointer
  .spans
    margin-left: 5px
  &.load
    input[type="text"]
      width: 40px

  
.wrapper
  &.rpe
    input[type="range"]
      margin-left: 10px
      display: none
  &.load
    span
      cursor: pointer
      color: #999
      font-weight: 300
      &.active
        color: $color_secondary
        font-weight: 500


.wrapper.editing
  input.raw
    border: 1px solid #999
    outline: none
    background-color: #fff 
    &~.manual[type="range"]
      display: inline-block
    &~.manual.buttons
      display: block
</style>