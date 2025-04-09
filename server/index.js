
import server from "./app.js"
import 'dotenv/config'
import { dbConnection } from "./src/config/database.config.js"


const PORT = process.env.PORT || 8080

dbConnection()

server.listen(PORT  , ()=>{
    console.log(" your server is running successfully " , PORT)
})

