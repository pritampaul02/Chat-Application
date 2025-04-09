import express from "express"
import bodyParser from "body-parser"

import corsConfig from "./src/config/cors.config.js"
import { todoRouter } from "./src/routes/todo.routes.js"
import { userRouter } from "./src/routes/user.router.js"



const server = express()

server.use(corsConfig)
server.use(bodyParser.json({ limit: "50mb" }))
server.use(express.json({ limit : "50mb"}))
server.use(bodyParser.urlencoded( { limit : "50mb" , extended : true }) )

// all routes 

server.use('/api/v1/todo' , todoRouter)
server.use('api/v1/user' , userRouter)

server.get("/" , (req , res)=>{
     res.send("application is run ").json({
        message : "all ok "
     })
})


export default server 