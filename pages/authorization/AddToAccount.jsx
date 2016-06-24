const React = require('react');

const CreateAccount = React.createClass({
  displayName: 'authorization/AddToAccount',
  render: function() {
    return (
      <div>
        <header role="banner">authorization_AddToAccount header</header>
        <nav role="navigation">authorization_AddToAccount navigation</nav>
        <main role="main">
          <form method="POST" action="/account/@me/authorization/">
            <input type="hidden" name="authorization_uuid" value={this.props.authorization.uuid}></input>
            <button type="submit">Attach to Account !</button>
          </form>
        </main>
        <footer role="contentinfo">authorization_AddToAccount footer</footer>
      </div>
    );
  }
});

module.exports = CreateAccount;
