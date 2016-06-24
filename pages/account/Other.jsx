const React = require('react');

module.exports = React.createClass({
  displayName: 'account/Other',
  render: function() {
    return (
      <div>
        <header role="banner">account/Other header</header>
        <nav role="navigation">account/Other navigation</nav>
        <main role="main">
          <pre>
            {JSON.stringify(this.props.account, null, 2)}
          </pre>
        </main>
        <footer role="contentinfo">authorization_CreateAccount footer</footer>
      </div>
    );
  }
});
