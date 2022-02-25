const { Videogame, conn } = require('../../src/db.js');
const { expect } = require('chai');

xdescribe('Videogame model', () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
    describe('Validators', () => {
        beforeEach(() => Videogame.sync({ force: true }));
        describe('name should', () => {
            let incorrectlyNamedGame = {
                name: "",
                description: "lorem ipsum",
                launchDate: "2003-12-5",
                rating: 4.2,
                platforms: ["PlayStation 4", "Xbox", "PC"]
            }
            let correctlyNamedGame = {
                description: "lorem ipsum",
                launchDate: "2003-5-24",
                rating: 4.2,
                platforms: ["PlayStation 4", "Xbox", "PC"]
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
                name: "my great game",
                description: "",
                launchDate: "1987-4-5",
                rating: 4.2,
                platforms: ["PlayStation 4", "Xbox", "PC"]
            }
            let correctlyDescribedGame = {
                name: "another greate name",
                description: "",
                launchDate: "2011-8-17",
                rating: 4.2,
                platforms: ["PlayStation 4", "Xbox", "PC"]
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
                    .then(() => done())
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
                name: "another greate game",
                description: "the best",
                rating: 3.6,
                platforms: ["PlayStation 4", "PC"]
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
        describe('rating should', () => {
            let ratedGame = {
                name: "I rated this game",
                description: "it could be better",
                launchDate: null,
                platforms: ["PlayStation 4", "PC", "Xbox"]
            };
            describe('accept', () => {
                it('null', (done) => {
                    ratedGame.rating = null;
                    Videogame.create(ratedGame)
                        .then(() => done())
                        .catch(() => done(new Error('It should accept a null rating')));
                });
                it('undefined', (done) => {
                    ratedGame.rating = undefined;
                    Videogame.create(ratedGame)
                        .then(() => done())
                        .catch(() => done(new Error('It should accept an undefined rating')));
                });
                it('zero', (done) => {
                    ratedGame.rating = 0;
                    Videogame.create(ratedGame)
                        .then(() => done())
                        // .catch(() => done(new Error('It should accept a 0 rating')));
                        .catch((err) => {
                            console.log(err);
                            done(new Error('It should accept a 0 rating'))
                        });
                });
                it('five', (done) => {
                    ratedGame.rating = 5;
                    Videogame.create(ratedGame)
                        .then(() => done())
                        .catch(() => done(new Error('It should accept a 5 rating')));
                });
                describe('anything in between', () => {
                    it('2.3', (done) => {
                        ratedGame.rating = 2.3;
                        Videogame.create(ratedGame)
                            .then(() => done())
                            .catch(() => done(new Error('It should accept a 2.3 rating')));
                    });
                    it('3.7', (done) => {
                        ratedGame.rating = 3.7;
                        Videogame.create(ratedGame)
                            .then(() => done())
                            .catch(() => done(new Error('It should accept a 3.7 rating')));
                    });
                });
            });
            describe('throw an error when it is', () => {
                it('< 0 (-0.1)', (done) => {
                    ratedGame.rating = -0.1;
                    Videogame.create(ratedGame)
                        .then(() => done(new Error('It should reject a negative rating')))
                        .catch(() => done());
                });
                it('< 0 (-78914)', (done) => {
                    ratedGame.rating = -78914;
                    Videogame.create(ratedGame)
                        .then(() => done(new Error('It should reject a negative rating')))
                        .catch(() => done());
                });
                it('> 5 (5.1)', (done) => {
                    ratedGame.rating = 5.1;
                    Videogame.create(ratedGame)
                        .then(() => done(new Error('It should reject a > 5 rating')))
                        .catch(() => done());
                });
                it('> 5 (48903)', (done) => {
                    ratedGame.rating = 48903;
                    Videogame.create(ratedGame)
                        .then(() => done(new Error('It should reject a > 5 rating')))
                        .catch(() => done());
                });
            });
        });
        describe('platforms should', () => {
            describe('accept', () => {
                let validPlatformsGame = {
                    name: "I wanna play this game",
                    description: "where can I play it",
                    launchDate: "2008-03-25"
                };
                describe('an array of', () => {
                    it('one valid element', (done) => {
                        validPlatformsGame.platforms = ["PlayStation 4"];
                        Videogame.create(validPlatformsGame)
                            .then(() => done())
                            .catch(() => done(new Error('It should accept a one-element array')));
                    });
                    it('two valid elements', (done) => {
                        validPlatformsGame.platforms = ["PlayStation 4", "PC"];
                        Videogame.create(validPlatformsGame)
                            .then(() => done())
                            .catch(() => done(new Error('It should accept a two-element array')));
                    });
                    it('three valid elements', (done) => {
                        validPlatformsGame.platforms = ["PlayStation 4", "PC", "SNES"];
                        Videogame.create(validPlatformsGame)
                            .then(() => done())
                            .catch(() => done(new Error('It should accept a three-element array')));
                    });
                });
            });
            describe('reject', () => {
                let invalidPlatformsGame = {
                    name: "I wanna play this game",
                    description: "where can I play it",
                    launchDate: "2008-03-25"
                };
                it('an empty array', (done) => {
                    invalidPlatformsGame.platforms = [];
                    Videogame.create(invalidPlatformsGame)
                        .then(() => done(new Error('It should reject an empty array')))
                        .catch(() => done());
                });
                describe('an array of', () => {
                    it('one invalid element', (done) => {
                        invalidPlatformsGame.platforms = ["error me"];
                        Videogame.create(invalidPlatformsGame)
                            .then(() => done(new Error('It should reject an invalid array')))
                            .catch(() => done());
                    });
                    it('one or more invalid elements', (done) => {
                        invalidPlatformsGame.platforms = ["error me", "PC"];
                        Videogame.create(invalidPlatformsGame)
                            .then(() => done(new Error('It should reject an invalid array')))
                            .catch(() => done());
                    });
                    it('one or more invalid elements (reversed)', (done) => {
                        invalidPlatformsGame.platforms = ["PC", "nope"];
                        Videogame.create(invalidPlatformsGame)
                            .then(() => done(new Error('It should reject an invalid array')))
                            .catch(() => done());
                    });
                    it('two or more invalid elements', (done) => {
                        invalidPlatformsGame.platforms = ["macOS", "custom device", "PC"];
                        Videogame.create(invalidPlatformsGame)
                            .then(() => done(new Error('It should reject an invalid array')))
                            .catch(() => done());
                    });
                });
            });
        });
    });
});
