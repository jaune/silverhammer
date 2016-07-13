const React = require('react');

const Page = require('../components/Page.jsx');

const Lobby = require('../containers/lobby/Lobby.jsx');

var Home = React.createClass({
  render: function() {
    return (
      <Page>
        <Lobby />
      </Page>
    );
  }
});

Home.STYLE = true;

module.exports = Home;