<template lang="pug">
.container
  .link
    img(src="../assets/img/addlist.png")
    RouterLink(to="/dialog")
</template>

<script setup>
import { inject, onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const { userData } = defineProps(["userData"])

onBeforeMount(() => {
  if(!userData || !localStorage.token){
    router.push("/auth")
  }
})


</script>

<style lang="sass" scoped>
*
  color: #fff
  font-weight: 700

.link
  width: 150px
  height: 135px
  background-color: #fff
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  color: #999
  border: 8px solid darken(#fff, 6)
  box-shadow: 0 0.7em darken(#fff, 25)
  transition: .3s
  overflow: hidden
  cursor: pointer
  &::after, &::before
    content: ""
    display: block
    position: absolute
    background-color: darken(#fff, 3)
    width: 20px
    height: 140px
  &::before
    height: 140px
    transform: translate(-15px, -15px) rotate(45deg)
  &::after
    transform: translate(40px, 40px) rotate(45deg)
img
  z-index: 3
  width: 60%
  height: 60%
  // background-color: #fff
a
  z-index: 4
  position: absolute
  width: 100%
  height: 100%

.link
  &:hover
    box-shadow: 0 0 darken(#fff, 25)
    transform: translateY(0.6em)
    img
      transition: .3s

</style>