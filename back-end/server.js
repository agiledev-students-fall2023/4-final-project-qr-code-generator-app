#!/usr/bin/env node

const server = require('./app') // load up the web server

// the port to listen to for incoming requests
// this is set to 3001, while frontend is 3000
//const port = process.env.PORT || 3001

const port = process.env.PORT || 3001

// call express's listen function to start listening to the port
const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})

// a function to stop listening to the port
const close = () => {
  listener.close()
}

module.exports = {
  close
}
