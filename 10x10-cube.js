function create10x10CubeGrid(scene, cubeSize = 1, spacing = 0) {
  const halfGrid = 10 / 2;

  for (let x = 0; x < 10; x++) {
    for (let z = 0; z < 10; z++) {
      const cube = createCubeWithoutBottom(cubeSize);
      cube.position.set(
        (x - halfGrid) * spacing,
        cubeSize / 2,
        (z - halfGrid) * spacing
      );
      scene.add(cube);
    }
  }
}
