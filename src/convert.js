'use strict';
var childProcess = require('child_process');
var eventEmitter = require('events');

var convertFun = require('./convert-fun');
var convertEvent = require('./convert-event');
var _ = require('../lib/utils');

/**
 * Convert office file to other type
 *
 * @class Converter
 * @extends {eventEmitter}
 */
class Converter extends eventEmitter {
  /**
   * Creates an instance of Converter.
   * @param {{}} params
   * @param {Number} params.queue
   * @param {Boolean} params.auto
   * @memberof Converter
   */
  constructor(params) {
    super();

    this.config = Object.assign(Converter.defaultParams, params || {});
    this.SERVICE_STATUS = Converter.SERVICE_STOP;
    this.CONVERT_STATUS = Converter.CONVERT_STOP;

    this._convertQueue = [];
    this._convertId = 0;
    this._startQueue = [];

    if (this.config.listener) this.listen();

    this.on('convert.finish', convertEvent.finish.bind(this));
    this.on('convert.running', convertEvent.running.bind(this));
    this.on('convert.stop', convertEvent.stop.bind(this));
    this.on('service.started', convertEvent.serviceStart.bind(this));
    this.on('service.start.queue.finished', convertEvent.finishStart.bind(this));
  }

  /**
   * start unoconv service
   *
   * @param {Number|String} port
   * @memberof Converter
   */
  listen() {
    var self = this;
    this.config.listener = true;
    if (this.SERVICE_STATUS !== Converter.SERVICE_STOP) return;

    if (this._convertId) throw new Error('listen event must be called before generate convert file');

    this.SERVICE_STATUS = Converter.SERVICE_STARTING;

    var bin = 'unoconv',
      args = ['--listener'];
    childProcess.exec(bin + ' ' + args.join(' '));

    var _timer = setInterval(function() {
      var child = childProcess.spawnSync('lsof', ['-i', 'tcp:2002']);
      var stdout = child.stdout.toString();
      if (stdout) {
        console.log(stdout);
        self.SERVICE_STATUS = Converter.SERVICE_STARTED;
        self.emit('service.started');
        clearInterval(_timer);
      }
    });
  }

  /**
   * convert file to typed file
   *
   * @param {String} filePath the path string of file
   * @param {String} outputType  convert output file type, e.g doc,docx,xls,xlsx,ppt,pptx,pdf,html
   * @param {String} outputName  set convert output file name
   * @param {Function} callback       run after convert file
   * @returns {Promise}
   * @memberof Converter
   */
  generate(filePath, outputType, outputName, callback) {
    var self = this;
    var args = arguments;

    if (this.config.listener && (this.SERVICE_STATUS !== Converter.SERVICE_STARTED)) {
      if (this.SERVICE_STATUS === Converter.SERVICE_STOP) return Promise.reject(new Error('please start unoconv first'));

      else if (this.SERVICE_STATUS === Converter.SERVICE_STARTING) {
        var _eventId = `_startedbefore${this._startQueue.length}`;
        this._startQueue.push(_eventId);
        return new Promise(function(resolve, reject) {
          self.on(_eventId, function() {
            convertFun._generate.apply(this, args).then(result => {
              resolve(result);
              self.emit('service.started');
            }).catch(e => {
              reject(e);
              self.emit('service.started');
            });
          });
        });
      }
    } else {
      if (this.CONVERT_STATUS === Converter.CONVERT_STOP || this.CONVERT_STATUS === Converter.CONVERT_FINISHED)
        return this._generate.apply(this, arguments);
      else {
        var _convertId = `_convert${this._convertId++}`;
        this._convertQueue.push(_convertId);
        return new Promise(function(resolve, reject) {
          self.on(_convertId, function() {
            self._generate.apply(self, args).then(resolve).catch(reject);
          });
        });
      }
    }
  }

  _generate() {
    var self = this,
      args = arguments;
    this.CONVERT_STATUS = Converter.CONVERT_RUNNING;
    return new Promise(function(resolve, reject) {
      convertFun._generate.apply(null, args).then(function(result) {
        self.emit('convert.finish');
        resolve(result);
      }).catch(reject);
    });
  }

  generatefromstream(){

  }

  /**
   * convert file to html file
   *
   * @param {String} filePath
   * @param {String|Null} outputName
   * @param {Function|Null} callback
   * @returns {Promise}
   * @memberof Converter
   */
  generateHtml(filePath, outputName, callback) {
    return this.generate.apply(this, Array.prototype.insert.call(arguments, 'html', 1));
  }

  /**
   * convert file to doc file
   *
   * @param {String} filePath
   * @param {String|Null} outputName
   * @param {Function|Null} callback
   * @returns {Promise}
   * @memberof Converter
   */
  generateDoc(filePath, outputName, callback) {
    return this.generate.apply(this, Array.prototype.insert.call(arguments, 'doc', 1));
  }

  /**
   * convert file to docx file
   *
   * @param {String} filePath
   * @param {String|Null} outputName
   * @param {Function|Null} callback
   * @returns {Promise}
   * @memberof Converter
   */
  generateDocx(filePath, outputName, callback) {
    return this.generate.apply(this, Array.prototype.insert.call(arguments, 'docx', 1));
  }

  /**
   * convert file to pdf file
   *
   * @param {String} filePath
   * @param {String|Null} outputName
   * @param {Function|Null} callback
   * @returns {Promise}
   * @memberof Converter
   */
  generatePdf(filePath, outputName, callback) {
    return this.generate.apply(this, Array.prototype.insert.call(arguments, 'pdf', 1));
  }
}

require('./converter-status')(Converter);

var converter = null;
/**
 * create converter
 *
 * @param {{}|Undefined} params
 * @returns {Converter}
 */
function createConverter(params) {
  if (!converter)
    converter = new Converter(params);
  return converter;
}

module.exports = createConverter;
