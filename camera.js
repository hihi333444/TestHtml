// Assumes `scene` is a global THREE.Scene object

// Create camera rig (controls yaw)
const cameraRig = new THREE.Object3D();
let RenderedChunks = [];
let CPOS = [0, 0];

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

// Culling
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
    // sensitivity
    const sensitivity = 0.002;
    yaw -= event.movementX * sensitivity;
    pitch -= event.movementY * sensitivity;
    // Clamp pitch to avoid flipping over
    const maxPitch = Math.PI / 2 - 0.01;
    pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));
  }
});

// Helper function to check if chunk is already rendered
function chunkExists(x, y) {
  // Checks if [x,y] exists in RenderedChunks
  return RenderedChunks.some(chunk => chunk[0] === x && chunk[1] === y);
}

function Chunk(X, Y) {
  if (!chunkExists(X, Y)) {
    RenderedChunks.push([X, Y]);
    generateCubeTerrain_3(scene, chunkSize, 1, .1, 3, X * chunkSize, Y * chunkSize);
  }
}

let chunkSize = 25;

// Call this every frame with deltaTime in seconds
function updateCameraMovement(deltaTime) {
  // Update rotations
  cameraRig.rotation.y = yaw;
  camera.rotation.x = pitch;

  // Calculate movement direction vector
  const direction = new THREE.Vector3();

  if (moveForward) direction.z -= 10;
  if (moveBackward) direction.z += 10;
  if (moveLeft) direction.x -= 10;
  if (moveRight) direction.x += 10;
  if (moveUp) direction.y += 10;    // Space moves up
  if (moveDown) direction.y -= 10;  // Ctrl moves down

  if (direction.lengthSq() > 0) {
    direction.normalize();
    // Apply rotation of the rig (yaw only) to move in local direction
    direction.applyEuler(cameraRig.rotation);
    // Movement speed units per second
    const speed = 20;
    direction.multiplyScalar(speed * deltaTime);
    cameraRig.position.add(direction);
  }

  // Calculate which chunk camera is in
  const centerChunk = [
    Math.floor(cameraRig.position.x / chunkSize),
    Math.floor(cameraRig.position.z / chunkSize)
  ];

  // Only update if camera moved to a new chunk
  if (CPOS[0] !== centerChunk[0] || CPOS[1] !== centerChunk[1]) {
    // Render all chunks in a circle of radius 5 around centerChunk
    const radius = 5;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
          Chunk(centerChunk[0] + dx, centerChunk[1] + dy);
        }
      }
    }
    CPOS = centerChunk;
  }
}

// Example usage in your animation loop:
// let lastTime = performance.now();
// function animate() {
//   let now = performance.now();
//   let deltaTime = (now - lastTime) / 1000;
//   lastTime = now;
//   updateCameraMovement(deltaTime);
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }
// animate();