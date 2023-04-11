const express = require("express");
// const morgan = require("morgan");

const app = express();

function logOriginalUrl(req, res, next) {
  console.log("Request URL:", req.originalUrl);
  next();
}

function logMethod(req, res, next) {
  console.log("Request Type:", req.method);
  next();
}

var logger = [logOriginalUrl, logMethod];

// app.use(morgan(":method :status :res[content-length] - :response-time ms"));

// 限定了指定路由，支持传递多个中间件
app.get("/user/:id", logger, function (req, res, next) {
  res.send("User Info");
  next();
});

// 不做任何限定的中间件，所有路径都会执行
app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

// 限定请求方法 + 请求路径
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});
