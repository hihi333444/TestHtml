class Perlin {
  constructor() {
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

  noise(x, y = 0) {
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

function generateNoiseMap(size = 10, scale = 0.1,Hight = 2) {
  const noiseGen = new Perlin(); // single instance
  const noiseMap = [];

  for (let x = 0; x < size; x++) {
    noiseMap[x] = [];
    for (let z = 0; z < size; z++) {
      // Generate noise, then round to nearest integer
      const noiseValue = noiseGen.noise(x * scale, z * scale);
      noiseMap[x][z] = Math.round(noiseValue*Hight);
    }
  }

  console.log(noiseMap);
  return noiseMap;
}


// Usage example:

window.Perlin = Perlin;
window.generateNoiseMap = generateNoiseMap;
