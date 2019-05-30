const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const port = process.env.PORT||3000
const {addUser, removeUser,getUser,getUsersInRoom} = require('./utils/users')

const {generateMessage,generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const pubDir = path.join(__dirname,'../public')


app.use(express.static(pubDir))


io.on('connection',(socket)=>{

  socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})
    if(error){
      return callback(error)
    }
    socket.join(room)

    //发送给特定屋子内人信息  io.to.emit
    //发送给除了本人的屋子内的信息  socket.broadcast.to.emit

    socket.emit('sendToAll',generateMessage('Admin','Welcome!'))
    socket.broadcast.to(room).emit('sendToAll',generateMessage('Admin',`${username} has joined!`))
    const userList = getUsersInRoom(user.room)
    io.to(user.room).emit('popUserList',{
      room:user.room,
      users:userList
    })
    callback()
  })


  socket.on('sendMessage',(message,callback)=>{
    const filter = new Filter()
    if (filter.isProfane(message)){
      return callback('Profanity is not allowed')
    }
    // if (message.length===0){
    //   return callback()
    // }
    const user = getUser(socket.id)

    io.to(user.room).emit('sendToAll',generateMessage(user.username,message))

    callback()
  })

  socket.on('sendLocation',(coords,callback)=>{
    const user = getUser(socket.id)
    io.to(user.room).emit('location-message',generateLocationMessage(user.username,`http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback()
  })



  socket.on('disconnect',()=>{
    const user = removeUser(socket.id)

    if(user){
      io.to(user.room).emit('sendToAll',generateMessage('Admin',`${user.username} has left`))
      const userList = getUsersInRoom(user.room)
      io.to(user.room).emit('popUserList',{
        room:user.room,
        users:userList
      })
    }
  })

})
server.listen(port,()=>{
  console.log(`Server up at ${port}`)
})
