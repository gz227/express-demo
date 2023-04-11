const http = require("http");
const Router = require("./router");
const methods = require("methods");

function createApplication() {
  app = function (req, res, next = () => {}) {
    app._router.handle(req, res, next);
  };

  app.listen = function listen(...args) {
    var server = http.createServer(this); // 这里的this就是app，使用app代理的node的req， res，调用handle方法
    return server.listen(...args);
  };

  app.use = function (...args) {
    if (!this._router) this._router = new Router();
    this._router.use(...args);
  };

  // 初始化get\post\delete...方法
  methods.forEach((method) => {
    app[method] = function (path, ...handlers) {
      // 初始化Router
      if (!this._router) this._router = new Router();

      const route = this._router.route(path); // 建立layer和route
      route[method](path, handlers); // 保存真正的回调
    };
  });

  return app;
}

module.exports = createApplication;
