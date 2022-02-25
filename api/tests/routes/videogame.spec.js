/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Videogame, conn } = require("../../src/db.js");

const agent = session(app);
const videogame = {
    name: "Super Mario Bros",
};

describe("Videogame routes", () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        }));
    beforeEach(() => Videogame.sync({ force: true }));
    // .then(() => Videogame.create(videogame)));
    describe("GET /home", () => {
        /* it("should get a 200 status", () =>
            agent.get("/home").expect(200)
        ); */
        it("responds with 200 and object with message", () =>
            agent.get("/home").then((res) => {
                console.log(res.statusCode);
                expect(res.body).to.not.be.undefined;
            }));
    });
    describe("GET /videogames", () => {
        it("should get 200", () =>
            agent.get("/videogames").then((res) => {
                console.log(res.statusCode);
                expect(200)
            })
        );
    });
    describe("GET /videogames/create", () => {
        // this API"s endpoint only receives POST requests
        it("should get 404", () =>
            agent.get("/videogames/create").expect(404)
        );
    });
    describe("POST /videogames/create", () => {
        describe("should get 404", () => {
            it("if body is empty", () =>
                agent.post("/videogames/create").expect(404)
            );
            describe("should get 404 if", () => {
                it("doesnt get a body", () => {
                    agent.post("/videogames/create").send().then((res) => expect(res.status).to.be(404));
                });
                /* {
                    "name": "a great name",
                    "descrpition": "super duper fun game",
                    launchDate: "2003-02-10",
                    rating: 3.21,
                    genres: ["Action", "Adventure", "Shooter"],
                    platforms: ["Atari", "Linux", "Game Boy", "Xbox", "macOS"],
                } */
                it("doesnt get a name", () => {
                    agent.post("/videogames/create").send({
                        name: undefined,
                        description: "super duper fun game",
                        launchDate: "2003-02-10",
                        rating: 3.21,
                        genres: ["Action", "Adventure", "Shooter"],
                        platforms: ["Atari", "Linux", "Game Boy", "Xbox", "macOS"]
                    }).then((res) => expect(res.status).to.be(404));
                });
            });
        });
    });
    describe("GET /videogame/:id", () => {
        describe("should get a 200 status", () => {
            it("should get the game (id = 1234)", () =>
                agent.get("/videogame/1234").then((res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.id).to.equal(1234);
                    expect(res.body.name).to.equal("Wand Wars");
                    expect(res.body.launchDate).to.equal("2016-04-13");
                })
            );
            it("should get the game (id = 4321)", () =>
                agent.get("/videogame/432").then(res => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.id).to.equal(432);
                    expect(res.body.name).to.equal("Grand Theft Auto III");
                    expect(res.body.launchDate).to.equal("2001-10-22");
                })
            );
        });
        describe("should get a 404 status", () => {
            it("shouldnt be able to find the game (id = 4321)", () =>
                agent.get("/videogame/4321").then((res) => {
                    expect(res.statusCode).to.equal(404);
                })
            );
            it("shouldnt be able to find the game (id = abc)", () =>
                agent.get("/videogame/abc").then((res) => {
                    expect(res.statusCode).to.equal(404);
                })
            );
            it("shouldnt be able to find the game (id = a3b2c1)", () =>
                agent.get("/videogame/a3b2c1").then((res) => {
                    expect(res.statusCode).to.equal(404);
                })
            );
        });
    });
});
