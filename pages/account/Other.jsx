const React = require('react');

const Page = require('../../components/Page.jsx');

const PageAccountMeContent = require('../../containers/PageAccountOtherContent.jsx');

module.exports = React.createClass({
  displayName: 'account/Other',
  render: function() {
    return (
      <Page>
        <PageAccountOtherContent />
      </Page>
    );
  }
});
