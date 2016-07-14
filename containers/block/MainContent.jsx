const React = require('react');
const ReactRedux = require('react-redux');

module.exports = React.createClass({
  displayName: 'block/MainContent',

  render: function() {
    var Content,
        content;

    switch (this.props.route) {
      case '/lobby/:lobby_uuid.html':
        Content = require('../lobby/Lobby.jsx');
        break;
      case '/authorize.html':
        Content = require('../Passports.jsx');
        break;
      case '/authorization/:authorization_uuid/form/add-authorization-to-account.html':
        Content = require('../authorization/form/AddToAccount.jsx');
        break;
      case '/authorization/:authorization_uuid/form/create-account.html':
        Content = require('../authorization/form/CreateAccount.jsx');
        break;
      case '/account/@me.html':
        Content = require('../PageAccountMeContent.jsx');
        break;
      case '/account/:account_uuid.html':
        Content = require('../PageAccountOtherContent.jsx');
        break;
      default:
        content = (<div>Not Found</div>);
    }

    if (Content) {
      content = (<Content />);
    }

    return React.Children.only(content);
  }
});

function mapStateToProps (state, ownProps) {
  return {
    route: state.router.pattern
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {};
}

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(module.exports);