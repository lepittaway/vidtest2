var renderer;

var controls, camera, scene;

var geometry, material, screenOne;

var video, url, videoTexture;
var canPlayMp4, canPlayOgg;
var lastTimeMsec, deltaMsec; 


var mouse = new THREE.Vector2(), INTERSECTED;
var raycaster;

var updateFcts	= [];


init();
animate();

function init() {

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor(new THREE.Color('lightgrey'), 1);
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

scene	= new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000 );

controls = new THREE.OrbitControls( camera );

window.addEventListener( 'resize', onWindowResize, false );

raycaster = new THREE.Raycaster();

/*-----------------------------------------------------------------------------*/

/* play controls */
canPlayMp4 = document.createElement('video').canPlayType('video/mp4') !== '' ? true : false;
canPlayOgg	= document.createElement('video').canPlayType('video/ogg') !== '' ? true : false;
if( canPlayMp4 ){
  url	= "https://threejs.org/examples/textures/sintel.mp4"
} else if( canPlayOgg ){
  url	= "https://threejs.org/examples/textures/sintel.ogv"
} else alert('cant play mp4 or ogv');


/*-----------------------------------------------------------------------------*/


/* camera */  
camera.position.z = 3;

/* make video texture */
video = document.getElementById( 'video' );
//enableInlineVideo(video);
video.play()
videoTexture = new THREE.VideoTexture( video );
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

/* make screen */
var geometry = new THREE.CubeGeometry(2,1.1,0.01);
var material = new THREE.MeshBasicMaterial( { map: videoTexture } );
var screenOne = new THREE.Mesh( geometry, material );
screenOne.rotation.x = -0.3;  
screenOne.rotation.y = 0.5; 
scene.add( screenOne );

} 
function animate() {

requestAnimationFrame( animate );
console.log(video.currentTime);

//time-based notification
/*if (video.currentTime > 1){
}*/

updateFcts.push(function(delta, now){ videoTexture.update(delta, now)});

  
/* loop runner */
lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec-1000/60
   deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec
  // call each update function
  updateFcts.forEach(function(updateFn){
      updateFn(deltaMsec/1000, nowMsec/1000)
  })
});

  
renderer.render( scene, camera );

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
/* button commands */
/*function onVideoPlayButtonClick(){ 
  video.play() 
}
function onVideoPauseButtonClick(){
  video.pause()
}*/