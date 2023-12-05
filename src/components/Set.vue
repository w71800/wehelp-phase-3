<script setup>
import { ref, onMounted, defineProps, reactive, computed, toRefs } from 'vue'
const { data, index } = defineProps(["data", "index"])
const { times, load, unit, rpe } = toRefs(data)
const thisIndex = ref(index)
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
  .set_delete(@click="$emit('deleteSet', thisIndex)")
    img(src="/src/assets/img/delete.png")
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
  //- hr
</template>

<style lang="sass" scoped>
.set
  padding: 10px 0px
  padding-left: 40px
  // margin-bottom: 10px
  // border: 1px solid #000
  &::before, &::after
    content: ""
    display: block
    width: 12px
    height: 45%
    position: absolute
    border-left: 2px dotted lighten(#eee, 8)
    // background-color: lighten(#eee, 15)
    left: 20px
    top: 0px
    opacity: 0.8
  &::before
    border-bottom: 2px dotted lighten(#eee, 8)
  &::after
    top: 50%
form
  margin-bottom: 5px
hr
  position: absolute
  bottom: 0
  width: 75%
  background-color: #999
  height: 1px
  border: none
.set_delete
  position: absolute
  left: 0px
  top: 50%
  transform: translateY(-50%)
  z-index: 20
  cursor: pointer
  opacity: 0.6
  img
    width: 15px
    height: 15px
.wrapper
  display: flex
  align-items: center
  justify-content: flex-start
  margin-bottom: 5px
  *
    color: $color_secondary
    font-size: .8rem
  label
    margin-right: 5px
    font-weight: 700
  input
    background: transparent
    border: none
    outline: none
  input[type="text"]
    width: 30px
    padding-left: 5px
  .buttons
    font-size: 0
    display: none
    position: absolute
    right: 25px
    button
      display: inline-flex
      align-items: center
      justify-content: center
      width: 20px
      height: 20px
      font-size: 1.3rem
      border-radius: 50%
      margin-right: 10px
      color: #666
      background-color: #eee
      border: 1px solid rgba($color_secondary, .6)
      cursor: pointer
      box-shadow: 0px 1px 5px -1px rgba(black, .4)
  .spans
    margin-left: 5px
  &.load input[type="text"]
    width: 50px
  
.wrapper
  &.rpe
    input[type="range"]
      margin-left: 20px
      -webkit-appearance: none
      appearance: none
      display: none
      &::-webkit-slider-thumb
        -webkit-appearance: none
        appearance: none
        width: 12px
        height: 12px
        border-radius: 50%
        background-color: #777
        margin-top: -4px
        box-shadow: 0px 1px 4px 0px rgba(black, .4)
      &::-moz-range-thumb
        -webkit-appearance: none
        appearance: none
        width: 12px
        height: 12px
        border-radius: 50%
        background-color: $color_hint
        margin-top: -4px
      &::-webkit-slider-runnable-track
        background-color: #eee
        border-radius: 2px
        height: 4px
      &::-moz-range-track
        border-radius: 2px
        background-color: #eee
        height: 4px
         
        
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