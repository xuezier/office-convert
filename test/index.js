var converter = require('../index').createConverter();
converter.generate(__dirname + '/test.docx', 'html').then(console.log).catch(console.error);
converter.generateHtml(__dirname+'/test.docx',__dirname+'/heiheihei.html').then(console.log).catch(console.error);