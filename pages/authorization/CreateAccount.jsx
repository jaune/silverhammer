const React = require('react');

const Page = require('../../components/Page.jsx');
const Form = require('../../containers/authorization/CreateAccountForm.jsx');

const CreateAccount = React.createClass({
  displayName: 'authorization/CreateAccount',
  render: function() {
    // <input type="hidden" name="authorization_uuid" value={this.props.authorization.uuid}></input>
    return (
      <Page>
        <Form></Form>
      </Page>
    );
  }
});

module.exports = CreateAccount;
