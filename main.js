let scene, renderer, player, cameraHolder, ground, mainCamera, pitch = 0;
function init() {
    const canvas = document.getElementById('threeCanvas');
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    (scene = new THREE.Scene()).background = new THREE.Color(0x87CEEB);
    (player = new THREE.Object3D()).position.set(0, 2, 0);
    scene.add(player);
    (cameraHolder = new THREE.Object3D()).position.set(0, 1.5, 0);
    player.add(cameraHolder);
    mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraHolder.add(mainCamera);
    createGround();
    setupMiniMap();
    setupEventListeners();
    loadInitialBuildings();
    animate();
}
function createGround() {
    const geometry = new THREE.PlaneGeometry(5000, 5000);
    const material = new THREE.MeshBasicMaterial({
        color: 0x228B22,
        side: THREE.DoubleSide
    });
    ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
}
function onWindowResize() {
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    miniMapCanvas.width = miniMapCanvas.offsetWidth;
    miniMapCanvas.height = miniMapCanvas.offsetHeight;
}
function animate() {
    requestAnimationFrame(animate);
    handleMovement();
    renderer.render(scene, mainCamera);
    if (isMiniMapActive) {
        renderMiniMap();
    }
}
function useLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                playerLat = position.coords.latitude;
                playerLon = position.coords.longitude;
                for (const key in buildings) {
                    scene.remove(buildings[key].mesh);
                    scene.remove(buildings[key].edgeMesh);
                    delete buildings[key];
                }
                loadedChunks.clear();
                loadInitialBuildings();
            },
            (error) => {
                alert("Error getting location: " + error.message);
                console.error("Error getting location:", error);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
init();
