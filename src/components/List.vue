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
  .submit(@click="listAction" ) 儲存
  .msg_icon(@click="chatIsExpand = !chatIsExpand")
    img(src="../assets/img/message.png")
#chat(:class="{ expand: chatIsExpand }")
  .cross(@click="chatIsExpand = !chatIsExpand")
    img(src="../assets/img/close.png")
  .title 與教練 XXX 的對話
  .view
    .messages
      .message(
        v-for="message of messages"
        :class="message.isSelf ? 'self' : 'other'"
      )
        span {{ message.content }}
  .wrapper
    textarea(
      v-model="nowMessage" 
      placeholder="請輸入訊息")
    .submit(@click="submitMessage" ) 送出

</template>

<script setup>
import { ref, computed, inject, onMounted, reactive, toRefs } from 'vue'
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
const messages = ref([
  {
    userId: null, // 紀錄是哪個使用者留下的
    isSelf: true, // 紀錄是否是自己留下的（userId == 當下使用者 id？）
    content: "測試"
  },
  {
    userId: null, // 紀錄是哪個使用者留下的
    isSelf: false, // 紀錄是否是自己留下的（userId == 當下使用者 id？）
    content: "測試（對方）"
  }
])
const nowMessage = ref("測試")
const chatIsExpand = ref(true)

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

function submitMessage(){
  let msgObj = {
    userId: userData.value.id, // 紀錄是哪個使用者留下的
    isSelf: true, // 紀錄是否是自己留下的（userId == 當下使用者 id？），此屬性是在從遠端抓到之後解壓縮資料時動態生成的（透過 map 之類的）
    content: nowMessage.value
  }

  if(nowMessage.value !== "") {
    messages.value.push(msgObj)
  }
  else {
    alert("請輸入訊息！")
    return
  }
  localStorage.messages = JSON.stringify(messages.value) // 送出時存檔一下
  nowMessage.value = ""
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
  min-width: 320px
  // height: 650px
  background-color: $color_list
  padding: 20px
  overflow: hidden
  // border: 2px solid $color_primary
.msg_icon
  cursor: pointer
  opacity: 0.6
  position: absolute
  left: 8px
  bottom: 5px
  img
    width: 20px
    height: 20px
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
  padding: 3px 5px
  cursor: pointer
  border-radius: 3px
  border: none

#chat
  border: 1px solid #000
  // height: 400px
  padding: 10px
  background-color: $color_list
  display: none
  .cross
    position: absolute
    right: 8px
    top: 3px
    cursor: pointer
    img
      width: 13px
      height: 13px
  .title
    font-size: 1.3rem
    color: #666
    margin-bottom: 10px
    text-align: center
  .view
    height: 400px
    background-color: #fff
    overflow-y: scroll
    border-radius: 20px 20px 0px 0px
  .wrapper
    textarea
      display: block
      width: 300px
      background-color: #eee
      padding: 10px
      border: none
      border-radius: 0px 0px 20px 20px
    .submit
      display: flex
      align-items: center
      justify-content: center
      height: 100%
      bottom: 0
      right: 0
      font-size: 0.6rem
  .messages
  .message
    // border: 1px solid #000
    display: flex
    margin-bottom: 20px
    margin-top: 20px
    span
      border-radius: 12px
      padding: 5px 10px
    &.self
      justify-content: flex-end
      right: 5px
      span
        border-radius: 12px 12px 0px 12px
        background-color: $color_primary
        color: white
    &.other
      justify-content: flex-start
      left: 5px
      span
        border-radius: 12px 12px 12px 0px
        background-color: #eee
      











// function
.submit:hover
  color: #fff
  background-color: $color_hint

#chat.expand
  display: block



</style>