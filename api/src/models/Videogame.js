const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // name, descrip, launch, rating, platforms
    return sequelize.define('videogame', {
        id: {
            type: DataTypes.INTEGER,
            initialValue: 0,
            autoIncrement: true,
            primaryKey: true,
            set (value) {
                this.setDataValue('id', `local-${value}`);
            }
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
            validate: {
                isFloat: true
            }
        },
        platforms: {
            type: DataTypes.ARRAY(DataTypes.STRING(20)),
            allowNull: false
        },
        isFromExternalAPI: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
}
