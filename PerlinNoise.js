class Perlin {
  constructor(repeat = 0) {
    this.repeat = repeat; // If repeat > 0, noise will loop every repeat units
    this.permutation = [];
    for (let i = 0; i < 256; i++) this.permutation[i] = i;
    for (let i = 255; i > 0; i--) {
      const swap = Math.floor(Math.random() * (i + 1));
      [this.permutation[i], this.permutation[swap]] = [this.permutation[swap], this.permutation[i]];
    }
    this.permutation = [...this.permutation, ...this.permutation];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }

  // Makes noise repeatable by wrapping coordinates
  mod(n, m) {
    return ((n % m) + m) % m;
  }

  noise(x, y = 0) {
    if (this.repeat > 0) {
      x = this.mod(x, this.repeat);
      y = this.mod(y, this.repeat);
    }

    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;

    return this.lerp(v,
      this.lerp(u, this.grad(this.permutation[A], x, y), this.grad(this.permutation[B], x - 1, y)),
      this.lerp(u, this.grad(this.permutation[A + 1], x, y - 1), this.grad(this.permutation[B + 1], x - 1, y - 1))
    );
  }
}
const ChunkSize = 10
function generateNoiseMap(size = 10, scale = 0.1, height = 2, repeat = 0, xOffset = 0, zOffset = 0) {
  const noiseGen = new Perlin(repeat); // pass repeat
  const noiseMap = [];

  for (let x = 0; x < size; x++) {
    noiseMap[x] = [];
    for (let z = 0; z < size; z++) {
      // Use offsets for world coordinates
      const noiseValue = noiseGen.noise((x + xOffset) * scale, (z + zOffset) * scale);
      // Use smooth values (don't round for smooth terrain)
      noiseMap[x][z] = Math.round(noiseValue * height);
    }
  }
  return noiseMap;
}

// Usage example:
window.Perlin = Perlin;
window.generateNoiseMap = generateNoiseMap;

// Example to generate a 16x16 map, smooth, repeat every 32 units:
// const map = generateNoiseMap(16, 0.2, 5, 32, worldXOffset, worldZOffset);