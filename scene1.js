
const directions = [
  /*[-1, -1]*/, [-1, 0], //[-1, 1],
  [0, -1],           [0, 1],
  /*[1, -1]*/,  [1, 0],  //[1, 1]
];
function generateCubeTerrain(scene, size = 10, spacing = 1, scale = 0.1, Height = 5) {

  const TurrArray = generateNoiseMap(size,scale,Height)

  for (let x = 0; x < TurrArray.length; x++) {
    const A2 = TurrArray[x];
    for (let z = 0; z < A2.length; z++) {
      const worldX = (x - size / 2) * spacing;
      const worldZ = (z - size / 2) * spacing;
      let Faces = ['top', 'back' , 'front', 'left' ,'right']
      topCube = createCubeWithFaces([1,1,1],Faces);
      topCube.position.set(worldX, (TurrArray[x][z] - 1) * spacing, worldZ);
      scene.add(topCube);
      bottomube = createCubeWithFaces([1,1,1],Faces);
      bottomube.position.set(worldX, (TurrArray[x][z] - 2) * spacing, worldZ);
      scene.add(bottomube);
    }
  }
}

function generateCubeTerrain_2(scene, size = 10, spacing = 1, scale = 0.1, Height = 5) {
  function CheckSidesSame(x, y, arr) {
    const rows = arr.length;
    const cols = arr[0].length;
    const current = arr[x][y];
    const sides = [];
    if (x > 0 && arr[x - 1][y] >= current) sides.push('left');
    if (x < rows - 1 && arr[x + 1][y] >= current) sides.push('right');
    if (y > 0 && arr[x][y - 1] >= current) sides.push('back');
    if (y < cols - 1 && arr[x][y + 1] >= current) sides.push('front');
    return sides;
  }
  const TurrArray = generateNoiseMap(size,scale,Height)

  for (let x = 0; x < TurrArray.length; x++) {
    const A2 = TurrArray[x];
    for (let z = 0; z < A2.length; z++) { 
      const worldX = (x - size / 2) * spacing;
      const worldZ = (z - size / 2) * spacing;
      let Faces = ['top', 'back' , 'front', 'left' ,'right']
      Faces = Faces.filter(side => !CheckSidesSame(x,z,TurrArray).includes(side));
      topCube = createCubeWithFaces([1,1,1],Faces);
      topCube.position.set(worldX, (TurrArray[x][z] - 1) * spacing, worldZ);
      scene.add(topCube);
    }
  }

}
function generateCubeTerrain_3(scene, size = 10, spacing = 1, scale = 0.1, Height = 5) {
  const TurrArray = generateNoiseMap(size, scale, Height);

  for (let x = 0; x < TurrArray.length; x++) {
    let z = 0;
    while (z < TurrArray[x].length) {
      const currentHeight = TurrArray[x][z];
      let width = 1;

      while (
        z + width < TurrArray[x].length &&
        TurrArray[x][z + width] === currentHeight
      ) {
        width++;
      }

      const worldX = (x - size / 2) * spacing;
      const worldZ = (z - size / 2) * spacing + ((width - 1) * spacing) / 2;

      const Faces = ['top', 'back', 'front', 'left', 'right'];
      const topCube = createCubeWithFaces([1, 1, width], Faces);
      topCube.position.set(worldX, (currentHeight - 1) * spacing, worldZ);
      scene.add(topCube);

      z += width;
    }
  }
}



window.generateCubeTerrain_3 = generateCubeTerrain_3;

window.generateCubeTerrain_2 = generateCubeTerrain_2;

window.generateCubeTerrain = generateCubeTerrain;
