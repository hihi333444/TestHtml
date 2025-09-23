// Assumes `scene` is a global THREE.Scene object

// Create camera rig (controls yaw)
const cameraRig = new THREE.Object3D();

// Create the camera (child of rig, controls pitch)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 0); // eye height inside rig
cameraRig.add(camera);

// Add rig to the global scene
scene.add(cameraRig);

// Movement flags
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let enableCulling = true;

// Cullingw
function updateCulling(enabled) {
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.frustumCulled = enabled;
    }
  });
}

updateCulling(enableCulling);


// Rotation angles
let yaw = 0;   // rotation around Y axis (left/right)
let pitch = 0; // rotation around X axis (up/down)

// Keyboard controls using event.code
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyC') {  // Press 'C' to toggle culling
    enableCulling = !enableCulling;
    updateCulling(enableCulling);
    console.log(`Frustum culling ${enableCulling ? 'enabled' : 'disabled'}`);
  }
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
    case 'Space': moveUp = true; break;           // Spacebar key
    case 'ControlLeft': moveDown = true; break;   // Left Ctrl key
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
    case 'Space': moveUp = false; break;
    case 'ControlLeft': moveDown = false; break;
  }
});

// Pointer lock to capture mouse movement
document.body.addEventListener('click', () => {
  document.body.requestPointerLock();
});

// Mouse movement to update rotation angles
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    // Adjust sensitivity as needed
    const sensitivity = 0.002;

    yaw -= event.movementX * sensitivity;
    pitch -= event.movementY * sensitivity;

    // Clamp pitch to avoid flipping over
    const maxPitch = Math.PI / 2 - 0.01;
    pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));
  }
});

// Call this every frame with deltaTime in seconds
function updateCameraMovement(deltaTime) {
  // Update rotations
  cameraRig.rotation.y = yaw;
  camera.rotation.x = pitch;

  // Calculate movement direction vector
  const direction = new THREE.Vector3();

  if (moveForward) direction.z -= 1;
  if (moveBackward) direction.z += 1;
  if (moveLeft) direction.x -= 1;
  if (moveRight) direction.x += 1;

  // Vertical movement (up/down)
  if (moveUp) direction.y += 1;    // Space moves up
  if (moveDown) direction.y -= 1;  // Ctrl moves down

  if (direction.lengthSq() > 0) {
    direction.normalize();

    // Apply rotation of the rig (yaw only) to move in local direction
    direction.applyEuler(cameraRig.rotation);

    // Movement speed units per second
    const speed = 5;
    direction.multiplyScalar(speed * deltaTime);

    cameraRig.position.add(direction);
  }
}
