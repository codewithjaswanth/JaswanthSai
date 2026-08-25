/**
 * JASWANTH SAI - PERSONAL PORTFOLIO WEBSITE JS
 * Liquid Glass & Space Theme
 * Fully responsive, high-performance optimized interactive features.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. PRELOADER & PAGE ENTRY
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      document.body.style.overflow = 'visible';
    }, 1800);
  }

  // ==========================================
  // 2. DUAL CUSTOM CURSOR (Hardware-accelerated)
  // ==========================================
  const cursorRing = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorTextContainer = document.getElementById('cursor-text-container');
  const cursorText = document.getElementById('cursor-text');

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && cursorRing && cursorDot) {
    let mouse = { x: -100, y: -100 };
    let ring = { x: -100, y: -100 };
    let cursorRotation = 0;
    let targetRotationSpeed = 1.5;
    let currentRotationSpeed = 1.5;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    function renderCursor() {
      const ease = 0.45;
      ring.x += (mouse.x - ring.x) * ease;
      ring.y += (mouse.y - ring.y) * ease;

      currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.1;
      cursorRotation += currentRotationSpeed;

      cursorRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) rotate(${cursorRotation}deg)`;
      cursorDot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

      if (cursorTextContainer) {
        cursorTextContainer.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);

    // Hover interactions
    const hoverables = document.querySelectorAll('a:not(.floating-call-btn), button, input, textarea, select, .theme-toggle, .project-card, .skill-card, .social-icon, .heatmap-cell');

    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        targetRotationSpeed = 5.0;

        const cursorIcon = el.getAttribute('data-cursor-icon');
        let text = el.getAttribute('data-cursor') || '';

        if (cursorIcon) {
          if (cursorText && cursorTextContainer) {
            cursorText.innerHTML = `<i class="${cursorIcon}"></i>`;
            cursorTextContainer.classList.add('show-text');
            cursorRing.classList.add('has-icon');
            cursorDot.style.opacity = '0';
          }
        } else {
          if (!text) {
            if (el.tagName.toLowerCase() === 'a' && !el.classList.contains('social-icon')) text = 'Open';
            else if (el.tagName.toLowerCase() === 'button') text = 'Click';
            else if (el.classList.contains('project-card')) text = 'View';
            else if (el.classList.contains('heatmap-cell')) text = 'Check';
            else if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') text = 'Type';
          }

          if (text && cursorText && cursorTextContainer) {
            cursorText.innerText = text;
            cursorTextContainer.classList.add('show-text');
            cursorRing.classList.add('has-text');
            cursorDot.style.opacity = '0';
          }
        }
        cursorRing.classList.add('cursor-hover');
      });

      el.addEventListener('mouseleave', () => {
        targetRotationSpeed = 1.5;
        cursorRing.classList.remove('cursor-hover', 'has-text', 'has-icon');
        if (cursorTextContainer) {
          cursorTextContainer.classList.remove('show-text');
        }
        cursorDot.style.opacity = '1';
      });
    });

    window.addEventListener('mousedown', () => cursorRing.classList.add('cursor-click'));
    window.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-click'));
  } else {
    if (cursorRing) cursorRing.remove();
    if (cursorDot) cursorDot.remove();
    if (cursorTextContainer) cursorTextContainer.remove();
  }

  // ==========================================
  // 3. IMMERSIVE 3D SPACE BACKGROUND (THREE.JS)
  // ==========================================
  const canvas = document.getElementById('starfield');
  let threeJsAnimationId = null;
  let isHeroInView = true;

  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.0012);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Keycap texture generator
    const keyMapDark = new Map();
    const keyMapLight = new Map();

    function createKeycapTexture(text, isLight = false) {
      const map = isLight ? keyMapLight : keyMapDark;
      if (map.has(text)) return map.get(text);

      const tCanvas = document.createElement('canvas');
      tCanvas.width = 256;
      tCanvas.height = 256;
      const ctx = tCanvas.getContext('2d');

      if (isLight) {
        // Light Mode: Black keycap surface, Crisp White letters
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#ffffff';
      } else {
        // Dark Mode (Default): Clean White keycap surface, Crisp Black letters
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#000000';
      }

      const fs = text.length > 4 ? 52 : (text.length > 1 ? 78 : 120);
      ctx.font = `900 ${fs}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 132);

      const tex = new THREE.CanvasTexture(tCanvas);
      map.set(text, tex);
      return tex;
    }

    const keyboardLayout = [
      ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl', 'Left', 'Down', 'Right', '0', '.']
    ];

    // Key body material (White in Dark Mode, Black in Light Mode)
    const keyBodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.25
    });

    const keyboardGroup = new THREE.Group();
    const baseSize = 34;
    const gap = 4;

    function getKeyWidth(char, rowIndex, colIndex) {
      let u = 1.0;
      if (rowIndex === 0 && char === 'Backspace') u = 2.0;
      else if (rowIndex === 1 && (char === 'Tab' || char === '\\')) u = 1.5;
      else if (rowIndex === 2 && char === 'Caps') u = 1.75;
      else if (rowIndex === 2 && char === 'Enter') u = 2.25;
      else if (rowIndex === 3 && char === 'Shift') u = (colIndex === 0) ? 2.25 : 2.75;
      else if (rowIndex === 4) {
        if (char === 'Space') u = 4.0;
        else u = 1.0;
      }
      return u * baseSize + (u - 1) * gap;
    }

    function createRoundedKeyGeo(width, height, depth, radius) {
      const shape = new THREE.Shape();
      const x = -width / 2, y = -depth / 2;
      shape.moveTo(x, y + radius);
      shape.lineTo(x, y + depth - radius);
      shape.quadraticCurveTo(x, y + depth, x + radius, y + depth);
      shape.lineTo(x + width - radius, y + depth);
      shape.quadraticCurveTo(x + width, y + depth, x + width, y + depth - radius);
      shape.lineTo(x + width, y + radius);
      shape.quadraticCurveTo(x + width, y, x + width - radius, y);
      shape.lineTo(x + radius, y);
      shape.quadraticCurveTo(x, y, x, y + radius);

      const extrudeSettings = {
        depth: height,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 1.5,
        bevelThickness: 2.0
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const uv = geometry.attributes.uv;
      if (uv) {
        for (let i = 0; i < uv.count; i++) {
          let u = uv.getX(i);
          let v = uv.getY(i);
          uv.setXY(i, u / width + 0.5, v / depth + 0.5);
        }
        uv.needsUpdate = true;
      }

      geometry.rotateX(-Math.PI / 2);
      geometry.translate(0, -height / 2, 0);
      return geometry;
    }

    let startZ = -((keyboardLayout.length * (baseSize + gap)) / 2);
    const keysList = [];

    keyboardLayout.forEach((row, rowIndex) => {
      let rowWidth = 0;
      row.forEach((char, colIndex) => {
        rowWidth += getKeyWidth(char, rowIndex, colIndex) + gap;
      });
      rowWidth -= gap;

      let currentX = -(rowWidth / 2);
      const currentZ = startZ + rowIndex * (baseSize + gap);

      row.forEach((char, colIndex) => {
        const w = getKeyWidth(char, rowIndex, colIndex);
        const geo = createRoundedKeyGeo(w, 20, baseSize, 5);

        // Dark Mode: White Top surface with Black letter
        const topMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: createKeycapTexture(char, false),
          roughness: 0.25,
          metalness: 0.1
        });

        const materials = [topMat, keyBodyMat];
        const mesh = new THREE.Mesh(geo, materials);

        const targetPos = new THREE.Vector3(currentX + w / 2, 0, currentZ);
        const rX = (Math.random() + Math.random() - 1);
        const rY = (Math.random() + Math.random() - 1);
        const scatterPos = new THREE.Vector3(rX * 2500, rY * 1400, (Math.random() - 0.5) * 2000 - 300);

        mesh.position.copy(scatterPos);
        mesh.userData = {
          char: char,
          targetPos: targetPos,
          scatterPos: scatterPos,
          scatterVelocity: new THREE.Vector3(0, 0, Math.random() * 3 + 1),
          targetRot: new THREE.Euler(0, 0, 0),
          scatterRot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
          rotSpeed: new THREE.Vector3(Math.random() * 0.015, Math.random() * 0.015, Math.random() * 0.015)
        };

        currentX += w + gap;
        keyboardGroup.add(mesh);
        keysList.push(mesh);
      });
    });

    // Keyboard Chassis Baseplate (White Chassis with Blue Neon Edges & Glow)
    const chassisGeo = createRoundedKeyGeo(590, 15, 210, 10);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.25,
      transparent: true,
      opacity: 0.9
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);

    const chassisEdgesGeo = new THREE.EdgesGeometry(chassisGeo);
    const chassisEdgesMat = new THREE.LineBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: 1.0
    });
    const chassisEdges = new THREE.LineSegments(chassisEdgesGeo, chassisEdgesMat);
    chassis.add(chassisEdges);

    // Blue Neon Shade Underglow Light
    const chassisLight = new THREE.PointLight(0x00d8ff, 4.0, 500);
    chassisLight.position.set(0, 35, 0);
    chassis.add(chassisLight);

    const chassisTargetPos = new THREE.Vector3(0, -15, -19);
    const chassisScatterPos = new THREE.Vector3(0, -1200, -2500);

    chassis.position.copy(chassisScatterPos);
    chassis.userData = {
      targetPos: chassisTargetPos,
      scatterPos: chassisScatterPos,
      scatterVelocity: new THREE.Vector3(0, -3, -10),
      targetRot: new THREE.Euler(0, 0, 0),
      scatterRot: new THREE.Euler(Math.random(), Math.random(), Math.random()),
      rotSpeed: new THREE.Vector3(0.01, 0.01, 0.01)
    };
    keyboardGroup.add(chassis);
    keysList.push(chassis);

    // Background floating keys: increased count for an immersive dense swarm when keys spread out
    const allChars = keyboardLayout.flat();
    const floatingKeyCount = 320;

    for (let i = 0; i < floatingKeyCount; i++) {
      const char = allChars[Math.floor(Math.random() * allChars.length)];
      const w = getKeyWidth(char);
      const geo = createRoundedKeyGeo(w, 20, baseSize, 5);

      const topMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: createKeycapTexture(char, false),
        roughness: 0.25,
        metalness: 0.1
      });

      const mesh = new THREE.Mesh(geo, [topMat, keyBodyMat]);
      const rX = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const rY = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const scatterPos = new THREE.Vector3(
        rX * 3600,
        rY * 2200,
        (Math.random() - 0.5) * 3600 - 400
      );

      mesh.position.copy(scatterPos);
      const randomRealKey = keysList[Math.floor(Math.random() * (keysList.length - 1))];
      const mergePos = randomRealKey ? randomRealKey.userData.targetPos.clone() : scatterPos;
      mergePos.y -= 2;

      mesh.userData = {
        char: char,
        targetPos: mergePos,
        scatterPos: scatterPos,
        scatterVelocity: new THREE.Vector3(0, 0, Math.random() * 4.5 + 1.5),
        targetRot: new THREE.Euler(0, 0, 0),
        scatterRot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        rotSpeed: new THREE.Vector3(Math.random() * 0.015, Math.random() * 0.015, Math.random() * 0.015)
      };

      keyboardGroup.add(mesh);
      keysList.push(mesh);
    }

    keyboardGroup.scale.set(1.4, 1.4, 1.4);
    keyboardGroup.rotation.x = Math.PI / 5.5;
    keyboardGroup.position.z = -150;
    keyboardGroup.position.y = -100;
    scene.add(keyboardGroup);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffae6, 3.5);
    mainLight.position.set(150, 400, 250);
    scene.add(mainLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    dirLight.position.set(-250, 150, 150);
    scene.add(dirLight);

    const mouseLight = new THREE.PointLight(0x00e5ff, 3.5, 500);
    scene.add(mouseLight);

    // Stardust Particle System (1500 particles for high-performance rendering)
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starVel = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 3500;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 3500;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 3500;
      starVel[i] = (Math.random() - 0.5) * 2;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const pCtx = particleCanvas.getContext('2d');
    const gradient = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(0, 216, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = gradient;
    pCtx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 8,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starSystem = new THREE.Points(starGeo, starMat);
    scene.add(starSystem);

    // Mouse Parallax
    let starMouse = { targetX: 0, targetY: 0 };
    let currentCameraX = 0;
    let currentCameraY = 0;

    window.addEventListener('mousemove', (e) => {
      starMouse.targetX = (e.clientX - window.innerWidth / 2) * 0.25;
      starMouse.targetY = (e.clientY - window.innerHeight / 2) * 0.25;
    }, { passive: true });

    let assembleProgress = 1.0;
    let targetAssembleProgress = 1.0;
    let hasIntroExploded = false;

    setTimeout(() => {
      if (window.scrollY < 100) {
        targetAssembleProgress = 0.0;
      }
      hasIntroExploded = true;
    }, 4500);

    window.addEventListener('scroll', () => {
      if (!hasIntroExploded) return;
      const scrollProgress = Math.min(window.scrollY / 220, 1.0);
      targetAssembleProgress = scrollProgress;
    }, { passive: true });

    function resizeCanvas() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Pre-allocated math objects to prevent garbage collection frame drops
    const qScatter = new THREE.Quaternion();
    const qTarget = new THREE.Quaternion();
    const lookTarget = new THREE.Vector3(0, -20, -100);

    let time = 0;
    function animateStars() {
      if (!isHeroInView) {
        threeJsAnimationId = null;
        return;
      }

      time += 0.02;

      for (let i = 0; i < keysList.length; i++) {
        const mesh = keysList[i];
        const ud = mesh.userData;

        ud.scatterPos.add(ud.scatterVelocity);
        if (ud.scatterPos.z > 600) {
          ud.scatterPos.z -= 1800;
        }

        ud.scatterRot.x += ud.rotSpeed.x;
        ud.scatterRot.y += ud.rotSpeed.y;
        ud.scatterRot.z += ud.rotSpeed.z;

        mesh.position.lerpVectors(ud.scatterPos, ud.targetPos, assembleProgress);

        qScatter.setFromEuler(ud.scatterRot);
        qTarget.setFromEuler(ud.targetRot);
        mesh.quaternion.slerpQuaternions(qScatter, qTarget, assembleProgress);
      }

      if (targetAssembleProgress > assembleProgress) {
        assembleProgress += (targetAssembleProgress - assembleProgress) * 0.12;
      } else {
        assembleProgress += (targetAssembleProgress - assembleProgress) * 0.008;
      }

      const bobbing = Math.sin(time * 0.8) * 6 * (1 - assembleProgress);
      keyboardGroup.position.y = -100 + bobbing;

      currentCameraX += (starMouse.targetX - currentCameraX) * 0.05;
      currentCameraY += (starMouse.targetY - currentCameraY) * 0.05;

      keyboardGroup.rotation.y = Math.sin(time * 0.4) * 0.04 + (assembleProgress * 0.08) + (currentCameraX * 0.0015);
      keyboardGroup.rotation.x = (Math.PI / 5.5) + (currentCameraY * 0.0015);

      const positions = starGeo.attributes.position.array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += starVel[i] + (1 - assembleProgress) * 6;
        if (positions[i * 3 + 2] > 1000) {
          positions[i * 3 + 2] = -3000;
        }
      }
      starGeo.attributes.position.needsUpdate = true;

      starSystem.rotation.y += 0.0004;

      mouseLight.position.x = currentCameraX;
      mouseLight.position.y = -currentCameraY + 40;
      mouseLight.position.z = -20;

      camera.position.x = currentCameraX * 0.35;
      camera.position.y = -currentCameraY * 0.35;
      camera.lookAt(lookTarget);

      renderer.render(scene, camera);
      threeJsAnimationId = requestAnimationFrame(animateStars);
    }

    // Viewport-aware rendering: Pauses Three.js when Hero is scrolled out of view (HUGE performance boost!)
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroInView = entry.isIntersecting;
          if (isHeroInView && !threeJsAnimationId) {
            threeJsAnimationId = requestAnimationFrame(animateStars);
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    // Theme updater for Three.js
    window.updateThreeJSTheme = function (isLight) {
      if (!scene) return;
      if (isLight) {
        // Light Mode: Black keyboard with white letters
        scene.fog.color.setHex(0xfafcff);
        chassisMat.color.setHex(0x0f172a);
        chassisEdgesMat.color.setHex(0x0284c7);
        chassisLight.color.setHex(0x0284c7);
        keyBodyMat.color.setHex(0x0f172a);

        keysList.forEach(mesh => {
          if (mesh === chassis) return;
          mesh.material[0].color.setHex(0x0f172a);
          mesh.material[0].map = createKeycapTexture(mesh.userData.char, true);
          mesh.material[0].needsUpdate = true;
        });
      } else {
        // Dark Mode: White keyboard with black letters and blue neon shade
        scene.fog.color.setHex(0x050816);
        chassisMat.color.setHex(0xffffff);
        chassisEdgesMat.color.setHex(0x00d8ff);
        chassisLight.color.setHex(0x00d8ff);
        keyBodyMat.color.setHex(0xffffff);

        keysList.forEach(mesh => {
          if (mesh === chassis) return;
          mesh.material[0].color.setHex(0xffffff);
          mesh.material[0].map = createKeycapTexture(mesh.userData.char, false);
          mesh.material[0].needsUpdate = true;
        });
      }
    };
  }

  // ==========================================
  // 4. HERO TEXT TYPING EFFECT
  // ==========================================
  const typedTextSpan = document.getElementById('typed-text');
  if (typedTextSpan) {
    const textArray = ["Full-Stack Applications.", "Immersive UI Animations.", "Liquid Glass Designs.", "Next-Gen User Experiences."];
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 90);
      } else {
        setTimeout(erase, 2000);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 45);
      } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, 400);
      }
    }

    setTimeout(type, 1200);
  }

  // ==========================================
  // 5. UNIFIED THROTTLED SCROLL HANDLER
  // ==========================================
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const experienceSection = document.getElementById('experience');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  function onScrollTick() {
    const scrollY = window.scrollY;

    // 1. Sticky navbar state
    if (navbar) {
      if (scrollY > 50) navbar.classList.add('navbar-scrolled');
      else navbar.classList.remove('navbar-scrolled');
    }

    // 2. Scroll Spy navigation
    let currentSectionId = '';
    const scrollPos = scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.clientHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // 3. Timeline Progress Indicator
    if (experienceSection && timelineProgress) {
      const timelineTop = experienceSection.offsetTop;
      const timelineHeight = experienceSection.clientHeight;
      const scrollPosition = scrollY + window.innerHeight * 0.6;

      let relativeProgress = scrollPosition - timelineTop;
      let progressPercent = Math.max(0, Math.min(100, (relativeProgress / (timelineHeight * 0.75)) * 100));
      timelineProgress.style.height = `${progressPercent}%`;

      timelineItems.forEach(item => {
        const node = item.querySelector('.timeline-node');
        if (node) {
          const itemTop = item.offsetTop + timelineTop;
          if (scrollPosition > itemTop) node.classList.add('active');
          else node.classList.remove('active');
        }
      });
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        onScrollTick();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ==========================================
  // 6. INTERSECTION OBSERVER ANIMATIONS (Slide & fade)
  // ==========================================
  const genericObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in-element').forEach(el => genericObserver.observe(el));

  // ==========================================
  // 7. SKILLS ANIMATION TRIGGER
  // ==========================================
  const skillsGrid = document.querySelector('.skills-grid');
  let skillsAnimated = false;

  if (skillsGrid) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          setTimeout(animateSkills, 500);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    skillsObserver.observe(skillsGrid);
  }

  function animateSkills() {
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    function animateCount(element, target, duration, delay) {
      if (!element) return;
      element.textContent = "0%";
      setTimeout(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          element.textContent = `${Math.floor(easeInOutSine(progress) * target)}%`;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            element.textContent = `${target}%`;
          }
        };
        requestAnimationFrame(step);
      }, delay);
    }

    const linearFills = document.querySelectorAll('.skill-bar-fill');
    const linearPercents = document.querySelectorAll('.skill-bar-percent');

    linearFills.forEach((fill, idx) => {
      const targetPercent = parseInt(fill.getAttribute('data-percent'), 10);
      const delay = idx * 150;
      setTimeout(() => { fill.style.width = `${targetPercent}%`; }, delay);
      animateCount(linearPercents[idx], targetPercent, 1800, delay);
    });

    const circularFills = document.querySelectorAll('.radial-progress');
    const circularPercents = document.querySelectorAll('.radial-percent');

    circularFills.forEach((circle, idx) => {
      const targetPercent = parseInt(circle.getAttribute('data-percent'), 10);
      const radius = 40;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (targetPercent / 100) * circumference;
      const delay = idx * 150;

      setTimeout(() => { circle.style.strokeDashoffset = offset; }, delay);
      animateCount(circularPercents[idx], targetPercent, 1800, delay);
    });
  }

  // ==========================================
  // 8. MAGNETIC SOCIAL ICONS
  // ==========================================
  if (!isTouchDevice) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        el.style.transform = `translate3d(${distanceX * 0.3}px, ${distanceY * 0.3}px, 0) scale3d(1.08, 1.08, 1.08)`;
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)';
      });
    });
  }

  // ==========================================
  // 9. THEME TOGGLE
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (window.updateThreeJSTheme) window.updateThreeJSTheme(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      if (window.updateThreeJSTheme) window.updateThreeJSTheme(isLight);
    });
  }

  // ==========================================
  // 10. CONTACT FORM SUBMISSION MORPH
  // ==========================================
  const contactForm = document.getElementById('contact-form-element');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn.classList.contains('loading') || submitBtn.classList.contains('success')) return;

      submitBtn.classList.add('loading');
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        contactForm.reset();
        document.querySelectorAll('.form-control').forEach(input => input.blur());

        setTimeout(() => {
          submitBtn.classList.remove('success');
        }, 3000);
      }, 1500);
    });
  }

  // ==========================================
  // 11. CCBP LEARNING STREAK BOARD (SUPABASE)
  // ==========================================
  const SUPABASE_CONFIG = {
    url: 'https://jfjxzgwjzvjqmeltsgmp.supabase.co',
    anonKey: 'sb_publishable_GywS2QL1kkRxcY0Targo1w_OMbPNfR8'
  };

  const streakElements = {
    currentVal: document.getElementById('current-streak-val'),
    currentUnit: document.getElementById('current-streak-unit'),
    currentSub: document.getElementById('current-streak-sub'),
    longestVal: document.getElementById('longest-streak-val'),
    longestUnit: document.getElementById('longest-streak-unit'),
    longestSub: document.getElementById('longest-streak-sub'),
    totalVal: document.getElementById('total-days-val'),
    totalUnit: document.getElementById('total-days-unit'),
    totalSub: document.getElementById('total-days-sub'),
    todayBadge: document.getElementById('today-status-badge'),
    todaySub: document.getElementById('today-status-sub'),
    todayIconImg: document.getElementById('today-status-icon-img'),
    todayIconBox: document.getElementById('today-status-icon-box'),
    board: document.getElementById('streak-heatmap-board'),
    scrollWrap: document.getElementById('heatmap-scroll-wrap'),
    rangeSummary: document.getElementById('heatmap-range-summary'),
    lastSync: document.getElementById('streak-last-sync'),
    tooltip: document.getElementById('streak-tooltip'),
    tooltipDate: document.getElementById('tooltip-date'),
    tooltipStatus: document.getElementById('tooltip-status')
  };

  function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseLocalDate(str) {
    const parts = str.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatReadableDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function animateNumberCount(el, target, duration = 1200) {
    if (!el) return;
    if (target === 0) {
      el.textContent = '0';
      return;
    }
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(easeOutQuad * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  async function fetchSupabaseCheckins() {
    try {
      const endpoint = `${SUPABASE_CONFIG.url}/rest/v1/streak_checkins?select=date,logged_at&order=date.asc`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
      return null;
    }
  }

  function computeStreakMetrics(checkins) {
    const checkinMap = new Map();
    checkins.forEach(item => {
      if (item && item.date) checkinMap.set(item.date, item.logged_at);
    });

    const checkinDates = Array.from(checkinMap.keys()).sort();
    const totalActiveDays = checkinDates.length;

    const today = new Date();
    const todayStr = formatLocalDate(today);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = formatLocalDate(yesterday);

    const hasCheckedInToday = checkinMap.has(todayStr);

    let currentStreak = 0;
    if (hasCheckedInToday) {
      let cur = new Date(today);
      while (checkinMap.has(formatLocalDate(cur))) {
        currentStreak++;
        cur.setDate(cur.getDate() - 1);
      }
    } else if (checkinMap.has(yesterdayStr)) {
      let cur = new Date(yesterday);
      while (checkinMap.has(formatLocalDate(cur))) {
        currentStreak++;
        cur.setDate(cur.getDate() - 1);
      }
    }

    let longestStreak = 0;
    if (checkinDates.length > 0) {
      let tempStreak = 0;
      let prevDate = null;

      for (const dStr of checkinDates) {
        const currDate = parseLocalDate(dStr);
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const diffMs = currDate.getTime() - prevDate.getTime();
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays === 1) tempStreak++;
          else if (diffDays > 1) tempStreak = 1;
        }
        prevDate = currDate;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      checkinMap,
      totalActiveDays,
      currentStreak,
      longestStreak,
      hasCheckedInToday,
      todayStr
    };
  }

  function renderHeatmapGrid(metrics) {
    const { checkinMap, todayStr } = metrics;
    if (!streakElements.board) return;

    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - todayDayOfWeek));

    const totalWeeks = 53;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (totalWeeks * 7 - 1));

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabels = [];
    let lastMonth = -1;

    for (let w = 0; w < totalWeeks; w++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + w * 7);
      const m = weekStartDate.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ weekIndex: w, name: monthNames[m] });
        lastMonth = m;
      }
    }

    let html = '<div class="heatmap-months-row">';
    monthLabels.forEach(ml => {
      html += `<span class="heatmap-month-label" style="left: ${ml.weekIndex * 17}px">${ml.name}</span>`;
    });
    html += '</div>';

    html += '<div class="heatmap-main-grid">';
    html += '<div class="heatmap-days-col"><span>Sun</span><span>Tue</span><span>Thu</span><span>Sat</span></div>';
    html += '<div class="heatmap-weeks-container">';

    for (let w = 0; w < totalWeeks; w++) {
      html += '<div class="heatmap-week-column">';
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + (w * 7 + d));
        const cellDateStr = formatLocalDate(cellDate);
        const isFuture = cellDate > today;
        const isToday = cellDateStr === todayStr;
        const isActive = checkinMap.has(cellDateStr);
        const levelClass = isActive ? 'level-1' : 'level-0';
        const todayClass = isToday ? 'is-today' : '';
        const futureClass = isFuture ? 'is-future' : '';

        const readableDate = formatReadableDate(cellDate);
        const statusText = isActive ? '1 CCBP Check-in' : 'No check-in recorded';

        html += `
          <div class="heatmap-cell ${levelClass} ${todayClass} ${futureClass}"
               data-date="${cellDateStr}"
               data-readable="${readableDate}"
               data-status="${statusText}"
               data-active="${isActive ? 'true' : 'false'}"
               data-istoday="${isToday ? 'true' : 'false'}"
               title="${readableDate}: ${statusText}">
          </div>
        `;
      }
      html += '</div>';
    }

    html += '</div></div>';
    streakElements.board.innerHTML = html;

    attachHeatmapCellEvents();

    if (streakElements.scrollWrap) {
      setTimeout(() => {
        streakElements.scrollWrap.scrollLeft = streakElements.scrollWrap.scrollWidth;
      }, 50);
    }
  }

  function attachHeatmapCellEvents() {
    const cells = document.querySelectorAll('.heatmap-cell:not(.is-future)');
    const tooltip = streakElements.tooltip;
    const tooltipDate = streakElements.tooltipDate;
    const tooltipStatus = streakElements.tooltipStatus;

    if (!tooltip) return;

    function showTooltip(cell) {
      const dateStr = cell.getAttribute('data-readable');
      const statusStr = cell.getAttribute('data-status');
      const isActive = cell.getAttribute('data-active') === 'true';
      const isToday = cell.getAttribute('data-istoday') === 'true';

      tooltipDate.textContent = isToday ? `${dateStr} (Today)` : dateStr;
      tooltipStatus.innerHTML = isActive
        ? `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> ${statusStr}`
        : `<i class="fa-regular fa-circle" style="color: var(--text-muted);"></i> ${statusStr}`;

      const rect = cell.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top}px`;
      tooltip.classList.add('show');
      tooltip.setAttribute('aria-hidden', 'false');
    }

    function hideTooltip() {
      tooltip.classList.remove('show');
      tooltip.setAttribute('aria-hidden', 'true');
    }

    cells.forEach(cell => {
      cell.addEventListener('mouseenter', () => showTooltip(cell));
      cell.addEventListener('mouseleave', hideTooltip);
      cell.addEventListener('touchstart', () => showTooltip(cell), { passive: true });
    });

    document.addEventListener('touchstart', (e) => {
      if (!e.target.classList.contains('heatmap-cell')) hideTooltip();
    }, { passive: true });
  }

  async function initCCBPStreakBoard() {
    if (!document.getElementById('streak')) return;

    const checkins = await fetchSupabaseCheckins();

    if (!checkins) {
      if (streakElements.board) {
        streakElements.board.innerHTML = `
          <div class="heatmap-loading-state">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #f59e0b;"></i>
            <span>Unable to load check-in data. Please check connection.</span>
          </div>
        `;
      }
      if (streakElements.todayBadge) streakElements.todayBadge.textContent = 'Offline';
      if (streakElements.lastSync) streakElements.lastSync.textContent = 'Offline';
      return;
    }

    const metrics = computeStreakMetrics(checkins);
    // Update Metric Stat Numbers with smooth count-up
    animateNumberCount(streakElements.currentVal, metrics.currentStreak);
    animateNumberCount(streakElements.longestVal, metrics.longestStreak);
    animateNumberCount(streakElements.totalVal, metrics.totalActiveDays);

    if (streakElements.currentUnit) {
      streakElements.currentUnit.textContent = metrics.currentStreak === 1 ? 'Day' : 'Days';
    }
    if (streakElements.longestUnit) {
      streakElements.longestUnit.textContent = metrics.longestStreak === 1 ? 'Day' : 'Days';
    }
    if (streakElements.totalUnit) {
      streakElements.totalUnit.textContent = metrics.totalActiveDays === 1 ? 'Day' : 'Days';
    }

    if (streakElements.currentSub) {
      streakElements.currentSub.textContent = metrics.currentStreak === 1 ? '1 consecutive day' : `${metrics.currentStreak} consecutive days`;
    }
    if (streakElements.longestSub) {
      streakElements.longestSub.textContent = metrics.longestStreak === 1 ? 'Record: 1 day' : `Record: ${metrics.longestStreak} days`;
    }
    if (streakElements.totalSub) {
      streakElements.totalSub.textContent = metrics.totalActiveDays === 1 ? '1 verified learning session' : 'All-time verified sessions';
    }

    if (streakElements.todayBadge && streakElements.todayIconBox) {
      if (metrics.hasCheckedInToday) {
        streakElements.todayBadge.textContent = 'Completed';
        streakElements.todayBadge.className = 'metric-status-badge completed';
        if (streakElements.todayIconImg) {
          streakElements.todayIconImg.src = 'assets/icons/neon_check.jpg';
          streakElements.todayIconImg.alt = 'Completed';
        }
        streakElements.todayIconBox.className = 'metric-icon-box status-glow active-today';
        if (streakElements.todaySub) streakElements.todaySub.textContent = 'Active check-in logged';
      } else {
        streakElements.todayBadge.textContent = 'Pending';
        streakElements.todayBadge.className = 'metric-status-badge pending';
        if (streakElements.todayIconImg) {
          streakElements.todayIconImg.src = 'assets/icons/neon_hourglass.jpg';
          streakElements.todayIconImg.alt = 'Pending';
        }
        streakElements.todayIconBox.className = 'metric-icon-box status-glow pending-today';
        if (streakElements.todaySub) streakElements.todaySub.textContent = 'Awaiting daily check-in';
      }
    }

    if (streakElements.lastSync) streakElements.lastSync.textContent = 'Live • Synced with Supabase';
    if (streakElements.rangeSummary) {
      streakElements.rangeSummary.textContent = `${metrics.totalActiveDays} active learning ${metrics.totalActiveDays === 1 ? 'day' : 'days'} in the past 365 days`;
    }

    renderHeatmapGrid(metrics);
  }

  initCCBPStreakBoard();

  // ==========================================
  // 12. INITIALIZE 3D VANILLA TILT (Subtle & Smooth)
  // ==========================================
  if (typeof VanillaTilt !== 'undefined' && !isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll(".glass-panel, .about-img-frame, .project-card, .skill-card, .streak-metric-card"), {
      max: 5,
      speed: 600,
      glare: true,
      "max-glare": 0.06,
      perspective: 1200,
      scale: 1.01
    });
  }
});
