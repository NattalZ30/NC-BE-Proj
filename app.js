const { 
    getTopics,
    getAPIs, 
    getArticleById,
    getArticles,
    getCommentsByArticle,
    postCommentByArticle,
} = require("./controllers/app-controllers")

const express = require("express")
app = express()

app.use(express.json())

//GET

app.get("/api/topics", getTopics)

app.get("/api", getAPIs)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticle)

//POST

app.post("/api/articles/:article_id/comments", postCommentByArticle)

//

app.use((err,req,res,next) => {
    //console.log(err)
    if (err.code === "22P02" || err.code === "23502"){
        res.status(400).json({msg:"400: BAD REQUEST"})
    }
    else next(err)
})

app.use((err,req,res,next) => {
    //console.log(err)
    if (err === "404: NOT FOUND"){
        res.status(404).json({msg:"404: NOT FOUND"})
    }
    else next(err)
})


app.use((err,req,res,next) => {
    //console.log(err)
    res.status(500).json({msg:"Internal Server Error"})
})

module.exports = app