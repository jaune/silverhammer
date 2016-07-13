const React = require('react');
const ReactRedux = require('react-redux');
const ReactDOMServer = require('react-dom/server');

const formatHTML = require('./array-format-html.js');

module.exports = function (PageComponent, store, router) {
  router = router || {};

  const Page = React.createFactory(PageComponent);
  const Root = React.createFactory(require('./Root.jsx'));
  const state = store.getState();

  var languageParts = state.i18n.language.split('-'); // fr-FR https://www.w3.org/International/articles/language-tags/

  var xmlLang = languageParts[0]; // xml:lang
  var ogLocale = languageParts.join('_'); // og:locale

  var style;

  if (!!PageComponent.STYLE) {
    style = '<link type="text/css" rel="stylesheet" media="all" href="/' + PageComponent.displayName + '.chunk.css" />';
  }

  var doc = [
    '<!DOCTYPE html>',
    '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="' + xmlLang + '" lang="' + xmlLang + '" dir="' + state.i18n.dir + '">',
    [
      '<head>',
      [
        '<title>' + state.page.title + '</title>',
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
        '<meta property="og:locale" content="' + ogLocale + '" />',
        '<meta property="og:description" content="" />',
        '<meta property="og:image" content="" />',

        '<style type="text/css"></style>', // inline css
        style
      ],
      '</head>',
       '<body>',
       [
        '<div data-page-root>' + ReactDOMServer.renderToString(Root({ store: store, router: router }, Page())) + '</div>',
        '<script type="application/json" data-page-state>' + JSON.stringify(state) + '</script>',
        '<script type="application/json" data-router-settings>' + JSON.stringify(router.getSettings()) + '</script>',

        '<script type="text/javascript" src="/commons.chunk.js"></script>',
        '<script type="text/javascript" src="/' + PageComponent.displayName + '.chunk.js" async></script>'
       ],
       '</body>'
    ],
    '</html>'
  ];

  return formatHTML(doc);
};