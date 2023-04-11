const Layer = require("./layer");
const methods = require("methods");

function Route(path) {
  this.stack = [];
}

// 遍历layer，执行handle
Route.prototype.dispatch = function (req, res, out) {
  let index = 0;
  const method = req.method.toLowerCase();
  const next = () => {
    if (index >= this.stack.length) return out();
    const layer = this.stack[index++];
    if (method === layer.method) {
      layer.handleRequest(req, res, next);
    } else {
      next();
    }
  };
  next();
};

methods.forEach((method) => {
  Route.prototype[method] = function (path, handles) {
    // 建立 handle layer 保存用户真正的回调
    handles.forEach((handle) => {
      const layer = new Layer(path, handle);
      layer.method = method;
      this.stack.push(layer);
    });
  };
});

module.exports = Route;
