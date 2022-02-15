const { DataTypes } = require('sequelize');

const availablePlatforms = [
    '3DO', 'Android', 'Apple II', 'Atari 2600', 'Atari 5200', 'Atari 7800', 'Atari 8-bit', 'Atari Flashback', 'Atari Lynx', 'Atari ST', 'Atari XEGS', 'Classic Macintosh', 'Commodore / Amiga', 'Dreamcast', 'Game Boy', 'Game Boy Advance', 'Game Boy Color', 'Game Gear', 'GameCube', 'Genesis', 'iOS', 'Jaguar', 'Linux', 'macOS', 'NES', 'Neo Geo', 'Nintendo 3DS', 'Nintendo 64', 'Nintendo DS', 'Nintendo Switch', 'PC', 'PS Vita', 'PSP', 'PlayStation', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'SEGA 32X', 'SEGA CD', 'SEGA Master System', 'SEGA Saturn', 'SNES', 'Web', 'Wii', 'Wii U', 'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series S/X'
]
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    return sequelize.define('videogame', {
        // TODO: use this regex /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/g to recognize local games
        // or use ?source=local in the query
        id: {
            // "No puede ser un ID de un videojuego ya existente en la API rawg"
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isString(value) {
                    if (typeof value !== 'string') {
                        throw new Error("Only strings are accepted")
                    }
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isString(value) {
                    if (typeof value !== 'string') {
                        throw new Error("Only strings are accepted")
                    }
                }
            }
        },
        launchDate: {
            // API returns "released": "2009-10-27" - YYYY-MM-DD
            type: DataTypes.STRING(10),
            defaultValue: "undefined",
            allowNull: true,
            validate: {
                isValidDate(value) {
                    if (value !== null && value !== undefined) {
                        if (!/\d{4}-\d{1,2}-\d{1,2}/i.test(value)) {
                            throw new Error("Date is not valid regex" + value);
                        }

                        let [year, month, day] = value.split("-");
                        year = parseInt(year, 10);
                        month = parseInt(month, 10);
                        day = parseInt(day, 10);

                        // Check the ranges of month and year
                        if (year < 1958 || year > new Date().getFullYear() || month <= 0 || month > 12) {
                            throw new Error("Date is not valid month" + month);
                        }

                        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
                            daysInMonth[1] = 29;

                        if (day < 0 || day > daysInMonth[month - 1]) {
                            throw new Error("Date is not valid days");
                        }
                    }

                }
            }
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                isBetweenZeroAndFive(value) {
                    if (typeof value !== 'number' || value < 0 || value > 5) {
                        throw new Error("Rating should be between zero and five");
                    }
                }
            }
        },
        platforms: {
            // TODO: should I get the available platforms from the API?
            type: DataTypes.ARRAY(DataTypes.STRING(20)),
            allowNull: false,
            validate: {
                isValidPlatform(values) {
                    if (values.length === 0) {
                        throw new Error("There are no platforms");
                    }
                    for (let i = 0; i < values.length; i++) {
                        if (!availablePlatforms.includes(values[i])) {
                            throw new Error(`There's an invalid platform: ${values[i]}`);
                        }
                    }
                }
            }
        }
    });
}
