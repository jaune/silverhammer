const React = require('react');

const Page = require('../components/Page.jsx');

var Home = React.createClass({
  render: function() {
    return (
      <Page>
        <div>content 1</div>
        <div>content 2</div>
      </Page>
    );
  }
});

module.exports = Home;