module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    eslint: {
      target: [
        './actions',
        './components',
        './containers',
        './lib',
        './pages',
        './reducers',
        './routes',
        './services',
        './*.js',
      ],
      options: {
      }
    }
  });


  grunt.registerTask('default', ['eslint']);

};