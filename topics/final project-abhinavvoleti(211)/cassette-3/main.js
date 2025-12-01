// main.js
(() => {
  // Basic Three.js setup
  const canvas = document.getElementById('bg');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000011, 0.0006); // fog density

  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 5000);
  camera.position.set(0, 30, 220);

  // lights
  const hemi = new THREE.HemisphereLight(0xa0c6ff, 0x080820, 0.9);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(-100, 200, 100);
  scene.add(dir);

  // create a grouped field of boxes
  const group = new THREE.Group();
  scene.add(group);

  // Box geometry + material variations
  const boxGeom = new THREE.BoxGeometry(1,1,1);
  const mat1 = new THREE.MeshStandardMaterial({ color: 0x5688ff, metalness: 0.2, roughness: 0.6 });
  const mat2 = new THREE.MeshStandardMaterial({ color: 0x8fb6ff, metalness: 0.1, roughness: 0.55 });
  const mats = [mat1, mat2];

  const seedCount = 420; // number of blocks
  const items = [];

  for (let i=0; i<seedCount; i++){
    const m = mats[i%2].clone();
    // slight hue shift per item:
    m.color = m.color.clone().offsetHSL((Math.random()-0.5)*0.08, 0.02, (Math.random()-0.5)*0.06);
    const box = new THREE.Mesh(boxGeom, m);

    // random positions in a wide volume in front of camera
    box.position.x = (Math.random() - 0.5) * 600;
    box.position.y = (Math.random() * 120) - 60;   // spread vertically
    box.position.z = (Math.random() - 0.5) * 1000; // deep field
    // random non-uniform scale to mimic larger blocks
    const sx = 2 + Math.random()*12;
    const sy = 2 + Math.random()*12;
    const sz = 2 + Math.random()*12;
    box.scale.set(sx, sy, sz);

    box.rotation.x = Math.random()*Math.PI;
    box.rotation.y = Math.random()*Math.PI;

    group.add(box);
    items.push({ mesh: box, speed: 0.08 + Math.random()*0.4, rotSpeed: 0.002 + Math.random()*0.01 });
  }

  // subtle ground plane reflection (very faint)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(4000, 4000),
    new THREE.MeshBasicMaterial({ color: 0x02030b, side: THREE.DoubleSide, opacity: 0.0, transparent: true })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -300;
  scene.add(ground);

  // camera animation timeline state
  const startTime = performance.now();
  const timeline = {
    flyDuration: 8000,   // ms camera flythrough time
    settleDelay: 2000,   // ms until logo reveal after fly
    doneLogo: false
  };

  // audio
  const audioEl = document.getElementById('ps2audio');
  let audioStarted = false;

  // helper easing
  function easeOutQuad(t){ return 1 - (1-t)*(1-t); }
  function easeInOutSine(t){ return -(Math.cos(Math.PI*t)-1)/2; }

  // animation loop
  let last = performance.now();
  function animate(now){
    const dt = (now - last) * 0.001;
    last = now;
    const elapsed = now - startTime;

    // update each block: translate slightly toward camera (z increases), rotate
    for (let i=0;i<items.length;i++){
      const it = items[i];
      it.mesh.position.z += it.speed * 30 * dt; // move forward
      it.mesh.rotation.x += it.rotSpeed * 6 * dt;
      it.mesh.rotation.y += it.rotSpeed * 8 * dt;

      // a gentle bob up/down
      it.mesh.position.y += Math.sin((now*0.0002 + i) * 0.7) * 0.02;
    }

    // camera flythrough logic: we move the camera forward slightly, and rotate yaw a bit
    const t = Math.min(1, elapsed / timeline.flyDuration);
    const et = easeInOutSine(t);

    // path: start at z=220 -> go through -200 then ease to -40 (like flying into the field)
    const startZ = 220, midZ = -120, endZ = 40;
    camera.position.z = THREE.MathUtils.lerp(startZ, midZ, et) + (1-et)*40;
    camera.position.x = Math.sin(elapsed*0.0003)*60 * (1-et); // small lateral drift
    camera.position.y = THREE.MathUtils.lerp(30, 12, et);

    // gentle lookAt toward center of group with slight upward tilt
    const target = new THREE.Vector3(0, 12, 0);
    camera.lookAt(target);

    // some global rotation of group for variety
    group.rotation.y += 0.0005 + 0.0008 * dt;

    renderer.render(scene, camera);

    // start audio at beginning of animation on first render if possible
    if (!audioStarted) {
      tryPlayAudio();
    }

    // after timeline finishes, reveal logo overlay
    if (!timeline.doneLogo && elapsed > (timeline.flyDuration + timeline.settleDelay)) {
      timeline.doneLogo = true;
      revealLogo();
    }

    requestAnimationFrame(animate);
  }

  // attempt to play audio (many browsers require a user gesture)
  function tryPlayAudio() {
    if (!audioEl) return;
    // try to play; if blocked we will attach user gesture
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.then(()=> {
        audioStarted = true;
      }).catch(()=> {
        // blocked — wait for user gesture
        audioStarted = false;
        window.addEventListener('click', userStartAudioOnce, { once: true, passive: true });
        window.addEventListener('touchstart', userStartAudioOnce, { once: true, passive: true });
      });
    }
  }

  function userStartAudioOnce() {
    if (!audioEl) return;
    audioEl.volume = 0.35;
    audioEl.play().catch(()=>{});
    audioStarted = true;
  }

  // reveal overlay logo with a fade and tiny pop
  function revealLogo() {
    const overlay = document.getElementById('logoOverlay');
    overlay.classList.add('visible');

    // subtle scale-in using CSS transform via JS
    const logoText = document.getElementById('logoText');
    logoText.style.transition = 'transform 900ms cubic-bezier(.2,.9,.3,1), opacity 500ms';
    logoText.style.transform = 'scale(1)';
    // optional: make a last subtle camera nudge
    new Ticker(800, (p) => {
      camera.zoom = 1 + 0.02 * p;
      camera.updateProjectionMatrix();
    });
  }

  // a tiny helper ticker for post-animation nudge (not required)
  function Ticker(duration, onframe) {
    const t0 = performance.now();
    (function tick() {
      const now = performance.now();
      let p = (now - t0) / duration;
      if (p >= 1) p = 1;
      onframe(p);
      if (p < 1) requestAnimationFrame(tick);
    })();
  }

  // handle resize
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }, { passive: true });

  // start loop
  requestAnimationFrame(animate);

  // small finishing tweaks: set audio volume and start if user already interacted
  if (audioEl) {
    audioEl.volume = 0.35;
  }

})();
