const formatHTML = require('./array-format-html.js');

function renderRedirectPage (url) {
  var html = [
    '<!DOCTYPE HTML>',
    '<html lang="en-US">',
    [,
      '<head>',
      [
        '<meta charset="UTF-8">',
        '<meta http-equiv="refresh" content="1;url=' + url + '">',
        '<script type="text/javascript">window.location.href = "' + url + '";</script>',
        '<title>Page Redirection</title>'
      ],
      '</head>',
      '<body>',
      [
        'If you are not redirected automatically, follow the <a href="' + url + '">link</a>'
      ],
      '</body>'
    ],
    '</html>'
  ];

  return formatHTML(html);
}

module.exports = renderRedirectPage;
