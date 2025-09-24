//Create Cube
function createCubeWithFaces(
  size = [1, 1, 1], 
  facesToInclude = ['top', 'bottom', 'front', 'back', 'left', 'right'], 
  material = null
) {
  // Destructure sizes for each axis
  const [sx, sy, sz] = size;
  const hx = sx / 2;
  const hy = sy / 2;
  const hz = sz / 2;

  const faces = [];

  function pushFace(a, b, c, d) {
    faces.push(
      ...a, ...b, ...c,
      ...a, ...c, ...d
    );
  }

  const p = {
    topFrontLeft:    [-hx,  hy,  hz],
    topFrontRight:   [ hx,  hy,  hz],
    topBackLeft:     [-hx,  hy, -hz],
    topBackRight:    [ hx,  hy, -hz],
    bottomFrontLeft: [-hx, -hy,  hz],
    bottomFrontRight:[ hx, -hy,  hz],
    bottomBackLeft:  [-hx, -hy, -hz],
    bottomBackRight: [ hx, -hy, -hz],
  };

  const faceVertices = {
    top:    [p.topBackLeft, p.topBackRight, p.topFrontRight, p.topFrontLeft],
    bottom: [p.bottomFrontLeft, p.bottomFrontRight, p.bottomBackRight, p.bottomBackLeft],
    front:  [p.topFrontLeft, p.topFrontRight, p.bottomFrontRight, p.bottomFrontLeft],
    back:   [p.topBackRight, p.topBackLeft, p.bottomBackLeft, p.bottomBackRight],
    left:   [p.topBackLeft, p.topFrontLeft, p.bottomFrontLeft, p.bottomBackLeft],
    right:  [p.topFrontRight, p.topBackRight, p.bottomBackRight, p.bottomFrontRight],
  };

  facesToInclude.forEach(faceName => {
    const quad = faceVertices[faceName.toLowerCase()];
    if (quad) pushFace(...quad);
  });

  const vertices = new Float32Array(faces);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  if (!material) {
    material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
  }

  return new THREE.Mesh(geometry, material);
}


//delete faces
function removeFaces(mesh, facesToRemove) {
  if (!mesh.userData.facesToInclude) {
    console.warn('No original face list found in mesh.userData.facesToInclude');
    return mesh;
  }

  // makes sure it is a array
  if (!Array.isArray(facesToRemove)) {
    facesToRemove = [facesToRemove];
  }

  // lowercase all
  const facesToRemoveLower = facesToRemove.map(f => f.toLowerCase());

  //removes faces
  const newFaces = mesh.userData.facesToInclude.filter(
    face => !facesToRemoveLower.includes(face.toLowerCase())
  );

  const size = mesh.userData.size || 1;
  const material = mesh.material;

  const newMesh = createCubeWithFaces(size, newFaces, material);

  newMesh.userData.facesToInclude = newFaces;
  newMesh.userData.size = size;

  return newMesh;
}

function expandCube(mesh, x, y, z) {
  // Check if we have original face data
  if (!mesh.userData.facesToInclude) {
    console.warn('No original face list found in mesh.userData.facesToInclude');
    return mesh;
  }

  const facesToInclude = mesh.userData.facesToInclude;
  const material = mesh.material;
  const position = mesh.position.clone(); // Save current position

  const newSize = [x, y, z];

  // Create new cube with the same faces and new size
  const newMesh = createCubeWithFaces(newSize, facesToInclude, material);

  // Restore position
  newMesh.position.copy(position);

  // Preserve userData
  newMesh.userData.facesToInclude = facesToInclude;
  newMesh.userData.size = newSize;

  return newMesh;
}


window.removeFaces = removeFaces;

window.expandCube = expandCube;

window.createCubeWithFaces = createCubeWithFaces; //Full list ['top', 'bottom',  'front', 'back' , 'left' ,'right']