// mysql - 동기 / mysql/promise - 비동기
// 비동기로 처리하면 순서가 보장됨
const mysql = require("mysql2/promise");
const dbInfo = {
    host: "localhost",
    user: "root",
    password: "1q2w3e4r",
    database: "todo"
};

module.exports = {
    init: async function () {
        this.db = await mysql.createConnection(dbInfo);
    },

    query: async function (sql, callback) {
        const [result] = await this.db.execute(sql);
        callback({ success: true, datas: result });
    },
}