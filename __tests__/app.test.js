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
})