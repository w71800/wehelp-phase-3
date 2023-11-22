<template lang="pug">
#list(@click.self="cleanEditing")
  .corner
  .top
    .date 
      span 日期：
      span {{ date }}
    .part
      span 部位：
      span {{ part }}
  hr
  .bottom
    .items
      .btn.add_item(@click="addItem") + 加入新項目
      <Item v-for="(item, index) of items" :data="item" :index="index" @delete-item="deleteItem"/>
  .submit(@click="listAction") 儲存
</template>

<script setup>
import { computed, inject, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let { data, isFromDashBoard } = defineProps({
  data: Object || null,
  isFromDashBoard: Boolean
 })
const { date, part, items } = toRefs(data)
const userData = inject("userData")
const listActions = {
  async submit() {
    let yes = confirm("確定要送出嗎？")
    if(!yes) return

    let response = await submitList()
    
    if(response.ok){
      router.push("/dashboard")
    } else {
    alert(`發生錯誤：${result.error}`)
    }
  },
  async update(){
    let yes = confirm("確定要送出嗎？")
    if(!yes) return
    
    let response = await updateList()

    if(response.ok){
      alert("更新成功")
      /**
       * 是否要重新載入？
       */
    } else {
      alert(`發生錯誤：${result.error}`)
    }
  }
}
const action = computed(()=>{
  return isFromDashBoard ? 'update' : 'submit'
})

// methods //
function addItem(){
  let item = {
    item: null,
    sets: [],
  }

  items.value.push(item)
}

function cleanEditing(e){
  let isEditing = document.querySelectorAll(".wrapper.editing")

  if(isEditing.length != 0) {
    isEditing.forEach( item => {
      item.classList.remove("editing")
    })
  }
}

function deleteItem(index){
  items.value.splice(index, 1)
}

function submitList(){
  let submitData = { ...data, userId: userData.value.id }
  let endpoint = import.meta.env.VITE_SERVER_URL + "/api/list"
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(submitData)
  })
  .then( res => res.json() )
}

function updateList(){
  let updateData = { 
    ...data, 
    userId: userData.value.id, 
    category: userData.value.category 
  }
  let endpoint = import.meta.env.VITE_SERVER_URL + "/api/list"
  return fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  })
  .then( res => res.json() )
}

function listAction(){
  listActions[action.value]()
}




// onMounted( () => {
//   let corner = document.querySelector(".corner")
//   if(isFromDashBoard){
//     corner.style
//   }
// })

</script>


<style lang="sass" scoped>
#list
  width: 320px
  // height: 650px
  background-color: $color_list
  padding: 20px
  overflow: hidden
  // border: 2px solid $color_primary
.date
  margin-bottom: 10px
.top
  &+hr
    width: 80%
    margin: 20px auto
    margin-bottom: 10px
.btn
  display: block
  width: 100px
  text-align: center
  margin: 0 auto
  color: $color_secondary
  cursor: pointer
  &.add_item
    margin-bottom: 10px

#list
  // &::before, &::after
  //   content: ''
  //   position: absolute
  //   bottom: 10px
  //   width: 40%
  //   height: 10px
  //   box-shadow: 0 5px 14px rgba(0,0,0,.7)
  //   z-index: 1
  //   // transition: all .3s ease-in-out
  // &::before
  //   left: 15px
  //   transform: skew(-5deg) rotate(-5deg)
  // &::after
  //   right: 15px
  //   transform: skew(5deg) rotate(5deg)
#list .corner
  width: var(--corner-size)
  height: var(--corner-size)
  border-left: var(--corner-border) solid darken($color_list, 20)
  border-top: var(--corner-border) solid $color_primary
  border-right: var(--corner-border) solid $color_primary
  border-bottom: var(--corner-border) solid darken($color_list, 20)
  position: absolute
  top: 0px
  right: 0px
  box-shadow: -2px 3px 5px 2px rgba(black, .4)
  // box-shadow: -5px 5px 8px 4px rgba(black, .4)
  &::before
    // content: ""
    // display: block
    // width: 50px
    // height: 50px
    // position: absolute
    // box-shadow: -3px 3px 5px 2px rgba(black, .4)
    // top: -25px
    // left: -25px
    // background-color: transparent 
  
.submit
  border: 1px solid #000
  position: absolute
  right: 5px
  bottom: 5px
  font-size: 0.5rem
  font-weight: 500
  color: #fff
  background-color: $color_primary
  border: 2px solid $color_primary
  padding: 3px 5px
  cursor: pointer
  border-radius: 3px

// function
.submit:hover
  color: $color_primary
  background-color: #fff
  border: 2px dashed $color_primary


</style>