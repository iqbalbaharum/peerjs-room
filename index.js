const express = require('express')
const app = express()
const httpServer = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: false
  }
})

// on connection
io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    socket.join(data.roomId)
    socket.broadcast.emit(`${data.roomId}:user-join`, data.userId)
  })

  socket.on('leave-room', (data) => {
    socket.broadcast.emit(`${data.roomId}:user-leave`, data.userId)
    socket.leave(data.roomId)
  })

  // socket.on('disconnect', (socket) => {
  //   socket.broadcast.emit(`user-leave-${data.roomId}`, data.userId)
  // })
})

httpServer.listen(3010, () => {
  console.log(`room socket.io starting at port ${3010}`)
})
