const express = require('express');
const socketIO = require('socket.io');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

function joinRoom (socket, newRoom) {
    let prevRoom = Object.keys(socket.rooms)[1];
    socket.leave(prevRoom);
    socket.join(newRoom);
    socket.emit('roomJoined', newRoom);
    console.log("joined room");
}

const io = socketIO(server, {
    cors: {
        origins: ['localhost:8080']
    }
})

io.on('connection', (socket)=>{
    console.log("someone joined");

    socket.on('createRoom', roomName=>{
        console.log(roomName);
        joinRoom(socket, roomName);
    });

    socket.on('joinRoom', (roomName)=>{
        joinRoom(socket, roomName);
    });

    socket.on('leaveRoom', (roomName)=>{
        socket.leave(roomName);
    });

    socket.on('sendData', data=>{
        console.log(Array.from(socket.rooms)[1]);
        socket.to(Array.from(socket.rooms)[1]).emit('dataChange', data); //change to io.to(..).. if the current setup causes issues
    })
})

server.listen(3000, ()=>{
    console.log("server is running");
})