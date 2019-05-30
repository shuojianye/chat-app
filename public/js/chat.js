const socket = io()

// elements
const $sendForm = document.querySelector('#message-form')
const $sharelocation = document.querySelector('#share-location')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const curloc = document.querySelector('#cur-loc').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room} = Qs.parse(location.search ,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
  // //New message element
  // const $newMessage = $messages.lastElementChild
  //
  // //Height of new messages
  // const newMessageStyles = getComputedStyle($newMessage)
  // const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  // const newMessageHeight = $newMessage.offsetHeight+newMessageMargin
  //
  // //Visible Height
  // const visibleHeight = $messages.offsetHeight
  //
  // //Height of mesaage container
  // const containerHeight = $messages.scrollHeight
  //
  // //How far have I scrolled
  // const scrollOffset = $messages.scrollTop + visibleHeight

  // if(containerHeight-newMessageHeight<= scrollOffset){
    $messages.scrollTop = $messages.scrollHeight
  // }
}


socket.on('location-message',(message)=>{
  console.log(message.url)
  const html = Mustache.render(curloc,{
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('MMMM Do YYYY, h:mm a')
  })
  $messages.insertAdjacentHTML('beforeEnd',html)
  autoscroll()
})


socket.on('sendToAll',(message)=>{
  console.log(message.text)
  const html = Mustache.render(messageTemplate,{
    username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('MMMM Do YYYY, h:mm a')
  })
  $messages.insertAdjacentHTML('beforeEnd',html)
  autoscroll()
})

socket.on('popUserList',({room,users})=>{
  const html = Mustache.render(sidebarTemplate,{
    users:users,
    room:room
  })
  document.querySelector('#chat-sidebar').innerHTML=html
})


$sharelocation.addEventListener('click',(e)=>{
  e.preventDefault()
  //disable

  if(!navigator.geolocation){
    return alert('Geolocation not support by you browser')
  }
    $sharelocation.setAttribute('disabled','disabled')
  navigator.geolocation.getCurrentPosition(function(position){

    socket.emit('sendLocation',{
      //enable

      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    },()=>{
      $sharelocation.removeAttribute('disabled')
      console.log('location shared')
    })
  })
})

$sendForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  $messageFormButton.setAttribute('disabled','disabled')
  const messageContent = e.target.elements.message
  socket.emit('sendMessage',messageContent.value,(err)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    if (err){
      return console.log(err)
    }
    console.log('The message was delivered')
  })
})


socket.on('message',(message)=>{
  console.log(message)
})

socket.emit('join',{username,room},(error)=>{
  if(!error){
    return
  }
  alert(error)
  location.href='/'
})
