const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

let orderbook = {
    // todo : might need to modify logic of orderbook, to meet market makers   
  "yes" : {
    "0.5" : 0,
    "1" : 0,
    "1.5" : 0,
    "2" : 0,
    "2.5" : 0,
    "3" : 0,
    "3.5" : 0,
    "4" : 34,
    "4.5" : 432,
    "5" : 2331,
    "5.5" : 325,
    "6" : 546,
    "6.5" : 436,
    "7" : 346,
    "7.5" : 234,
    "8" : 463,
    "8.5" : 547,
    "9" : 543,
    "9.5" : 543,
  },
  "no" : {
    "0.5" : 0,
    "1" : 0,
    "1.5" : 0,
    "2" : 0,
    "2.5" : 0,
    "3" : 0,
    "3.5" : 0,
    "4" : 0,
    "4.5" : 0,
    "5" : 0,
    "5.5" : 0,
    "6" : 547,
    "6.5" : 234,
    "7" : 436,
    "7.5" : 346,
    "8" : 567,
    "8.5" : 5473,
    "9" : 235,
    "9.5" : 5375,
  },
}
// dont put an empty line below pendingOrders
let pendingOrders = {"yes" : [],"no" : []}
app.use(express.json())

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.emit('orderbookUpdate', orderbook)

  setInterval(() => {
    io.emit('orderbookUpdate', orderbook)
  }, 1000) 

  socket.on('disconnect', () => {console.log('A user disconnected')})
})

app.post('/buy/:type',async(req,res) => {
    // todo : give the users best available price
    try {
        const { price,quantity,userId } = req.body
        const type = req.params.type
        const available = orderbook[type][price]
        let pending = 0
        if (available) {  
            if (available>=quantity) orderbook[type][price] -= quantity
            else {
                pending = quantity - available
                orderbook[type][price] = 0
            }
        } else pending = quantity
        if (pending) {

            pendingOrders[type].push({
                userId,
                price,
                quantity : quantity - available
            }) 
        }
        
    } catch(error) {
        console.log(error.message)
    }
    res.json({pendingOrders,orderbook})
})
    
app.post('/sell',async(req,res) => {
    const { price,quantity,userId } = req.body
    res.json("sell")
})

app.post('/cancel',async(req,res) => {
    const { price,quantity,userId } = req.body
    res.json("cancel")
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
