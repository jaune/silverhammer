const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  var account;

  try {
    account = state.account.accountMe;
  } catch (error) {
  }

  return {
    account: account
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

const PageAccountMeContent = React.createClass({
  render: function() {
    return (
      <pre>
        {JSON.stringify(this.props.account, null, 2)}
      </pre>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PageAccountMeContent);