const React = require('react');

const LogOutButton = require('../containers/LogOutButton.jsx');

const Home = React.createClass({
  render: function() {
    return (
      <div className="page--home">
        <header role="banner">
          <LogOutButton />
        </header>
        <nav role="navigation">Home content</nav>
        <main role="main">
        </main>
        <footer role="contentinfo">Home footer</footer>
      </div>
    );
  }
});

module.exports = Home;