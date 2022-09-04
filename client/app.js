// npm 모듈
const express = require("express");
const port = 4000;

// 로컬 모듈
const server = require("../server/config/server");

// 서버 초기 셋팅
server.init(express(), port);
// 미들웨어 설정
server.setMiddleWare(express.static(__dirname + "/src"));
// 서버 연결
server.connect();

server.api("get", "/", (req, res) => {
    console.log("asdsad");
    res.status(200).sendFile(__dirname + "/index.html");
});