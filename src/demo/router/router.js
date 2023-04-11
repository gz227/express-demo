const express = require("express");
const { getDb, saveDb } = require("./db");

const router = express.Router(); // 路由实例其实就相当于一个 mini Express 实例

router.get("/:id", async (req, res, next) => {
  try {
    const db = await getDb();

    const todo = db.todos.find(
      (todo) => todo.id === Number.parseInt(req.params.id)
    );

    if (!todo) {
      return res.status(404).end();
    }

    res.status(200).json(todo);
  } catch (err) {
    // next('route') 往后匹配当前中间件堆栈中的下一个
    next(err); // 跳过所有剩余的无错误处理路由和中间件函数，只匹配错误处理的中间件函数执行。可传递任何值，都会被当做错误处理，除了字符串'route'。
  }
});

router.post("/", async (req, res, next) => {
  try {
    // 1. 获取客户端请求体参数
    const todo = req.body;
    // 2. 数据验证
    if (!todo.title) {
      return res.status(422).json({
        error: "The field title is required.",
      });
    }

    // 3. 数据验证通过，把数据存储到 db 中
    const db = await getDb();

    const lastTodo = db.todos[db.todos.length - 1];
    todo.id = lastTodo ? lastTodo.id + 1 : 1;
    db.todos.push(todo);
    await saveDb(db);
    // 4. 发送响应
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const todoId = Number.parseInt(req.params.id);
    const db = await getDb();
    const index = db.todos.findIndex((todo) => todo.id === todoId);
    if (index === -1) {
      return res.status(404).end();
    }
    db.todos.splice(index, 1);
    await saveDb(db);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
