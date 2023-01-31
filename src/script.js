import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Plane } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(35,35)
grassAmbientOcclusionTexture.repeat.set(35,35)
grassNormalTexture.repeat.set(35,35)
grassRoughnessTexture.repeat.set(35,35)
grassColorTexture.wrapS = true
grassColorTexture.wrapT = true
grassAmbientOcclusionTexture.wrapS = true
grassAmbientOcclusionTexture.wrapT = true
grassNormalTexture.wrapS = true
grassNormalTexture.wrapT = true
grassRoughnessTexture.wrapS = true
grassRoughnessTexture.wrapT = true

/**
 * House
 */
const House = new THREE.Group()
scene.add(House)


// Temporary sphere

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(5,5,5),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap : bricksAmbientOcclusionTexture,
        normalMap : bricksNormalTexture,
        roughnessMap : bricksRoughnessTexture
    })
)

walls.castShadow = true

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))

walls.position.y = 5/2
House.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(5, 2, 4),
    new THREE.MeshStandardMaterial({
        color : '#b35f45'
    })
)


roof.position.y = 5 + 2/2
roof.rotation.y = Math.PI/4
House.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

door.position.y = 1
door.position.z = 2.5 + 0.01
House.add(door)


// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2+ 0.6)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1+ 0.5)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2+ 0.4)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6+ 0.6)

House.add(bush1, bush2, bush3, bush4)


const tombe = new THREE.Group()
scene.add(tombe)

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

const tombeGEO = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const tombeMAT = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 300; i++){

    const cercle = Math.random() * Math.PI * 2
    const radien = 6 + Math.random() * 30
    const X = Math.cos(cercle) * radien
    const Z = Math.sin(cercle) * radien

    const TombeFOR = new THREE.Mesh(tombeGEO, tombeMAT)

    tombe.add(
        TombeFOR
    )

    TombeFOR.rotation.y = Math.random() - 0.5
    TombeFOR.position.set(X,0.8/2,Z)
    TombeFOR.castShadow = true

}




// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

floor.receiveShadow = true

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const HouseLIGHT = new THREE.PointLight('#ff7d46',1,7)
HouseLIGHT.position.set(0.145,4.6,3.2)
House.add(HouseLIGHT)


HouseLIGHT.castShadow = true
moonLight.castShadow = true


gui.add(HouseLIGHT.position, 'x').min(0).max(5).step(0.001)
gui.add(HouseLIGHT.position, 'y').min(0).max(5).step(0.001)
gui.add(HouseLIGHT.position, 'z').min(0).max(5).step(0.001)

/**
 * Sizes
 */
const fog = new THREE.Fog('#262837', 1, 25)
scene.fog = fog



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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)





ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true








const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.setClearColor('#262837')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    ghost1.position.x = Math.cos(elapsedTime*0.3)*5
    ghost1.position.z = Math.sin(elapsedTime*0.3)*5


    ghost2.position.x = Math.sin(elapsedTime*0.2)*18
    ghost2.position.z = Math.cos(elapsedTime*0.2)*18

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()