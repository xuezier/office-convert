'use strict';
module.exports = {
  finish: function() {
    this.emit('service.start.queue.finished');
  },
  running: function() {

  },
  stop: function() {

  },
  serviceStart: function() {
    if (!this._startQueue.length) return this.emit('service.start.queue.finished');

    var _eventId = this._startQueue.shift();
    this.emit(_eventId);
  },
  finishStart: function() {
    if (!this._convertQueue.length) return this.CONVERT_STATUS = this.constructor.CONVERT_FINISHED;

    var _convertId = this._convertQueue.shift();
    this.emit(_convertId);
  }
};
