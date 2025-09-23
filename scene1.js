// Store previous numCubes per (x,z)
const directions = [
  /*[-1, -1]*/, [-1, 0], //[-1, 1],
  [0, -1],           [0, 1],
  /*[1, -1]*/,  [1, 0],  //[1, 1]
];
function generateCubeTerrain(scene, size = 10, spacing = 1, scale = 0.1, Height = 5) {

  const TurrArray = generateNoiseMap(size,scale,Height)

  for (let x = 0; x < TurrArray.length; x++) {
    const A2 = TurrArray[x];
    for (let z = 0; z < A2.length; z++) {  // fix here: I in condition and increment
      console.log(A2[z]);
      const worldX = (x - size / 2) * spacing;
      const worldZ = (z - size / 2) * spacing;
      let Faces = ['top', 'back' , 'front', 'left' ,'right']
      topCube = createCubeWithFaces(1,Faces);
      topCube.position.set(worldX, (TurrArray[x][z] - 1) * spacing, worldZ);
      scene.add(topCube);
      bottomube = createCubeWithFaces(1,Faces);
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
  function CheckSidesDiff2(x, y, arr) {
    const rows = arr.length;
    const cols = arr[0].length;
    const current = arr[x][y];
    const sides = [];
    if (x > 0 && arr[x - 1][y] === current) sides.push('left');
    if (x < rows - 1 && arr[x + 1][y] === current) sides.push('right');
    if (y > 0 && arr[x][y - 1] === current) sides.push('back');
    if (y < cols - 1 && arr[x][y + 1] === current) sides.push('front');
    let number = [
      (arr[x - 1] && arr[x - 1][y] !== undefined) ? arr[x - 1][y] : current,
      (arr[x + 1] && arr[x + 1][y] !== undefined) ? arr[x + 1][y] : current,
      (arr[x] && arr[x][y - 1] !== undefined) ? arr[x][y - 1] : current,
      (arr[x] && arr[x][y + 1] !== undefined) ? arr[x][y + 1] : current,
    ];
    number = number.map(n => Math.abs(n));
    number = Math.max(...number);
    return [sides,number];
    
  }
  const TurrArray = generateNoiseMap(size,scale,Height)

  for (let x = 0; x < TurrArray.length; x++) {
    const A2 = TurrArray[x];
    for (let z = 0; z < A2.length; z++) {  // fix here: I in condition and increment
      const worldX = (x - size / 2) * spacing;
      const worldZ = (z - size / 2) * spacing;
      let Faces = ['top', 'back' , 'front', 'left' ,'right']
      Faces = Faces.filter(side => !CheckSidesSame(x,z,TurrArray).includes(side));
      topCube = createCubeWithFaces(1,Faces);
      topCube.position.set(worldX, (TurrArray[x][z] - 1) * spacing, worldZ);
      scene.add(topCube);
      /*const UnderSide = CheckSidesDiff2(x,z,TurrArray)
      console.log(UnderSide)
      if (UnderSide[1] > 0){
        for (i = 1; i < UnderSide[0]; i++) {
          BottomCube = createCubeWithFaces(1,UnderSide[0]);
          BottomCube.position.set(worldX, (TurrArray[x][z] - (2+i)) * spacing, worldZ);
          scene.add(BottomCube);
        }
      }*/
    }
  }

}
window.generateCubeTerrain_2 = generateCubeTerrain_2;

window.generateCubeTerrain = generateCubeTerrain;
