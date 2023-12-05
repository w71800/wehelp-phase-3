<template lang="pug">
#list(@click.self="cleanEditing")
  .corner(:class="{ isFromDashboard: isFromDashBoard}")
  .top
    .date 
      span 日期：
      span {{ data.date }}
    .part
      span 部位：
      span {{ data.part }}
  hr
  .bottom
    .items
      .btn.add_item(@click="addItem") + 加入新項目
      <Item v-for="(item, index) of items" :data="item" :index="index" @delete-item="deleteItem"/>
  .submit(@click="listAction" ) 提交
  .msg_icon(
    @click="clearUnreads"
    )
    img(v-if="!isFromDashBoard"  src='../assets/img/message_create.png')
    img(v-if="isFromDashBoard"  src='../assets/img/message_edit.png')
    .bubble(v-if="unreadsNum !== 0") {{ unreadsNum }}
#chat(v-if="chatIsExpand")
  .cross(@click="submitMessage")
    img(src="../assets/img/close.png")
  .view(ref="chatView")
    .title {{ title }}
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
    .submit(@click="storeMessage" )
      img(src="../assets/img/send.png")

</template>

<script setup>
import { ref, computed, inject, onMounted, reactive, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let { data, isFromDashBoard } = defineProps({
  data: Object || null,
  isFromDashBoard: Boolean
})
const { items, messages, unreads } = toRefs(data)
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
const nowMessage = ref("測試")
const chatIsExpand = ref(false)
const title = computed(() => {
  return userData.value.category == "user" 
  ? `與教練 ${userData.value.coach.username} 的對話` 
  : `與學員 ${data.username} 的對話` 
})
const chatView = ref(null)
const unreadsNum = computed(()=>{
  return undefined || unreads.value.filter( msg => msg.userId != userData.value.id ).length
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
  let submitData = { 
    ...data, 
    userId: userData.value.id,
    messages: messages.value,
    unreads: unreads.value
  }
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
    category: userData.value.category,
    messages: messages.value,
    unreads: unreads.value
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

function storeMessage(){
  let msgObj = {
    userId: userData.value.id,
    isSelf: true, 
    content: nowMessage.value
  }
  
  if(nowMessage.value !== "") {
    let { userId, content } = msgObj
    messages.value.push(msgObj)
    unreads.value.push({ userId, content })
    
    if (chatView.value) {
      nextTick(() => {
        chatView.value.scrollTop = chatView.value.scrollHeight;
      })
    }
  }
  else {
    alert("請輸入訊息！")
    return
  }
  // localStorage.messages = JSON.stringify(messages.value) // 送出時存檔一下
  nowMessage.value = ""
}

function submitMessage(){
  chatIsExpand.value = !chatIsExpand.value
  if(!isFromDashBoard) return

  let submitData = {
    id: data.id,
    messages: messages.value,
    unreads: unreads.value
   }

  let endpoint = import.meta.env.VITE_SERVER_URL + "/api/messages"
  return fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(submitData)
  })
  .then( res => res.json() )
}

function clearUnreads(){
  chatIsExpand.value = !chatIsExpand.value
  unreads.value = unreads.value.filter( unread => unread.userId == userData.value.id )
  emit("test")
}


onMounted( () => {
  messages.value = messages.value.map( message => {
    let { isSelf, ...rest } = message
    let result = { ...rest, isSelf: message.userId == userData.value.id }
    return result
    }
  )
})

</script>


<style lang="sass" scoped>
#list
  width: 320px
  min-width: 320px
  background-color: $color_list
  padding: 20px
  overflow: hidden
  background-image: url("../assets/img/texture.png")
  // border: 2px solid $color_primary
.msg_icon
  cursor: pointer
  position: absolute
  left: 8px
  bottom: 5px
  img
    opacity: 0.4
    width: 20px
    height: 20px
  .bubble
    text-align: center
    color: #fff
    font-size: .5rem
    line-height: 14px
    width: 14px
    height: 14px
    border-radius: 50%
    background-color: $color_hint
    position: absolute
    top: -7px
    right: -7px
    box-shadow: 0px 3px 4px 0px rgba(black, .4)
.date
  margin-bottom: 10px
.top
  &+hr
    width: 80%
    margin: 20px auto
    margin-bottom: 10px
    height: 1px
    border: none
    background-color: #999
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
  &.isFromDashboard
    border-top: var(--corner-border) solid rgba(black, 1)
    border-right: var(--corner-border) solid rgba(black, 1)

  
.submit
  border: 1px solid #000
  position: absolute
  right: 5px
  bottom: 8px
  font-size: 0.5rem
  font-weight: 500
  color: #fff
  background-color: $color_primary
  box-shadow: 0px 2px 0px 0px darken($color_primary, 10)
  padding: 3px 5px
  cursor: pointer
  border-radius: 3px
  border: none
  transition: .2s

#chat
  // height: 400px
  padding: 10px
  margin-left: 20px
  // background-color: $color_list

  .cross
    display: flex
    justify-content: center
    align-items: center
    width: 25px
    height: 25px
    border-radius: 50%
    background-color: #fff
    position: absolute
    right: 10px
    top: -20px
    cursor: pointer
    img
      width: 13px
      height: 13px
  .view
    height: 400px
    background-color: #fff
    overflow-y: scroll
    border-radius: 20px 20px 0px 0px
    border: 5px solid lighten($color_primary, 20)
    border-bottom: none
  .title
    // border: 1px solid #000
    position: absolute
    width: 100%
    font-size: 0.8rem
    color: #999
    padding-top: 5px
    text-align: center
    // border: 1px solid #000
  .wrapper
    overflow: hidden
    border-radius: 0px 0px 20px 20px
    border: 5px solid lighten($color_primary, 20)
    border-top: none
    textarea
      display: block
      width: 300px
      background-color: #eee
      padding: 10px
      border: none
    .submit
      display: flex
      align-items: center
      justify-content: center
      height: 100%
      bottom: 0
      right: 0
      font-size: 0.6rem
      img
        transition: .3s
        width: 18px
        height: 18px
  .messages
  .message
    // border: 1px solid #000
    display: flex
    margin-bottom: 20px
    margin-top: 30px
    span
      border-radius: 12px
      padding: 5px 10px
      font-size: 0.8rem
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
  transform: translateY(2px)
  color: #fff
  box-shadow: 0px 0px 0px 0px darken($color_hint, 10)
  background-color: $color_hint

#list
  .msg_icon:hover
    opacity: 1

#chat
  .cross:hover
    background-color: $color_hint
  textarea:focus
    outline-color: lighten($color_hint, 20)
  .submit:hover
    img
      transform: translate(1px, -1px)

</style>