const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics")
            .then(({ rows }) => rows)
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