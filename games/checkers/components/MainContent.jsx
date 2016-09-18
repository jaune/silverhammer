const React = require('react');
const THREE = require('three');

module.exports = React.createClass({
  displayName: 'games/checkers/MainContent',

  componentDidMount: function () {
    var w = 800, h = 600;

    var renderer = new THREE.WebGLRenderer({
      canvas: this.refs.canvas
    });
    renderer.setSize(w, h);


    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );


    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    renderer.render( scene, camera );
  },

  componentWillUnmount() {
  },

  render() {
    return (<canvas ref="canvas"></canvas>);
  }
});
