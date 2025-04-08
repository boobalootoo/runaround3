let miniMapCanvas, miniMapCtx, miniMapButton, miniMapWindow, isMiniMapActive = false;
function setupMiniMap() {
    miniMapCanvas = document.getElementById('miniMapCanvas');
    miniMapCtx = miniMapCanvas.getContext('2d');
    miniMapButton = document.getElementById('mini-map-button');
    miniMapWindow = document.getElementById('mini-map-window');
    miniMapCanvas.width = miniMapCanvas.offsetWidth;
    miniMapCanvas.height = miniMapCanvas.offsetHeight;
    miniMapButton.addEventListener('click', toggleMiniMap);
    document.querySelector('.close-icon').addEventListener('click', closeMiniMap);
}
function toggleMiniMap() {
    isMiniMapActive = !isMiniMapActive;
    miniMapWindow.classList.toggle('active');
    if (isMiniMapActive) {
        renderMiniMap();
    }
}
function closeMiniMap() {
    isMiniMapActive = false;
    miniMapWindow.classList.remove('active');
}
function renderMiniMap() {
    if (!isMiniMapActive) return;
    miniMapCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    miniMapCtx.strokeStyle = '#999';
    miniMapCtx.strokeRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    const centerX = miniMapCanvas.width / 2;
    const centerY = miniMapCanvas.height / 2;
    miniMapCtx.fillStyle = 'red';
    miniMapCtx.beginPath();
    miniMapCtx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    miniMapCtx.fill();
    const viewAngle = player.rotation.y;
    const arrowLength = 10;
    miniMapCtx.beginPath();
    miniMapCtx.moveTo(centerX, centerY);
    miniMapCtx.lineTo(centerX + Math.cos(viewAngle) * arrowLength, centerY + Math.sin(viewAngle) * arrowLength);
    miniMapCtx.strokeStyle = 'blue';
    miniMapCtx.stroke();
    Object.values(buildings).forEach(({ mesh }) => {
        const position = mesh.position;
        const x = (position.x / 50000) * miniMapCanvas.width + centerX;
        const z = (position.z / 50000) * miniMapCanvas.height + centerY;
        miniMapCtx.fillStyle = 'gray';
        miniMapCtx.fillRect(x - 2, z - 2, 4, 4);
    });
    requestAnimationFrame(renderMiniMap);
}
