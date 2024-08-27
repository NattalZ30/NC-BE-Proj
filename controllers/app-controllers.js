const { selectTopics, selectArticleById } = require("../models/app-models")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
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
