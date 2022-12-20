import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const authorsRouter = express.Router()

// console.log("CURRENTS FILE URL: ", import.meta.url)
// console.log("CURRENTS FILE PATH: ", fileURLToPath(import.meta.url))
// console.log("PARENT FOLDER PATH: ", dirname(fileURLToPath(import.meta.url)))
// console.log("TARGET: ", join(dirname(fileURLToPath(import.meta.url)), "authors.json"))

const usersJSONPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")

authorsRouter.post("/", (req, res) => {

  // console.log("REQ BODY:", req.body)

  const newUser = { ...req.body, createdAt: new Date(), updatedAt: new Date(), id: uniqid() }

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  usersArray.push(newUser)

  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray))

  res.status(201).send({ id: newUser.id })
})

authorsRouter.get("/", (req, res) => {

  const fileContentAsABuffer = fs.readFileSync(usersJSONPath)
  const usersArray = JSON.parse(fileContentAsABuffer)
  // console.log("file content: ", usersArray)
  res.send(usersArray)
})

authorsRouter.get("/:authorId", (req, res) => {
  const userId = req.params.userId

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  const user = usersArray.find(user => user.id === userId)

  res.send(user)
})

authorsRouter.put("/:authorId", (req, res) => {

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  const index = usersArray.findIndex(user => user.id === req.params.userId)
  const oldUser = usersArray[index]
  const updatedUser = { ...oldUser, ...req.body, updatedAt: new Date() }
  usersArray[index] = updatedUser

  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray))

  res.send(updatedUser)
})

authorsRouter.delete("/:authorId", (req, res) => {

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath))

  const remainingUsers = usersArray.filter(user => user.id !== req.params.userId)

  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers))

  res.send()
})

export default authorsRouter
