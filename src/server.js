import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/users/index.js"

const server = express()

const port = 3000

server.use(express.json())
server.use("/authors", authorsRouter)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port:", port)
})