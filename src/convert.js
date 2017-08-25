'use strict';
var childProcess = require('child_process');
var eventEmitter = require('events');

var convertFun = require('./convert-fun');
var _ = require('../lib/utils');
require('../lib/expand');

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

    this.queueMap = new Map();
    this.startQueue = [];

    if (this.config.auto) this.listen();
  }

  /**
   * start unoconv service
   *
   * @param {Number|String} port
   * @memberof Converter
   */
  listen() {
    var self = this;
    if (this.SERVICE_STATUS !== Converter.SERVICE_STOP) return;

    this.SERVICE_STATUS = Converter.SERVICE_STARTING;
    this.on('service.started', this._onServiceStarted.bind(this));

    var bin = 'unoconv',
      args = ['--listener'];
    childProcess.exec(bin + ' ' + args.join(' '));

    var _timer = setInterval(function() {
      var child = childProcess.spawnSync('lsof', ['-i', 'tcp:2002']);
      var stdout=child.stdout.toString();
      if (stdout) {
        console.log(stdout);
        self.SERVICE_STATUS = Converter.SERVICE_STARTED;
        self.emit('service.started');
        clearInterval(_timer);
      }
    });
  }

  _onServiceStarted() {
    if (!this.startQueue.length) return;

    var _eventId = this.startQueue.shift();
    console.log(_eventId);
    this.emit(_eventId);
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
    if (this.SERVICE_STATUS === Converter.SERVICE_STOP) return Promise.reject(new Error('please start unoconv first'));

    else if (this.SERVICE_STATUS === Converter.SERVICE_STARTING) {
      var _eventId = `_startedbefore${this.startQueue.length}`;
      this.startQueue.push(_eventId);
      var self = this;
      var args = arguments;
      return new Promise(function(resolve, reject) {
        self.on(_eventId, function() {
          convertFun._generate.apply(null, args).then(result => {
            resolve(result);
            self.emit('service.started');
          }).catch(e => {
            reject(e);
            self.emit('service.started');
          });
        });
      });
    } else {
      return convertFun._generate.apply(null, arguments);
    }
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

Converter.defaultParams = {
  queue: 5,
  auto: true
};
Converter.SERVICE_STOP = 'stop';
Converter.SERVICE_STARTING = 'starting';
Converter.SERVICE_STARTED = 'started';

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
