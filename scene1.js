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
  function transformMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let col = 0; col < cols; col++) {
      let startRow = 0;

      while (startRow < rows) {
        let currentValue = matrix[startRow][col];

        let count = 1;
        for (let r = startRow + 1; r < rows; r++) {
          if (matrix[r][col] === currentValue) {
            count++;
          } else {
            break;
          }
        }

        matrix[startRow][col] = count;
        for (let r = startRow + 1; r < startRow + count; r++) {
          matrix[r][col] = 'none';
        }

        startRow += count;
      }
    }

    return matrix;
  }


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

  const TurrArray = generateNoiseMap(size, scale, Height);
  let Mat = transformMatrix(TurrArray)
  for (let x = 0; x < TurrArray.length; x++) {
    const A2 = TurrArray[x];
    for (let z = 0; z < A2.length; z++) { 
      if (Mat[x][z] != 'none'){
        const worldX = (x - size / 2) * spacing;
        const worldZ = (z - size / 2) * spacing;
        let Faces = ['top', 'back', 'front', 'left', 'right'];
        if (Mat[x][z] === 1){
          Faces = Faces.filter(side => !CheckSidesSame(x, z, TurrArray).includes(side));
          const topCube = createCubeWithFaces([1, 1, 1], Faces);
          topCube.position.set(worldX, (TurrArray[x][z] - 1) * spacing, worldZ);
          scene.add(topCube);
        }else{
          console.log(A2[z])
          const topCube = createCubeWithFaces([1, 1, Mat[x][z]], Faces);
          topCube.position.set(worldX, (A2[z] * spacing) + (Mat[x][z] / 2) * spacing, worldZ-((Mat[x][z]/2)*spacing));
          scene.add(topCube);
        }
        
        
        
        
      }
      
    }
  }
}



window.generateCubeTerrain_3 = generateCubeTerrain_3;

window.generateCubeTerrain_2 = generateCubeTerrain_2;

window.generateCubeTerrain = generateCubeTerrain;
