const React = require('react');

const Page = require('../../components/Page.jsx');

const PageAccountMeContent = require('../../containers/PageAccountMeContent.jsx');

module.exports = React.createClass({
  displayName: 'account/Me',
  render: function() {
    return (
      <Page>
        <PageAccountMeContent />
      </Page>
    );
  }
});
