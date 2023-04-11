const url = require("url");
const Route = require("./route");
const Layer = require("./layer");

function Router() {
  this.stack = [];
}

Router.prototype.route = function (path) {
  const route = new Route(path);
  const layer = new Layer(path, route.dispatch.bind(route)); // router layer
  layer.route = route; // layer和route建立联系
  this.stack.push(layer); // 保存layer
  return route;
};

// 遍历所有layer，匹配path，执行handle
Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url);

  let index = 0;
  const next = () => {
    // res.end(`Can not get ${pathname}`)
    if (index >= this.stack.length) return out();
    const layer = this.stack[index++];
    const match = layer.match(pathname);
    if (match) {
      req.params = req.params = {};
      Object.assign(req.params, layer.params);
      layer.handleRequest(req, res, next);
    } else {
      next();
    }
  };
  next();
};

Router.prototype.use = function (path, ...handles) {
  // Layer层的参数兼容处理
  if (typeof path === "function") {
    handles.unshift(path);
    path = "/";
  }
  // 保存middleware 中的layer
  handles.forEach((handle) => {
    var layer = new Layer(path, handle);
    layer.route = undefined;
    this.stack.push(layer);
  });
};

module.exports = Router;
