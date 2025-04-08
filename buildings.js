let buildings = {},
    loadedChunks = new Set();
let playerLat = 51.5074,
    playerLon = -0.1278;
async function loadBuildings() {
    let chunkKey = `${Math.floor(playerLat)},${Math.floor(playerLon)}`;
    if (loadedChunks.has(chunkKey)) return;
    loadedChunks.add(chunkKey);
    console.log("Loading buildings...");
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];way[building](around:500,${playerLat},${playerLon});out body;node(w);out;`;
    const response = await fetch(url);
    const data = await response.json();
    const nodes = {};
    data.elements.forEach((el) => {
        if (el.type === "node") {
            nodes[el.id] = {
                lat: el.lat,
                lon: el.lon
            };
        }
    });
    const scale = 100000;
    data.elements.forEach((el) => {
        if (el.type === "way" && el.nodes) {
            const shape = new THREE.Shape();
            let first = true;
            el.nodes.forEach((nodeId) => {
                const node = nodes[nodeId];
                if (node) {
                    const x = (node.lon - playerLon) * scale;
                    const z = (node.lat - playerLat) * scale;
                    if (first) {
                        shape.moveTo(x, z);
                        first = false;
                    } else {
                        shape.lineTo(x, z);
                    }
                }
            });
            const height = Math.random() * 47 + 3;
            const settings = {
                depth: height,
                bevelEnabled: false
            };
            const geometry = new THREE.ExtrudeGeometry(shape, settings);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
            scene.add(mesh);
            const edgesGeometry = new THREE.EdgesGeometry(geometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: 0x000000
            });
            const edgeMesh = new THREE.LineSegments(edgesGeometry, edgeMaterial);
            edgeMesh.rotation.x = -Math.PI / 2;
            scene.add(edgeMesh);
            buildings[chunkKey] = {
                mesh,
                edgeMesh
            };
        }
    });
    console.log("Buildings loaded.");
}
function loadInitialBuildings() {
    loadBuildings();
}
