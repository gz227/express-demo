const pathRegexp = require("path-to-regexp");

function Layer(path, handle) {
  this.path = path;
  this.handle = handle;
  this.params = {};
  this.regexp = pathRegexp(path, (this.keys = []), {});
}

Layer.prototype.match = function (path) {
  if (!this.route) return true; // 中间件
  const match = this.regexp.exec(path);
  if (match) {
    Object.keys(this.keys).forEach((key, index) => {
      this.params.key = match[index + 1];
    });
    return true;
  }
  return false;
};

Layer.prototype.handleRequest = function (req, res, next) {
  this.handle(req, res, next);
};

module.exports = Layer;
