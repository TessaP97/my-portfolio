import './style.css'
import * as THREE from '../node_modules/three'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { SphereGeometry } from 'three'
import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'




// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Models
 */

let mixer = null


// PLANETS

// sun 
const sun = new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        sunTexture: {
            value: new THREE.TextureLoader().load('/Textures/8k_sun.jpeg')
        }
    }
}
))
sun.position.set(65,30,0)
scene.add(sun)


// mercury
const mercury = new SphereGeometry(3, 50, 50);
const mercuryMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_mercury.jpg'),
});
const mercuryMaterial = new THREE.Mesh(mercury, mercuryMesh);
scene.add(mercuryMaterial);
mercuryMaterial.position.set(30, 30, 0)

// venus
const venus = new SphereGeometry(4, 50, 50);
const venusMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_venus_surface.jpeg'),
});
const venusMaterial = new THREE.Mesh(venus, venusMesh);
scene.add(venusMaterial);
venusMaterial.position.set(12.5, 30, 0)

// moon
const moon = new SphereGeometry(0.6, 50, 50);
const moonMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_moon.jpeg'),
});
const moonMaterial = new THREE.Mesh(moon, moonMesh);
scene.add(moonMaterial);
moonMaterial.position.set(1, 35, -2)

// Earth 
const earth = new SphereGeometry(2, 50, 50);
const earthMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_earth_nightmap.jpeg'),
});
const earthMaterial = new THREE.Mesh(earth, earthMesh);
scene.add(earthMaterial);
earthMaterial.position.set(-5, 30, 0)

// mars
const mars = new SphereGeometry(3, 50, 50);
const marsMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_mars.jpeg'),
});
const marsMaterial = new THREE.Mesh(mars, marsMesh);
scene.add(marsMaterial);
marsMaterial.position.set(-20, 30, 0)

// jupiter
const jupiter = new SphereGeometry(7, 50, 50);
const jupiterMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_jupiter.jpeg'),
});
const jupiterMaterial = new THREE.Mesh(jupiter, jupiterMesh);
scene.add(jupiterMaterial);
jupiterMaterial.position.set(-40, 30, 0)

// saturn 
const saturn = new SphereGeometry(6, 50, 50);
const saturnMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/8k_saturn.jpeg'),
});
const saturnMaterial = new THREE.Mesh(saturn, saturnMesh);
scene.add(saturnMaterial);
saturnMaterial.position.set(-65, 30, 0)

// saturn rings
const rings = new THREE.RingGeometry(7, 10, 50, 50);
const ringsMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/saturn_ring.png'),
    side: THREE.DoubleSide,

});
const ringsMaterial = new THREE.Mesh(rings, ringsMesh);
scene.add(ringsMaterial);
ringsMaterial.position.set(-65, 30, 0)
ringsMaterial.rotateX(26)


// uranus
const uranus = new SphereGeometry(1, 50, 50);
const uranusMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/2k_uranus.jpeg'),
});
const uranusMaterial = new THREE.Mesh(uranus, uranusMesh);
scene.add(uranusMaterial);
uranusMaterial.position.set(-80, 30, 0)

// neptune
const neptune = new SphereGeometry(1, 50, 50);
const neptuneMesh = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/Textures/2k_neptune.jpeg'),
});
const neptuneMaterial = new THREE.Mesh(neptune, neptuneMesh);
scene.add(neptuneMaterial);
neptuneMaterial.position.set(-90, 30, 0)


// background

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffffff,
})

const starVertices = []
for ( let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread( 2500 );
	const y = THREE.MathUtils.randFloatSpread( 2600 );
	const z = THREE.MathUtils.randFloatSpread( 2800 );
    starVertices.push(x, y, z)
}

starGeometry.setAttribute('position',
new THREE.Float32BufferAttribute(starVertices, 3)
)

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)




/**
//  * Lights
//  */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01)
scene.add(ambientLight)

const sunLight = new THREE.SpotLight(0xffffff, 210)
sunLight.position.set(80, 35, 0);
sunLight.castShadow = true
scene.add(sunLight);


// --------------------------------- 3D MODELS ------------------------------------

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


gltfLoader.load(
    '/models/jwst_james_webb_space_telescope/scene.gltf',
    (webb) => {

        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])

        // action.play()

        webb.scene.scale.set(0.015, 0.015, 0.015)
        webb.scene.rotation.y = 1.24
        webb.scene.position.set(1.2, 38, -2)
        scene.add(webb.scene)

    }
)

gltfLoader.load(
    '/models/astronaut/scene.gltf',
    (spaceman) => {

        mixer = new THREE.AnimationMixer(spaceman.scene)
        const action = mixer.clipAction(spaceman.animations[3])

        action.play()


        spaceman.scene.scale.set(0.022, 0.022, 0.022)
        spaceman.scene.rotation.y = 0.6
        spaceman.scene.position.set(1.18, 35.57, -1.97)
        scene.add(spaceman.scene)
    }
)

gltfLoader.load(
    '/models/discovery_space_shuttle/scene.gltf',
    (shuttle) => {

        // mixer = new THREE.AnimationMixer(shuttle.scene)
        // const action = mixer.clipAction(shuttle.animations[2])

        // action.play()
        shuttle.scene.scale.set(0.028, 0.028, 0.028)
        shuttle.scene.rotation.y = 3.8
        shuttle.scene.position.set(1.18, 36, -2.5)
        scene.add(shuttle.scene)
    }
)

gltfLoader.load(
    '/models/blackhole/scene.gltf',
    (blackhole) => {

        // mixer = new THREE.AnimationMixer(blackhole.scene)
        // const action = mixer.clipAction(blackhole.animations[2])

        // action.play()
        mixer = new THREE.AnimationMixer( blackhole.scene );
        
        blackhole.animations.forEach( ( clip ) => {
        
        mixer.clipAction( clip ).play();
        
        } );

        blackhole.scene.scale.set(20, 20, 20)
        blackhole.scene.rotation.z = 60
        blackhole.scene.position.set(85, 40, -80)
        scene.add(blackhole.scene)
    }
)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300)
camera.position.set(-90, 50, 45)
scene.add(camera)

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'audio/Ambient_space.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.1 );
	sound.play();
});


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMappingExposure = 1.151
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap




/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call again on the next frame
    window.requestAnimationFrame(animate)

}

animate()



