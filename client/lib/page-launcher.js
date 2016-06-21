const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function (Page) {
  var container = document.querySelector('[data-page-root]');
  var props = JSON.parse(document.querySelector('[data-page-props]').textContent);

  ReactDOM.render(React.createElement(Page, props), container);
};