const SQL = require('../config/database');
const LANGUAGE = require('../config/language');

const executeQuery = (sqlQuery, inputDataArray) => {
    return new Promise((resolve, reject) => {
        console.log("ave che");
        SQL.query(sqlQuery, inputDataArray, (e, res) => {
            if (e) {
                reject(e);
            } else {
                console.log("response",res);
                resolve(res);
            }
        });
    });
}

const countRecordsWithQuery = async (sqlQuery, inputDataArray) => {
    return new Promise((resolve, reject) => {
        
        SQL.query(sqlQuery, inputDataArray, function (err, res) {
            if (err) {
                console.log("isExist => ", err)
                reject(err);
            } else {

                resolve(res.length);
            }
        });
    });
}

module.exports = {
    executeQuery,
    countRecordsWithQuery
}
