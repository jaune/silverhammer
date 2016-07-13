const React = require('react');

const Page = require('../../components/Page.jsx');

const CreateAccount = React.createClass({
  displayName: 'authorization/AddToAccount',
  render: function() {
    return (
      <Page>
        <form method="POST" action="/account/@me/authorization/">
          <input type="hidden" name="authorization_uuid" value={this.props.authorization.uuid}></input>
          <button type="submit">Attach to Account !</button>
        </form>
      </Page>
    );
  }
});

module.exports = CreateAccount;
