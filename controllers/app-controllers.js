const { selectTopics, 
  selectArticleById, 
  selectArticles, 
  selectCommentsByArticle,
  insertCommentByArticle,
  updateArticleById,
  deleteCommentById,
  selectUsers, 
} = require("../models/app-models")
const fs = require("fs/promises")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
      })
    .catch(next)
}

exports.getAPIs = (req, res, next) => {
    return fs.readFile("./endpoints.json","utf-8")
    .then((data) => {
        return JSON.parse(data)
    })
    .then((endpoints) => {
        //console.log(data)
        res.status(200).json({ endpoints });
      })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
  selectArticles()
  .then((articles) => {
      res.status(200).send({ articles });
    })
  .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticleById(article_id)
  .then((articles) => {
      res.status(200).send({ articles });
    })
  .catch(next)
}

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params
  selectCommentsByArticle(article_id)
  .then((comments) => {
      res.status(200).send({ comments });
    })
  .catch(next)
}

exports.postCommentByArticle = (req, res, next) => {
  const { article_id } = req.params
  const comment = req.body
  insertCommentByArticle(article_id, comment)
  .then((comment) => {
      res.status(201).send({ comment });
    })
  .catch(next)
}

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params
  const update = req.body
  updateArticleById(article_id, update)
  .then((update) => {
      res.status(200).send({ update });
    })
  .catch(next)
}

exports.findCommentById = (req, res, next) => {
  const { comment_id } = req.params
  deleteCommentById(comment_id)
  .then((deleted) => {
    res.status(204).send({ deleted });
  })
  .catch(next)
}

exports.getUsers = (req, res, next) => {
  selectUsers()
  .then((users) => {
      res.status(200).send({ users });
    })
  .catch(next)
}
