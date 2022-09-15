// npm 모듈
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 80;

// 로컬 모듈
const db = require("./config/db");
const server = require("./config/server");

// DB 셋팅
db.init();

// 서버 초기 셋팅
server.init(express(), port);

// 미들웨어 설정
server.setMiddleWare(bodyParser.urlencoded({ extended: true }));
// express 4.16 이후 express에서 json미들웨어 제공 body-parser 사용하지 않아도됨
server.setMiddleWare(express.json());
server.setMiddleWare(express.static(__dirname + "/public"));
// server.setMiddleWare(cors({ origin: true }));

// 서버 연결
server.connect();

server.api("get", "/", (req, res) => {
    res.status(200).sendFile(__dirname + "/index.html");
});

// 서버 CRUD
server.api("get", "/api/todo", (req, res) => {
    const readSql = `SELECT * FROM todotable`;

    db.query(readSql, payload => {
        const { success } = payload;

        if (success) {
            res.send(payload);
        }
    });
});

server.api("post", "/api/todo", (req, res) => {
    let { id, content, complete } = req.body;

    const insertSql = `INSERT INTO todotable(id, content, complete) VALUES('${id}', '${content}', '${complete}')`;

    db.query(insertSql, payload => {
        payload.success && res.send(payload);
    });
});

server.api("put", "/api/todo/:id", (req, res) => {
    const { id } = req.params;
    const selectSql = `SELECT complete FROM todotable WHERE id="${id}"`;

    db.query(selectSql, payload => {
        const { success, datas } = payload;

        if (success) {
            datas[0].complete = datas[0].complete === 0 ? 1 : 0;
            const updateSql = `UPDATE todotable SET complete="${datas[0].complete}" WHERE id="${id}"`;

            db.query(updateSql, payload => {
                payload.success && res.send(payload);
            });
        }
    });
});

server.api("delete", "/api/todo/:id", (req, res) => {
    const { id } = req.params;
    const deleteSql = `DELETE FROM todotable WHERE id="${id}";`;

    db.query(deleteSql, payload => {
        payload.success && res.send(payload);
    });
});