/**
 * Script to fetch constellation and star data from Celestial Data project
 * Run with: node scripts/fetchConstellationData.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';

const DATA_DIR = './src/data';
const OUTPUT_FILE = `${DATA_DIR}/constellations.json`;

// Data sources from Celestial Data project (CC BY 4.0)
const SOURCES = {
  constellationLines: 'https://raw.githubusercontent.com/dieghernan/celestial_data/main/data/constellations.lines.geojson',
  stars: 'https://raw.githubusercontent.com/dieghernan/celestial_data/main/data/stars.6.geojson',
  constellationNames: 'https://raw.githubusercontent.com/dieghernan/celestial_data/main/data/constellations.geojson',
};

async function fetchJSON(url) {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

/**
 * Convert RA/Dec (in degrees) to normalized screen coordinates
 * RA: -180 to 180 degrees (GeoJSON longitude) -> x: 0-1
 * Dec: -90 to +90 degrees -> y: 0-1 (north/+90 at top, south/-90 at bottom)
 *
 * Screen coordinates: x=0 left, x=1 right, y=0 bottom, y=1 top
 */
function raDecToScreen(ra, dec) {
  // RA to x: -180 -> 0, 0 -> 0.5, 180 -> 1
  const x = ((ra + 180) % 360) / 360;
  // Dec to y: -90 (south) -> 0 (bottom), +90 (north) -> 1 (top)
  const y = (dec + 90) / 180;
  return { x, y };
}

/**
 * B-V color index to spectral class approximation
 */
function bvToSpectral(bv) {
  if (bv < -0.3) return 'O';
  if (bv < -0.02) return 'B';
  if (bv < 0.3) return 'A';
  if (bv < 0.58) return 'F';
  if (bv < 0.81) return 'G';
  if (bv < 1.4) return 'K';
  return 'M';
}

async function main() {
  try {
    // Fetch all data
    const [linesData, starsData, namesData] = await Promise.all([
      fetchJSON(SOURCES.constellationLines),
      fetchJSON(SOURCES.stars),
      fetchJSON(SOURCES.constellationNames),
    ]);

    console.log(`\nLoaded ${linesData.features.length} constellation line sets`);
    console.log(`Loaded ${starsData.features.length} stars`);
    console.log(`Loaded ${namesData.features.length} constellation definitions`);

    // Build constellation name lookup
    const constellationInfo = {};
    for (const feature of namesData.features) {
      const { id, name, desig, rank } = feature.properties;
      constellationInfo[id] = { name, desig, rank };
    }

    // Process all stars into a flat array with screen coordinates
    const allStars = [];
    const namedStarsMap = {};

    for (const feature of starsData.features) {
      const [ra, dec] = feature.geometry.coordinates;
      const { id, name, mag, bv } = feature.properties;

      const screenPos = raDecToScreen(ra, dec);
      const star = {
        id: Math.round(id),
        name: name || null,
        ra,
        dec,
        x: screenPos.x,
        y: screenPos.y,
        magnitude: mag,
        bv,
        spectral: bvToSpectral(bv),
      };

      allStars.push(star);

      // Index named stars
      if (name) {
        namedStarsMap[name] = star;
      }
    }

    // Process constellation lines and extract unique star positions
    const constellations = {};

    for (const feature of linesData.features) {
      const { id } = feature.properties;
      const info = constellationInfo[id] || { name: id, desig: id };

      // Extract line segments from MultiLineString
      const lines = [];
      const starPositions = new Map(); // key: "ra,dec" -> { ra, dec, x, y }

      if (feature.geometry.type === 'MultiLineString') {
        for (const lineCoords of feature.geometry.coordinates) {
          const linePoints = [];
          for (const [ra, dec] of lineCoords) {
            const screen = raDecToScreen(ra, dec);
            const point = { ra, dec, x: screen.x, y: screen.y };
            linePoints.push(point);

            // Track unique positions (constellation vertex stars)
            const key = `${ra.toFixed(4)},${dec.toFixed(4)}`;
            if (!starPositions.has(key)) {
              starPositions.set(key, point);
            }
          }
          lines.push(linePoints);
        }
      }

      // Find the closest catalog star for each constellation vertex
      const constellationStars = [];
      for (const pos of starPositions.values()) {
        // Find nearest star in catalog
        let nearest = null;
        let minDist = Infinity;

        for (const star of allStars) {
          const dx = star.ra - pos.ra;
          const dy = star.dec - pos.dec;
          const dist = dx * dx + dy * dy;
          if (dist < minDist) {
            minDist = dist;
            nearest = star;
          }
        }

        if (nearest && minDist < 1) { // Within 1 degree
          constellationStars.push({
            ...nearest,
            // Use exact constellation vertex position for line drawing
            lineX: pos.x,
            lineY: pos.y,
          });
        }
      }

      constellations[id] = {
        id,
        name: info.name,
        designation: info.desig,
        rank: info.rank,
        stars: constellationStars,
        lines,
      };
    }

    // Create output data structure
    const outputData = {
      metadata: {
        source: 'Celestial Data Project (dieghernan/celestial_data)',
        license: 'CC BY 4.0',
        generatedAt: new Date().toISOString(),
        totalConstellations: Object.keys(constellations).length,
        totalStars: allStars.length,
      },
      constellations,
      // Include bright stars (mag < 4) for background rendering
      brightStars: allStars.filter(s => s.magnitude < 4),
      // Include all named stars
      namedStars: allStars.filter(s => s.name),
    };

    // Ensure directory exists
    mkdirSync(DATA_DIR, { recursive: true });

    // Write output file
    writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(`\n✓ Saved constellation data to ${OUTPUT_FILE}`);

    // Print summary
    console.log('\nConstellation summary:');
    const sorted = Object.values(constellations)
      .sort((a, b) => (a.rank || 99) - (b.rank || 99))
      .slice(0, 15);

    for (const c of sorted) {
      console.log(`  ${c.id}: ${c.name} - ${c.stars.length} stars, ${c.lines.length} line segments`);
    }
    console.log('  ...');

    console.log(`\nBright stars (mag < 4): ${outputData.brightStars.length}`);
    console.log(`Named stars: ${outputData.namedStars.length}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
