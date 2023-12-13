<template lang="pug">
.container 
  #box
    h1.title 今天想練什麼？
    .wrapper
      label(for="part") 我想練：
      select(id="part" v-model="part" required)
        option(value="null" disabled) どっち
        option(value="腿") 腿
        option(value="肩") 肩
        option(value="胸") 胸
        option(value="背") 背
        option(value="混合") 混合
      img(src="../assets/img/arrow.png")
    .submit
      RouterLink(to="/newpost") 開始動滋！

    
</template>

<script setup>
import { onMounted, ref } from "vue"
import { onBeforeRouteLeave } from "vue-router"
const part = ref(null)

onBeforeRouteLeave((to, from, next) => {
  if(to.fullPath == "/newpost") {
    if (!part.value) {
      alert("沒有輸入部位，請重新輸入！")
      return false
    } else {
      to.params.part = part.value
    }
  }
  
  next()
})
</script>

<style lang="sass" scoped>
@keyframes submitBouncing
  0%
    bottom: 0px
  50%
    bottom: 15px
  100%
    bottom: 0

#box
  background-color: #fff
  width: 320px
  padding: 20px 15px
  border-radius: 5px
h1.title
  color: #888
  font-weight: 700
  text-align: center
.wrapper
  display: flex
  align-items: center
  justify-content: center
  padding: 80px 0px
  *
    // border: 1px solid #000
label, select, img
  vertical-align: middle
img
  right: 23px
  transition: .3s
  transform: rotate(-90deg)
label
  font-size: 1.2rem
select
  width: 150px
  height: 40px
  color: $color_secondary
  font-weight: 500
  font-size: 1.2rem
  padding: 0px 10px
img
  width: 18px
  height: 18px
.submit
  text-align: center
  padding: 10px
  border: 2px solid $color_primary
  width: 80%
  margin: 0 auto
  cursor: pointer
  a  
    display: block
    width: 100%
    height: 100%
    text-decoration: none
    color: $color_primary
    font-weight: 700
  &:hover
    // animation: submitBouncing infinite 1s cubic-bezier(1,-0.01,.74,1.37)
    background-color: $color_primary
    *
      color: #fff

#box
  .wrapper
    select:focus + img
      transform: rotate(90deg)
  
</style>