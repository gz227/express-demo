const express = require("./express");
const app = express();

app.use(
  (req, res, next) => {
    console.log("gz", +new Date());
    next();
  },
  (req, res, next) => {
    console.log("gz", 123);
    next();
  }
);

app.get(
  "/user/:id",
  (req, res, next) => {
    console.log("gz", req.url);
    next();
  },
  (req, res) => {
    res.end("hello, world");
  }
);

app.listen(3000, () => {
  console.log("server running on 3000");
});
