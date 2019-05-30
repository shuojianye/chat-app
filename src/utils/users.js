const users = []

// add user, remove user, getUser, getUsersInRoom
const getUser = (id)=>{
  const user = users.find((user)=>{
    return user.id===id
  })
  return user
}

const getUsersInRoom = (room)=>{
  const user = users.filter((user)=>{
    return user.room===room
  })
  return user
}


const removeUser = (id)=>{
  const index = users.findIndex((user)=>{
    return user.id===id
  })
  if (index!==-1){
    return users.splice(index,1)[0]
  }
}


const addUser = ({id, username, room})=>{
  // clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  //validate the data
  if (!username || !room){
    return {
      error: 'User name or room number are requried',
      user:undefined
    }
  }
  //check for existing user

  const existingUser = users.find((user)=>{
    return user.room===room && user.username===username
    })
  // validate username

  if(existingUser){
    return {
      error:'Username already taken',
      user:undefined
    }
  }
  //store user
  const user = {id,username,room}
  users.push(user)
  return {error:undefined,user}
}

module.exports={
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

// addUser({
//   id:22,
//   username:'ahah',
//   room:'nowhere'
// })
// console.log(users)
// addUser({
//   id:23,
//   username:'lol',
//   room:'nowhere'
// })
// console.log(users)
// addUser({
//   id:25,
//   username:'meow',
//   room:'elsewhere'
// })
//
// console.log(users)
// const removedUser= removeUser(22)
// console.log(users)
// console.log(removedUser)
// const userInnoWhere = getUsersInRoom('nowhere')
// console.log('roomNowhere')
// console.log(userInnoWhere)
//
// const userInelseWhere = getUsersInRoom('elsewhere')
// console.log('roomelsewhere')
// console.log(userInelseWhere)
//
// const getuser22 = getUser(22)
// console.log('user22')
// console.log(getuser22)
//
// const getuser23 = getUser(23)
// console.log('user23')
// console.log(getuser23)
//
// const getuser25 = getUser(25)
// console.log('user25')
// console.log(getuser25)
