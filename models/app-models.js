const db = require("../db/connection");
const { checkExists, convertDateToTimestamp } = require("../db/seeds/utils")

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics")
            .then(({ rows }) => rows)
}

exports.selectArticles = ( sort_by = "created_at", order = "DESC", topic) => {
    const validSortByQuery = ["author","title","article_id","topic","created_at","votes","article_img_url","comment_count"]
    const validOrder = ["ASC","DESC"]
    if (!validSortByQuery.includes(sort_by) || !validOrder.includes(order.toUpperCase())){
        return Promise.reject({status: 400, msg: "400: BAD REQUEST"})
    }
    const querVal = []
    let artiQuery = `SELECT articles.author, 
                    articles.title,
                    articles.article_id, 
                    articles.created_at, 
                    articles.topic, 
                    articles.votes, 
                    articles.article_img_url,
                    COUNT(comment_id) AS comment_count 
                     FROM articles`
    artiQuery += ` LEFT JOIN comments ON comments.article_id = articles.article_id `                  
    if (topic){
        artiQuery += ` WHERE articles.topic = $1`
        querVal.push(topic)
    }
    artiQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()}`
    return db.query(artiQuery, querVal)
            .then(({ rows }) => {
                if (rows.length === 0) return Promise.reject({status: 404, msg: "404: NOT FOUND"})
                else return rows
            })
}

exports.selectArticleById = async (article_id) => {
    let artiQuery = `SELECT articles.*,COUNT(comment_id) AS comment_count FROM articles`
    artiQuery += ` LEFT JOIN comments ON comments.article_id = articles.article_id`
    let queryVal = []
    let querProms = []
    if (article_id){
        artiQuery += " WHERE articles.article_id = $1"
        queryVal.push(article_id)
        querProms.push(checkExists("articles","article_id",article_id))
    }
    artiQuery +=  ` GROUP BY articles.article_id `
    querProms.push(db.query(artiQuery, queryVal))
    return Promise.all(querProms).then((result) => {
                return result[querProms.length - 1].rows
            })
}

exports.selectCommentsByArticle = async (article_id) => {
    let artiQuery = "SELECT * FROM comments"
    let queryVal = []
    let querProms = []
    if (article_id){
        artiQuery += " WHERE article_id = $1"
        queryVal.push(article_id)
        querProms.push(checkExists("articles","article_id",article_id))
    }
    querProms.push(db.query(artiQuery, queryVal))
    return Promise.all(querProms).then((result) => {
                return result[querProms.length - 1].rows
            })
}

exports.insertCommentByArticle = async (article_id, comment) => {
    let artiQuery = `INSERT INTO comments
                        (author, body, article_id)`
    let queryVal = [comment.username, comment.body, article_id]
    let querProms = []
    querProms.push(checkExists("articles","article_id",article_id))
    querProms.push(checkExists("users","username",comment.username))
    artiQuery += `VALUES
                    ($1, $2, $3)
                RETURNING *;`
    querProms.push(db.query(artiQuery, queryVal))
    return Promise.all(querProms).then((result) => {
                return result[querProms.length - 1].rows
            }).then((rows) => {
                const newRows = convertDateToTimestamp(rows[0])
                return [newRows]
            })
}

exports.updateArticleById = async (article_id, update) =>{
    const queryVal = [update.inc_votes, article_id]
    await checkExists("articles","article_id",article_id)
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, queryVal)
    .then(({ rows }) => rows)
}

exports.deleteCommentById = async (comment_id) =>{
    const queryVal = [comment_id]
    await checkExists("comments","comment_id",comment_id)
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, queryVal)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectUsers = () => {
    return db.query("SELECT * FROM users")
            .then(({ rows }) => rows)
}