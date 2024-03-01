import socketIOClient from "socket.io-client";
import { socketIoServer } from "variables/appVariables.jsx";

var socket = null;

export function socketInit () {
  socket = socketIOClient(socketIoServer);
  // socket.on("broadcast msg", data => alert('Socket msg received'));
}

export function getSocket () {
  return socket;
}

// import React from 'react'

// const SocketContext = React.createContext()

// export default SocketContext
