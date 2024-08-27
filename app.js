const { 
    getTopics, 
    getArticleById,
} = require("./controllers/app-controllers")

const { getAPIs } = require("./db/seeds/utils")

const express = require("express")
app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getAPIs)

app.get("/api/articles/:article_id", getArticleById)

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