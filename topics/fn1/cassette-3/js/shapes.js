const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 10,35);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const rendererer = new THREE.WebGLRenderer({antialias: true});
rendererer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(rendererer.domElement);

const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size:0.05,
    transparent: true,
    opacity: 1
    });

const starVertices = [];
for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

const geometry = new THREE.PlaneGeometry(60,30,85,75);
const material = new THREE.MeshBasicMaterial({ 
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
});

const silk = new THREE.Mesh(geometry, material);
scene.add(silk);

silk.rotation.x = -Math.PI / 2.5;
camera.position.set (0, 6,18);
camera.lookAt(0,0,0);

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.0006;

    
    const range = 10; 
    const eyeX = mouseX * range;
    const eyeY = mouseY * range;
    const eyeZ = 18;

    camera.position.set(eyeX, eyeY + 2, eyeZ);
    camera.lookAt(0, 0, 0);

    const pos = geometry.attributes.position;
    const hue = (time * 0.08) % 1;
    material.color.setHSL(hue, 0.8, 0.5);

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x * 0.3 + time) * Math.cos(y * 0.3 + time) * 1.5;
        pos.setZ(i, z);
    }

    pos.needsUpdate = true;

    stars.rotation.y += 0.0002;
    starsMaterial.opacity = 0.5 + Math.sin(time) * 0.3;

    silk.rotation.z += 0.005;

    rendererer.render(scene, camera);
}

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

animate();
