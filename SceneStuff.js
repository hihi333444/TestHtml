function clearScene(scene) {
  scene.traverse((object) => {
    if (!object.isMesh) return;

    if (object.geometry) {
      object.geometry.dispose();
    }

    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((m) => m.dispose());
      } else {
        object.material.dispose();
      }
    }
  });

  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}

function deleteChunk(scene, chunkX, chunkZ) {
  const key = `${chunkX},${chunkZ}`;
  const meshes = ChunkMeshes.get(key);
  if (meshes) {
    for (const mesh of meshes) {
      scene.remove(mesh);
      // Optional: dispose geometry & material for memory cleanup
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    }
    ChunkMeshes.delete(key);
  }
}

function CountFa(){
  console.log("Total faces in scene:", 
    (() => {
      let faces = 0;
      scene.traverse((object) => {
        if (object.isMesh) {
          const g = object.geometry;
          if (g?.index) faces += g.index.count / 3;
          else if (g?.attributes.position) faces += g.attributes.position.count / 3;
        }
      });
        return faces;
    })()
  );
}
window.CountFa = CountFa;