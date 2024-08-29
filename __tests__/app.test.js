const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { reduce } = require("../db/data/test-data/articles");

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("CORE:",() => {
    describe("Topics:", () => {
        describe("GET:", () => {
            it("200: returns all topics", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then((response) => {
                    const {
                        body: { topics },
                    } = response;
                    expect(topics).toHaveLength(3)
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug");
                        expect(topic).toHaveProperty("description");
                    })
                })
            })

        })
    })

    it("200: returns all API endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            const {
                body: { endpoints },
            } = response;
            expect(typeof endpoints).toBe("object")
        })
    })

    describe("Articles:", () => {
        describe("GET:", () => {
            it("200: returns all articles", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then((response) => {
                    const {
                        body: { articles },
                    } = response;
                    expect(articles).toBeSortedBy('created_at', { descending: true, coerce: true})
                    expect(articles).toHaveLength(13)
                    articles.forEach((article) => {
                        expect(article).not.toHaveProperty("body");
                        expect(article).toHaveProperty("author");
                        expect(article).toHaveProperty("title");
                        expect(article).toHaveProperty("article_id");
                        expect(article).toHaveProperty("comment_count");
                        expect(article).toHaveProperty("created_at");
                        expect(article).toHaveProperty("topic");
                        expect(article).toHaveProperty("votes");
                        expect(article).toHaveProperty("article_img_url");
                    })
                })
            }),
            it("200: returns all articles (sorting queries)", () => {
                return request(app)
                .get("/api/articles?sort_by=comment_count&order=asc")
                .expect(200)
                .then((response) => {
                    const {
                        body: { articles },
                    } = response;
                    expect(articles).toBeSortedBy('comment_count', { descending: false, coerce: true})
                    expect(articles).toHaveLength(13)
                    articles.forEach((article) => {
                        expect(article).not.toHaveProperty("body");
                        expect(article).toHaveProperty("author");
                        expect(article).toHaveProperty("title");
                        expect(article).toHaveProperty("article_id");
                        expect(article).toHaveProperty("comment_count");
                        expect(article).toHaveProperty("created_at");
                        expect(article).toHaveProperty("topic");
                        expect(article).toHaveProperty("votes");
                        expect(article).toHaveProperty("article_img_url");
                    })
                })
            }),
            it("400: invalid sorting queries", () => {
                return request(app)
                .get("/api/articles?sort_by=comment_count&order=assc")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            }),
            it("200: returns requested article", () => {
                return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then((response) => {
                    const {
                        body: { articles },
                    } = response;
                    expect(articles).toHaveLength(1)
                    articles.forEach((article) => {
                        expect(article).toHaveProperty("author");
                        expect(article).toHaveProperty("title");
                        expect(article).toHaveProperty("article_id");
                        expect(article).toHaveProperty("body");
                        expect(article).toHaveProperty("created_at");
                        expect(article).toHaveProperty("topic");
                        expect(article).toHaveProperty("votes");
                        expect(article).toHaveProperty("article_img_url");
                    })
                })
            })
            it("400: returns Error message", () => {
                return request(app)
                .get("/api/articles/eeee")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            })
            it("404: returns Error message", () => {
                return request(app)
                .get("/api/articles/100000000")
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("404: NOT FOUND")
                })
            })
        })
        describe("PATCH:", () => {
            it("200: patches given article", () => {
                return request(app)
                .patch("/api/articles/1")
                .send({
                    inc_votes : 1 
                })
                .expect(200)
                .then((response) => {
                    const {
                        body: { update },
                    } = response;
                    expect(update).toHaveLength(1)
                    expect(update[0].votes).toBe(101);
                })
            }),
            it("400: returns Error message", () => {
                return request(app)
                .get("/api/articles/eeee")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            })
            it("404: returns Error message", () => {
                return request(app)
                .patch("/api/articles/100000000")
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("404: NOT FOUND")
                })
            })
        })
    })
    describe("Comments:", () => {
        describe("GET:", () => {
            it("200: returns comments attached to an article", () => {
                return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then((response) => {
                    const {
                        body: { comments },
                    } = response;
                    expect(comments).toBeSortedBy('created_at', { descending: true, coerce: true})
                    expect(comments).toHaveLength(11)
                    comments.forEach((comment) => {
                        expect(comment).toHaveProperty("body");
                        expect(comment).toHaveProperty("author");
                        expect(comment).toHaveProperty("article_id");
                        expect(comment).toHaveProperty("comment_id");
                        expect(comment).toHaveProperty("created_at");
                        expect(comment).toHaveProperty("votes");
                    })
                })
            }),
            it("200: returns empty array to an article without comments", () => {
                return request(app)
                .get("/api/articles/4/comments")
                .expect(200)
                .then((response) => {
                    const {
                        body: { comments },
                    } = response;
                    expect(typeof comments).toBe("object")
                    expect(comments).toHaveLength(0)
                    comments.forEach((comment) => {
                        expect(comment).toHaveProperty("body");
                        expect(comment).toHaveProperty("author");
                        expect(comment).toHaveProperty("article_id");
                        expect(comment).toHaveProperty("comment_id");
                        expect(comment).toHaveProperty("created_at");
                        expect(comment).toHaveProperty("votes");
                    })
                })
            }),
            it("400: returns Error message", () => {
                return request(app)
                .get("/api/articles/eeee/comments")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            })
            it("404: returns Error message", () => {
                return request(app)
                .get("/api/articles/100000000/comments")
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("404: NOT FOUND")
                })
            })
        })
        describe("POST:", () => {
            it("201: attaches new comment to an article", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({
                    body:"meow",
                    username: "icellusedkars",
                })
                .expect(201)
                .then((response) => {
                    const {
                        body: { comment },
                    } = response;
                    const newComment = comment[0]
                    expect(newComment.body).toBe("meow");
                    expect(newComment.author).toBe("icellusedkars");
                    expect(newComment.article_id).toBe(1);
                    expect(newComment.comment_id).toBe(19);
                    expect(newComment).toHaveProperty("created_at");
                    expect(newComment.votes).toBe(0);
                })
            }),
            it("201: attaches new comment to an article without comments", () => {
                return request(app)
                .post("/api/articles/4/comments")
                .send({
                    body:"meow",
                    username: "icellusedkars",
                })
                .expect(201)
                .then((response) => {
                    const {
                        body: { comment },
                    } = response;
                    const newComment = comment[0]
                    expect(newComment.body).toBe("meow");
                    expect(newComment.author).toBe("icellusedkars");
                    expect(newComment.article_id).toBe(4);
                    expect(newComment.comment_id).toBe(19);
                    expect(newComment).toHaveProperty("created_at");
                    expect(newComment.votes).toBe(0);
                })
            }),
            it("404: valid article_id, but non-existent username", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({
                    body:"meow",
                    username: "theUser",
                })
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("404: NOT FOUND")
                })
            }),
            it("400: valid article_id, but missing inserts", () => {
                return request(app)
                .post("/api/articles/1/comments")
                .send({
                    username: "icellusedkars",
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            }),
            it("400: invalid article_id", () => {
                return request(app)
                .post("/api/articles/eeee/comments")
                .send({
                    body:"meow",
                    username: "icellusedkars",
                })
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            }),
            it("404: non-existent article", () => {
                return request(app)
                .post("/api/articles/100000000/comments")
                .send({
                    body:"meow",
                    username: "icellusedkars",
                })
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("404: NOT FOUND")
                })
            })
        }),
        describe("DELETE:", () => {
            it("204: deletes and returns given comments", () => {
                return request(app)
                .delete("/api/comments/1")
                .expect(204)
            }),
            it("400: returns Error message", () => {
                return request(app)
                .delete("/api/comments/eeee")
                .expect(400)
                .then((response) => {
                    expect(response.body.msg).toBe("400: BAD REQUEST")
                })
            })
            it("404: returns Error message", () => {
                return request(app)
                .delete("/api/comments/100000000")
                .expect(404)
                .then((response) => {
                    expect(response.body.msg).toBe("404: NOT FOUND")
                })
            })
        })
    },)
    describe("Users:", () => {
        describe("GET:", () => {
            it("200: returns all Users", () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then((response) => {
                    const {
                        body: { users },
                    } = response;
                    expect(users).toHaveLength(4)
                    users.forEach((user) => {
                        expect(user).toHaveProperty("username");
                        expect(user).toHaveProperty("name");
                        expect(user).toHaveProperty("avatar_url");
                    })
                })
            })

        })
    })
})