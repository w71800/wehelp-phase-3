<script setup>
import { reactive, ref, isRef, isReactive, toRefs } from 'vue'
import test from './assets/data/list.json'
const datas = ref(test.data)
</script>

<template lang="pug">
.container
  <List v-for="list of datas" :data="list" />
</template>

<style lang="sass">
:root
  --corner-size: 50px
  --corner-border: calc(var(--corner-size) / 2)
#app
  width: 100%
  height: 100%
</style>
