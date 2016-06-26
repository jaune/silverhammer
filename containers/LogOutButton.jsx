const React = require('react');
const ReactRedux = require('react-redux');

function mapStateToProps (state, ownProps) {
  var accountLabel;

  try {
    accountLabel = state.session.account.label
  } catch (error) {
  }

  return {
    accountLabel: accountLabel
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    onClick: function () {
      dispatch( require('../actions/session.js').logOut() );
    }
  };
}

const LogOutButton = React.createClass({
  propTypes: {
    accountLabel: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },
  render: function() {
    var content;

    if (this.props.accountLabel) {
      return (
        <div>
          <a href="/account/@me.html">{this.props.accountLabel}</a>
          <button onClick={this.props.onClick}>Log Out !</button>
        </div>
      );
    }

    return (
      <div><a href="/authorize.html">Connect !</a></div>
    );
  }
});

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogOutButton);