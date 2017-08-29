// var converter = require('../index').createConverter({ listener: true });
var converter = require('../index').createConverter();
converter.generate(__dirname + '/test.docx', 'html').then(console.log).catch(console.error);
converter.generate(__dirname + '/test.docx', 'html', __dirname + '/preview').then(console.log).catch(console.error);
converter.generateHtml(__dirname + '/test.docx', __dirname + '/heiheihei.html').then(console.log).catch(console.error);

require('express')().set('view engine', 'html').get('/preview', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  var html = require('fs').readFileSync(__dirname + '/preview.html').toString('utf-8')
    // .replace(/text\-align: justify;/g,'');
  res.send(html + `
    <script type='text/javascript'>
      window.onload = function(){
        setAlign(document.body);
      }

      function setAlign(dom){
        if(!dom.childElementCount) return;

        var doms = dom.children;
        Array.prototype.forEach.call(doms, function(ele) {
          var align = ele.getAttribute('align');
          if(align) ele.style.textAlign = align;

          setAlign(ele);
        });
      }
    </script>
  `);
}).get('/frame', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  var html = `
  <html>
    <head>
      <meta charset='utf-8' />
      <style type='text/css'>
        body {
          background-color: #eee;
        }
        iframe {
          width: 8.27in;
          min-height: 11.69in;
          height: auto;
          margin: 50px auto;
          border: none;
          box-shadow: 0 0 15px 0 #777;
          display: block;
          background-color: white;
          box-sizing: border-box;
          padding: 20px 0;
        }
      </style>
    </head>
    <body>
      <iframe src='http://192.168.1.27:5555/preview'>
      </iframe>
    </body>
  </html>
  `;
  res.send(html);
}).listen(5555);
