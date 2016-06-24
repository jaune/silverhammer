const React = require('react');

const CreateAccount = React.createClass({
  displayName: 'authorization/CreateAccount',
  render: function() {
    return (
      <div>
        <header role="banner">authorization_CreateAccount header</header>
        <nav role="navigation">authorization_CreateAccount navigation</nav>
        <main role="main">
          authorization_CreateAccount content
          <form method="POST" action="/account/">
            <input type="hidden" name="authorization_uuid" value={this.props.authorization.uuid}></input>
            <button type="submit">Create an Account !</button>
          </form>
        </main>
        <footer role="contentinfo">authorization_CreateAccount footer</footer>
      </div>
    );
  }
});

module.exports = CreateAccount;
