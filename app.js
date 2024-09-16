const { 
    getTopics,
    getAPIs, 
    getArticleById,
    getArticles,
    getCommentsByArticle,
    postCommentByArticle,
    patchArticleById,
    findCommentById,
    getUsers,
} = require("./controllers/app-controllers")

const cors = require("cors")

const express = require("express")
app = express()

app.use(cors())
app.use(express.json())

//GET

app.get("/api/topics", getTopics)

app.get("/api", getAPIs)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.get("/api/users", getUsers)

//POST

app.post("/api/articles/:article_id/comments", postCommentByArticle)

//PATCH
app.patch("/api/articles/:article_id", patchArticleById)

//DELETE

app.delete("/api/comments/:comment_id", findCommentById)

////////////////////////

app.use((err,req,res,next) => {
    //console.log(err)
    if (err.code === "22P02" || err.code === "23502"){
        res.status(400).json({msg:"400: BAD REQUEST"})
    }
    else next(err)
})

app.use((err,req,res,next) => {
    //console.log(err)
    if (err.status && err.msg)
    {
        res.status(err.status).json({msg:err.msg})
    }
    else next(err)
})


app.use((err,req,res,next) => {
    console.log(err)
    res.status(500).json({msg:"Internal Server Error"})
})

module.exports = app