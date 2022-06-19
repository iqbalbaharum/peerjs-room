const express = require('express')
const app = express()
const httpServer = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
})

const { PeerServer } = require('peer')

// start peerjs server
const peerServer = PeerServer({
  port: 9000,
  path: '/',
  proxied:  true,
  allow_discovery: true,
  config: { 'iceServers': [
    { 'url': 'stun:stun.l.google.com:19302' }  
  ]}
})

// on connection
io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    socket.join(data.roomId)
    socket.broadcast.emit('user-join', data.userId)
  })

  socket.on('disconnect', (data) => {
    socket.broadcast.emit('user-leave', data.userId)
  })
})

httpServer.listen(3010, () => {
  console.log(`room socket.io starting at port ${3010}`)
  console.log(`PeerJS server starting at port ${9000}`)
})
