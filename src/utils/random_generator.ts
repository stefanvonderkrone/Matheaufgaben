// Simple seeded random number generator (Mulberry32)
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Generate next random number between 0 and 1
  next(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Generate random integer in range [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Parse seed from URL query parameter
export function getSeedFromUrl(): number {
  const urlParams = new URLSearchParams(window.location.search);
  const seedParam = urlParams.get('seed');
  
  if (seedParam) {
    const seed = parseInt(seedParam, 10);
    if (!isNaN(seed)) {
      return seed;
    }
  }
  
  // Generate random seed if none provided
  return Math.floor(Math.random() * 1000000);
}
