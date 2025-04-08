let joystickLeft,
    joystickLeftCenter,
    joystickRight,
    joystickRightCenter,
    joystickLeftActive = false,
    joystickRightActive = false,
    joystickLeftX = 0,
    joystickLeftY = 0,
    joystickRightX = 0,
    joystickRightY = 0,
    touchStartPointLeft = { x: 0, y: 0 },
    touchStartPointRight = { x: 0, y: 0 };
let keys = {};
let moveSpeed = 0.3,
    rotateSpeed = 0.05,
    lookSpeed = 0.02;
function setupEventListeners() {
    document.addEventListener("keydown", (e) => (keys[e.key] = true));
    document.addEventListener("keyup", (e) => (keys[e.key] = false));
    window.addEventListener('resize', onWindowResize, false);
    const joystickLeftElement = document.getElementById('joystick-left');
    const joystickRightElement = document.getElementById('joystick-right');
    if (isMobile) {
        joystickLeftElement.style.display = 'block';
        joystickRightElement.style.display = 'block';
        joystickLeftElement.addEventListener('touchstart', handleTouchStartLeft);
        joystickLeftElement.addEventListener('touchmove', handleTouchMoveLeft);
        joystickLeftElement.addEventListener('touchend', handleTouchEndLeft);
        joystickRightElement.addEventListener('touchstart', handleTouchStartRight);
        joystickRightElement.addEventListener('touchmove', handleTouchMoveRight);
        joystickRightElement.addEventListener('touchend', handleTouchEndRight);
    } else {
        joystickLeftElement.style.display = 'block';
        joystickRightElement.style.display = 'block';
        joystickLeftElement.addEventListener('mousedown', handleTouchStartLeft);
        joystickLeftElement.addEventListener('mousemove', handleTouchMoveLeft);
        joystickLeftElement.addEventListener('mouseup', handleTouchEndLeft);
        joystickRightElement.addEventListener('mousedown', handleTouchStartRight);
        joystickRightElement.addEventListener('mousemove', handleTouchMoveRight);
        joystickRightElement.addEventListener('mouseup', handleTouchEndRight);
    }
    joystickLeft = document.getElementById('joystick-left-center');
    joystickRight = document.getElementById('joystick-right-center');
}
function handleTouchStartLeft(e) {
    e.preventDefault();
    joystickLeftActive = true;
    touchStartPointLeft = {
        x: e.touches ? e.touches[0].clientX : e.clientX,
        y: e.touches ? e.touches[0].clientY : e.clientY,
    };
    joystickLeft.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
}
function handleTouchMoveLeft(e) {
    e.preventDefault();
    if (!joystickLeftActive) return;
    const touchX = e.touches ? e.touches[0].clientX : e.clientX;
    const touchY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = touchX - touchStartPointLeft.x;
    const deltaY = touchY - touchStartPointLeft.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    const maxDistance = 50;
    if (distance > maxDistance) {
        joystickLeftX = Math.cos(angle) * maxDistance / 50;
        joystickLeftY = Math.sin(angle) * maxDistance / 50;
    } else {
        joystickLeftX = deltaX / 50;
        joystickLeftY = deltaY / 50;
    }
    joystickLeft.style.left = `calc(50% + ${joystickLeftX * 30}px)`;
    joystickLeft.style.top = `calc(50% + ${joystickLeftY * 30}px)`;
}
function handleTouchEndLeft(e) {
    e.preventDefault();
    joystickLeftActive = false;
    joystickLeftX = 0;
    joystickLeftY = 0;
    joystickLeft.style.left = '50%';
    joystickLeft.style.top = '50%';
    joystickLeft.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
}
function handleTouchStartRight(e) {
    e.preventDefault();
    joystickRightActive = true;
    touchStartPointRight = {
        x: e.touches ? e.touches[0].clientX : e.clientX,
        y: e.touches ? e.touches[0].clientY : e.clientY,
    };
    joystickRight.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
}
function handleTouchMoveRight(e) {
    e.preventDefault();
    if (!joystickRightActive) return;
    const touchX = e.touches ? e.touches[0].clientX : e.clientX;
    const touchY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = touchX - touchStartPointRight.x;
    const deltaY = touchY - touchStartPointRight.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    const maxDistance = 50;
    if (distance > maxDistance) {
        joystickRightX = Math.cos(angle) * maxDistance / 50;
        joystickRightY = Math.sin(angle) * maxDistance / 50;
    } else {
        joystickRightX = deltaX / 50;
        joystickRightY = deltaY / 50;
    }
    joystickRight.style.left = `calc(50% + ${joystickRightX * 30}px)`;
    joystickRight.style.top = `calc(50% + ${joystickRightY * 30}px)`;
}
function handleTouchEndRight(e) {
    e.preventDefault();
    joystickRightActive = false;
    joystickRightX = 0;
    joystickRightY = 0;
    joystickRight.style.left = '50%';
    joystickRight.style.top = '50%';
    joystickRight.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
}
function handleMovement() {
    let moveX = 0,
        moveZ = 0;
    if (keys["w"] || joystickLeftY < -0.2) moveZ -= moveSpeed;
    if (keys["s"] || joystickLeftY > 0.2) moveZ += moveSpeed;
    if (keys["a"] || joystickLeftX < -0.2) moveX -= moveSpeed;
    if (keys["d"] || joystickLeftX > 0.2) moveX += moveSpeed;
    const yaw = player.rotation.y;
    player.position.x += Math.cos(yaw) * moveZ + Math.cos(yaw + Math.PI / 2) * moveX;
    player.position.z += Math.sin(yaw) * moveZ + Math.sin(yaw + Math.PI / 2) * moveX;
    if (keys["ArrowLeft"] || joystickRightX < -0.2)
        player.rotation.y += rotateSpeed;
    if (keys["ArrowRight"] || joystickRightX > 0.2)
        player.rotation.y -= rotateSpeed;
    if (keys["ArrowUp"] || joystickRightY < -0.2) pitch -= lookSpeed;
    if (keys["ArrowDown"] || joystickRightY > 0.2) pitch += lookSpeed;
    pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch));
    cameraHolder.rotation.x = pitch;
}
