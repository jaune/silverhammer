const React = require('react');

const Home = React.createClass({
  render: function() {
    return (
      <div className="page--home">
        <header role="banner">Home header</header>
        <nav role="navigation">Home content</nav>
        <main role="main">
        </main>
        <footer role="contentinfo">Home footer</footer>
      </div>
    );
  }
});

module.exports = Home;