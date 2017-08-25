'use strict';
var childProcess = require('child_process');
var _ = require('../lib/utils');

var _enbleConvertToFileType = ['doc', 'docx', 'pdf', 'html', 'htm', 'xls', 'xlsx', 'ppt', 'pptx'];

module.exports = {
  /**
   * _generate convert file
   *
   * @param {String} fileName
   * @param {String} outputType
   * @param {String|Function} outputName
   * @param {Function|Null} callback
   * @returns {Promise}
   */
  _generate(fileName, outputType, outputName, callback) {
    if (_.typeof(outputName) !== 'string') {
      callback = outputName;
      var nameTmp = fileName.split('.');
      nameTmp.pop();
      outputName = `${nameTmp.join('')}.${outputType}`;
    }

    if (_.typeof(callback) !== 'function') {
      callback = null;
    }

    return new Promise(function(resolve, reject) {
      if (!~_enbleConvertToFileType.indexOf(outputType)) {
        var typeError = new Error(`outputType: ${outputType} not a support convert type`);
        callback && callback(typeError);
        return reject(typeError);
      }
      var bin = 'unoconv',
        args = ['-f', outputType, '-o', outputName, fileName];
      var child = childProcess.spawn(bin, args);

      var stdout = '',
        stderr = '';
      child.stdout.on('data', function(chunk) {
        stdout += chunk;
      });
      child.stderr.on('data', function(chunk) {
        stderr += chunk;
      });

      child.on('exit', function() {
        var error = null;
        if (stderr) {
          error = new Error(stderr);
          callback && callback(error);
          return reject(error);
        }

        console.log(stdout);

        var result = {
          status: 0,
          outputFile: outputName
        };
        callback && callback(null, result);
        resolve(result);
      });
    });
  }
};
