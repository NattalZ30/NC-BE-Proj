const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics")
            .then(({ rows }) => rows)
}

exports.selectArticles = () => {
    let artiQuery = `SELECT articles.author, 
                    articles.title,
                    articles.article_id, 
                    articles.created_at, 
                    articles.topic, 
                    articles.votes, 
                    articles.article_img_url,
                    COUNT(comment_id) AS comment_count 
                     FROM articles`
    artiQuery += ` LEFT JOIN comments ON comments.article_id = articles.article_id 
                   GROUP BY articles.article_id`
    artiQuery += ` ORDER BY created_at DESC`
    return db.query(artiQuery)
            .then(({ rows }) => {
                if (rows.length === 0) return Promise.reject("404: NOT FOUND")
                else return rows
            })
}

exports.selectArticleById = (article_id) => {
    let artiQuery = "SELECT * FROM articles"
    let queryVal = []
    if (article_id){
        artiQuery += " WHERE article_id = $1"
        queryVal.push(article_id)
    }
    return db.query(artiQuery, queryVal)
            .then(({ rows }) => {
                if (rows.length === 0) return Promise.reject("404: NOT FOUND")
                else return rows
            })
}