'use strict';

module.exports = function(Converter) {
  Converter.defaultParams = {
    queue: 5,
    listener: false
  };
  Converter.SERVICE_STOP = 'SERVICE_STOP';
  Converter.SERVICE_STARTING = 'SERVICE_STARTING';
  Converter.SERVICE_STARTED = 'SERVICE_STARTED';
  Converter.CONVERT_STOP = 'CONVERT_STOP';
  Converter.CONVERT_RUNNING = 'CONVERT_RUNNING';
  Converter.CONVERT_FINISHED = 'CONVERT_FINISHED';
};
