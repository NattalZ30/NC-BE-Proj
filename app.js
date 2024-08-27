const { 
    getTopics, 
} = require("./controllers/app-controllers")

const express = require("express")
app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

//

app.use((err,req,res,next) => {
    if (err === "404: NOT FOUND"){
        res.status(404).json({msg:"404: NOT FOUND"})
    }
    else next(err)
})


app.use((err,req,res,next) => {
    res.status(500).json({msg:"Internal Server Error"})
})

module.exports = app