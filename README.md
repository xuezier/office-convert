# OFFICE-CONVERTER
[![NPM version][npm-image]][npm-url]

use this module, you should confirm LibreOffice and Unoconv installed in your machine.

## install LibreOffice
* <strong>on OS X<strong> down dmg file from [link](https://downloadarchive.documentfoundation.org/libreoffice/old/4.2.5.2/mac/x86_64/LibreOffice_4.2.5.2_MacOS_x86-64.dmg)
* <strong>CentOS / RedHat<strong>

   CentOS and RedHat 7.2 自带 OpenOffice 4.3，如果想获得更好的体验，建议更换成LibreOffice，首先要卸载OpenOffice
   ```bash
   yum remove openoffice* libreoffice*
   ```
   从 RPM packages 安装LibreOffice
   ```bash
   wget http://download.documentfoundation.org/libreoffice/stable/5.2.5/rpm/x86_64/LibreOffice_5.2.5_Linux_x86-64_rpm.tar.gz

   tar -xvf LibreOffice_5.2.5_Linux_x86-64_rpm.tar.gz

   cd LibreOffice_5.2.5.x_Linux_x86-64_rpm/RPMS/

   yum localinstall *.rpm

   libreoffice5.2
   ```


## install unoconv
* <strong>on OS X<strong>

   通过 Homebrew 安装
   ```bash
   brew install unoconv
   brew install ghostscript
   ```

* <strong>CentOS / RedHat<strong>

   从 github 下载程序包
   ```bash
   git clone https://github.com/dagwieers/unoconv.git

   # copy
   cp unoconv/unoconv /usr/bin
   # or link unoconv to /usr/bin
   ln -s unoconv/unoconv /usr/bin/unoconv
   ```

## warning
unoconv start need use port 2002, so if want register unoconv as a service, should check port usage first.

## Usage
```js
var converter = require('office-convert').createConveter();
converter.generate(originFilePath, outputFileType, ouputFilePath).then(console.log).catch(console.error);
```
*if use this module to converting documents, you can start a unoconv listener first*
```js
var converter = require('office-convert').createConveter({listener: true});
```
or
```js
var converter = require('office-convert').createConveter();
converter.listen();
```

[npm-image]: https://img.shields.io/npm/v/office-convert.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/office-convert