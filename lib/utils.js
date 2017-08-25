module.exports = {
  typeof(o) {
    return Object.prototype.toString.call(o).replace(/^\[\w+\s|\]$/g, '').toLowerCase();
  }
};
