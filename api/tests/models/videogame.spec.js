const { Videogame, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Videogame model', () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
    describe('Validators', () => {
        beforeEach(() => Videogame.sync({ force: true }));
        describe('name should', () => {
            let incorrectlyNamedGame = {
                // id: 1,
                name: "",
                description: "lorem ipsum",
                launchDate: "2003-12-5",
                rating: 4.2,
                platforms: ["PS4", "XBox", "PC"]
            }
            let correctlyNamedGame = {
                // id: 2,
                description: "lorem ipsum",
                launchDate: "2003-5-24",
                rating: 4.2,
                platforms: ["PS4", "XBox", "PC"]
            }
            describe('throw an error when it is', () => {
                it('null', (done) => {
                    incorrectlyNamedGame.name = null;
                    Videogame.create(incorrectlyNamedGame)
                        .then(() => done(new Error('It requires a valid name')))
                        .catch(() => done());
                });
                it('undefined', (done) => {
                    incorrectlyNamedGame.name = undefined;
                    Videogame.create(incorrectlyNamedGame)
                        .then(() => done(new Error('It requires a valid name')))
                        .catch(() => done());
                });
                it('a number', (done) => {
                    incorrectlyNamedGame.name = 17;
                    Videogame.create(incorrectlyNamedGame)
                        .then(() => done(new Error('It requires a valid name')))
                        .catch(() => done());
                });
                it('a boolean', (done) => {
                    incorrectlyNamedGame.name = false;
                    Videogame.create(incorrectlyNamedGame)
                        .then(() => done(new Error('It requires a valid name')))
                        .catch(() => done());
                });
            });
            it('accept a valid name (Counter Strike: Global Operations)', () => {
                correctlyNamedGame.name = "Counter Strike: Global Operations";
                Videogame.create(correctlyNamedGame)
                    .then(() => done())
                    .catch(() => done(new Error('It should accept a valid name')));
            });
            it('accept a valid name (League Of Legends)', () => {
                correctlyNamedGame.name = "League Of Legends";
                Videogame.create(correctlyNamedGame)
                    .then(() => done())
                    .catch(() => done(new Error('It should accept a valid name')));
            });
        });
        describe('description should', () => {
            let incorrectlyDescribedGame = {
                // id: 1,
                name: "my great game",
                description: "",
                launchDate: "1987-4-5",
                rating: 4.2,
                platforms: ["PS4", "XBox", "PC"]
            }
            let correctlyDescribedGame = {
                // id: 2,
                name: "another greate name",
                description: "",
                launchDate: "2011-8-17",
                rating: 4.2,
                platforms: ["PS4", "XBox", "PC"]
            }
            describe('throw an error when it is', () => {
                it('null', (done) => {
                    incorrectlyDescribedGame.description = null;
                    Videogame.create(incorrectlyDescribedGame)
                        .then(() => done(new Error('It requires a valid description')))
                        .catch(() => done());
                });
                it('undefined', (done) => {
                    incorrectlyDescribedGame.description = undefined;
                    Videogame.create(incorrectlyDescribedGame)
                        .then(() => done(new Error('It requires a valid description')))
                        .catch(() => done());
                });
                it('a number', (done) => {
                    incorrectlyDescribedGame.description = 17;
                    Videogame.create(incorrectlyDescribedGame)
                        .then(() => done(new Error('It requires a valid description')))
                        .catch(() => done());
                });
                it('a boolean', (done) => {
                    incorrectlyDescribedGame.description = false;
                    Videogame.create(incorrectlyDescribedGame)
                        .then(() => done(new Error('It requires a valid description')))
                        .catch(() => done());
                });
            });
            it('accept a valid description (super duper shooter game)', (done) => {
                correctlyDescribedGame.description = "super duper shooter game";
                Videogame.create(correctlyDescribedGame)
                    // .then(() => done())
                    .then((res) => {
                        console.log(res);
                        done();
                    })
                    .catch(() => done(new Error('It should accept a valid description')));
            });
            it('accept a valid description (super duper MOBA game)', (done) => {
                correctlyDescribedGame.description = "super duper MOBA game";
                Videogame.create(correctlyDescribedGame)
                    .then(() => done())
                    .catch(() => done(new Error('It should accept a valid description')));
            });
        });
        describe('launch date should', () => {
            let anyLaunchDateGame = {
                // id: 1,
                name: "another greate game",
                description: "the best",
                rating: 3.6,
                platforms: ["PS4", "PC"]
            };
            describe('accept', () => {
                it('a null value', (done) => {
                    anyLaunchDateGame.launchDate = null;
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done())
                        .catch(() => done(new Error('It should accept a null launch date')));
                });

                it('an actual date (1993-2-1)', (done) => {
                    anyLaunchDateGame.launchDate = "1993-2-1";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done())
                        .catch(() => done(new Error('It should accept a valid launch date')));
                });
                it('an actual date (1996-2-29)', (done) => {
                    anyLaunchDateGame.launchDate = "1996-2-29";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done())
                        .catch(() => done(new Error('It should accept a valid launch date')));
                });
            });
            describe('should throw an error when launchDate is', () => {
                it('undefined', (done) => {
                    anyLaunchDateGame.launchDate = undefined;
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done(new Error('It should reject an undefined launch date')))
                        .catch(() => done());
                });
                it('an invalid year', (done) => {
                    anyLaunchDateGame.launchDate = "1920-02-12";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done(new Error('It should reject an invalid year')))
                        .catch(() => done());
                });
                it('an invalid month < 1', (done) => {
                    anyLaunchDateGame.launchDate = "1975-0-14";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done(new Error('It should reject an invalid month')))
                        .catch(() => done());
                });
                it('an invalid month > 12', (done) => {
                    anyLaunchDateGame.launchDate = "2012-20-21";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done(new Error('It should reject an invalid month')))
                        .catch(() => done());
                });
                it('an invalid day (Feb. 29)', (done) => {
                    anyLaunchDateGame.launchDate = "1999-2-29";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done(new Error('It should reject an invalid day')))
                        .catch(() => done());
                });
                it('an invalid day (Apr. 31)', (done) => {
                    anyLaunchDateGame.launchDate = "1999-4-31";
                    Videogame.create(anyLaunchDateGame)
                        .then(() => done(new Error('It should reject an invalid day')))
                        .catch(() => done());
                });
            })
        });
    });
});
