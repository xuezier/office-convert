/**
 * insert unit to array
 *
 * @param {any} unit
 * @param {Number} index
 * @returns {Array}
 * @memberof Array
 */
function insert(unit, index) {
  for (var i = this.length; i >= 0; i--) {
    if (i > index)
      this[i] = this[i - 1];
    else if (i == index) {
      this[i] = unit;
      break;
    }
  }

  if (!(this instanceof Array))
    this.length += 1;

  return this;
}

Array.prototype.insert = insert;
