/**
 * insert unit to array
 *
 * @param {any} unit
 * @param {Number} index
 * @returns {Array}
 * @memberof Array
 */
function insert(unit, index) {
  if (index > this.length) throw new Error('index can not bigger than length');

  if (index < 0) index = 0;

  Array.prototype.splice.call(this, index, 0, unit);

  return this;
}

Array.prototype.insert = insert;
