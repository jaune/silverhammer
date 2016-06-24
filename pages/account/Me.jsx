const React = require('react');

module.exports = React.createClass({
  displayName: 'account/Me',
  render: function() {
    return (
      <div>
        <header role="banner">account/Me header</header>
        <nav role="navigation">account/Me navigation</nav>
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
