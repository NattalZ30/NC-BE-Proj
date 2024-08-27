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
    })
})