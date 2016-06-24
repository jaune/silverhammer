const React = require('react');

const Passports = require('../containers/Passports.jsx');

const Authorize = React.createClass({
  render: function() {
    return (
      <div className="page--authorize">
        <header role="banner">Authorize header</header>
        <nav role="navigation">Authorize content</nav>
        <main role="main">
          <Passports />
        </main>
        <footer role="contentinfo">Authorize footer</footer>
      </div>
    );
  }
});

module.exports = Authorize;