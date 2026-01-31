// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    
    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('nav-active');
            
            // Toggle Icon animation (Optional: Change bars to X)
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Three.js 3D animated background
    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    const canvas = document.getElementById('bg');
    if (!canvas) {
        console.error("Canvas element with id 'bg' not found!");
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.position.z = 50;

    // Create particles
    const particles = new THREE.BufferGeometry();
    const particleCount = 2000; // Reduced count for performance with lines
    
    // Custom shader or line connections requires more complex setup, 
    // sticking to Points with improved motion for now, or using a LineSegments approach
    
    const positions = [];
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push((Math.random() - 0.5) * 100); 
        positions.push((Math.random() - 0.5) * 100); 
        positions.push((Math.random() - 0.5) * 100);
        
        velocities.push((Math.random() - 0.5) * 0.02);
        velocities.push((Math.random() - 0.5) * 0.02);
        velocities.push((Math.random() - 0.5) * 0.02);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({ 
        color: 0x06b6d4, // Cyan to match theme
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animate
    function animate() {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        particleSystem.rotation.y += 0.05 * (targetX - particleSystem.rotation.y);
        particleSystem.rotation.x += 0.05 * (targetY - particleSystem.rotation.x);
        
        // Slight constant rotation
        particleSystem.rotation.z += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- 3D AVATAR/TECH SPHERE SECTION ---
    initAvatar();

    function initAvatar() {
        const avatarContainer = document.getElementById('avatar-container');
        if (!avatarContainer) return;

        const avatarScene = new THREE.Scene();
        // Adjust camera to fit the potentially smaller responsive container
        const avatarCamera = new THREE.PerspectiveCamera(50, avatarContainer.clientWidth / avatarContainer.clientHeight, 0.1, 100);
        avatarCamera.position.z = 7; 

        const avatarRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        avatarRenderer.setSize(avatarContainer.clientWidth, avatarContainer.clientHeight);
        avatarRenderer.setPixelRatio(window.devicePixelRatio);
        avatarContainer.appendChild(avatarRenderer.domElement);

        // --- Simplified DevOps Representation ---
        
        // 1. Central "Server" Node (The Hub) - clean sphere
        const coreGeo = new THREE.SphereGeometry(1.2, 32, 32); 
        const coreMat = new THREE.MeshPhongMaterial({ 
            color: 0x06b6d4, 
            shininess: 100,
            emissive: 0x001133
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        avatarScene.add(core);

        // 2. Simple Orbiting "Nodes" (Cubes represented as services)
        const cubesGroup = new THREE.Group();
        avatarScene.add(cubesGroup);

        const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Slightly larger, fewer cubes
        const cubeMat = new THREE.MeshLambertMaterial({ color: 0x8b5cf6 }); // Violet accents

        // Create a clean ring of services
        const nodeCount = 6;
        for (let i = 0; i < nodeCount; i++) {
            const cube = new THREE.Mesh(cubeGeo, cubeMat);
            
            // Position in a flat ring for a cleaner look
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = 2.8;

            cube.position.x = Math.cos(angle) * radius;
            cube.position.z = Math.sin(angle) * radius;
            
            // Add wireframe around cube for "tech" feel
            const edges = new THREE.EdgesGeometry(cubeGeo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            cube.add(line);

            cubesGroup.add(cube);
        }

        // 3. Simple Electron Rings (Connectivity)
        const ringGeo = new THREE.TorusGeometry(2.8, 0.03, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 });
        
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        ring1.rotation.x = Math.PI / 2; // Flat ring
        cubesGroup.add(ring1); // Add to group so it rotates with cubes? No, separate rotation preferable.
        // Actually, let's keep ring1 separate
        avatarScene.add(ring1);

        const ring2 = new THREE.Mesh(ringGeo, ringMat);
        ring2.rotation.x = Math.PI / 1.5; 
        ring2.rotation.y = Math.PI / 6;
        avatarScene.add(ring2);


        // Ligthing
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        avatarScene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x06b6d4, 2);
        pointLight.position.set(5, 5, 5);
        avatarScene.add(pointLight);


        // Animation Loop
        function animateAvatar() {
            requestAnimationFrame(animateAvatar);

            // Slow, calm rotation
            core.rotation.y -= 0.005;
            
            // Rotate the ring of nodes
            cubesGroup.rotation.y += 0.01;
            
            // Individual node rotation
            cubesGroup.children.forEach(child => {
                 // Check if it's a mesh (cube) not the ring if I added it there
                 if (child.isMesh) {
                     child.rotation.x += 0.01;
                     child.rotation.y += 0.01;
                 }
            });

            // Rotate rings
            ring1.rotation.z += 0.002; // Very slow
            ring2.rotation.y -= 0.005;

            // Interactive Parallax
            avatarScene.rotation.y = mouseX * 0.0002;
            avatarScene.rotation.x = -mouseY * 0.0002;

            avatarRenderer.render(avatarScene, avatarCamera);
        }
        animateAvatar();

        // Robust Resize Handler
        window.addEventListener('resize', () => {
             // Need to get new dimensions from the CSS-controlled container
             const width = avatarContainer.clientWidth;
             const height = avatarContainer.clientHeight;
             
             avatarRenderer.setSize(width, height);
             avatarCamera.aspect = width / height;
             avatarCamera.updateProjectionMatrix();
        });
    }
});
