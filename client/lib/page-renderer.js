const React = require('react');
const ReactDOMServer = require('react-dom/server');

const formatHTML = require('./array-format-html.js');

module.exports = function (bundleName, Page, props) {
  const PageFactory = React.createFactory(Page);

  var doc = [
    '<!DOCTYPE html>',
    '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="' + props.lang + '" lang="' + props.lang + '" dir="' + props.dir + '">',
    [
      '<head>',
      [
        '<title>' + props.title + '</title>',
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
        '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />',

        // alternate
        '<link rel="alternate" type="application/rss+xml" title="" href=""/>',
        '<link rel="alternate" type="application/atom+xml" title="" href=""/>',
        '<link rel="alternate" type="application/epub+zip" title="" href=""/>',

        '<link rel="alternate" hreflang="en" href="" />',

        // SEO
        '<meta name="description" content=""/>',
        '<link rel="canonical" href=""/>',
        '<meta name="robots" content="noodp"/>',

        // https://support.google.com/webmasters/answer/1663744?hl=en
        '<link rel="prev" href=""/>',
        '<link rel="next" href=""/>',

        // https://www.w3.org/TR/appmanifest/
        '<link rel="manifest" href="">',

        // Google+
        '<link rel="publisher" href=""/>',

        // twitter
        '<meta name="twitter:site" content="" />',
        '<meta name="twitter:domain" content="" />',
        '<meta name="twitter:description" content=""/>',
        '<meta name="twitter:title" content=""/>',
        '<meta name="twitter:card" content="summary"/>',

        // facebook
        '<meta name="fb:app_id" property="fb:app_id" content="" />',
        '<meta name="fb:page_id" property="fb:app_id" content="" />',

        '<meta property="article:publisher" content="" />',
        '<meta property="article:author" content="" />',

        // http://ogp.me/
        '<meta property="og:site_name" content="" />',
        '<meta property="og:url" content="" />',
        '<meta property="og:title" content="" />',
        '<meta property="og:type" content="article" />',
        '<meta property="og:locale" content="fr_FR" />',
        '<meta property="og:description" content="" />',
        '<meta property="og:image" content="" />',

        '<style type="text/css"></style>', // inline css
        '<link type="text/css" rel="stylesheet" media="all" href="" />', // external css

        '<link type="text/css" rel="stylesheet" media="all" href="/' + bundleName + '.bundle.css" />',

        '<script type="text/javascript"></script>', // inline script
        '<script type="text/javascript" src=""></script>', // external script
        '<script type="text/javascript" src="" async defer></script>', // external async script

        '<script type="text/javascript" src="/' + bundleName + '.bundle.js" async defer></script>'
      ],
      '</head>',
       '<body>',
       [

        '<div data-page-root>' + ReactDOMServer.renderToString(PageFactory(props)) + '</div>',
        '<script type="application/json" data-page-props>' + JSON.stringify(props) + '</script>',

        '<script type="text/javascript"></script>', // inline script
        '<script type="text/javascript" src=""></script>', // external script
        '<script type="text/javascript" src="" async defer></script>' // external async script
       ],
       '</body>'
    ],
    '</html>'
  ];

  return formatHTML(doc);
};