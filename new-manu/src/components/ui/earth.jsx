import React from 'react';
import { World } from './globe';

const Earth = () => {
    const globeConfig = {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };

    // India-focused global trade connections
    const sampleArcs = [
        {
            order: 1,
            startLat: 28.6139,
            startLng: 77.209,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.3,
            color: "#06b6d4",
        },
        {
            order: 1,
            startLat: 28.6139,
            startLng: 77.209,
            endLat: 51.5072,
            endLng: -0.1276,
            arcAlt: 0.2,
            color: "#3b82f6",
        },
        {
            order: 2,
            startLat: 28.6139,
            startLng: 77.209,
            endLat: 35.6762,
            endLng: 139.6503,
            arcAlt: 0.2,
            color: "#6366f1",
        },
        {
            order: 2,
            startLat: 28.6139,
            startLng: 77.209,
            endLat: 1.3521,
            endLng: 103.8198,
            arcAlt: 0.15,
            color: "#06b6d4",
        },
        {
            order: 3,
            startLat: 28.6139,
            startLng: 77.209,
            endLat: 25.2048,
            endLng: 55.2708,
            arcAlt: 0.1,
            color: "#3b82f6",
        },
        {
            order: 3,
            startLat: 28.6139,
            startLng: 77.209,
            endLat: -33.8688,
            endLng: 151.2093,
            arcAlt: 0.4,
            color: "#6366f1",
        },
        {
            order: 4,
            startLat: 51.5072,
            startLng: -0.1276,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.2,
            color: "#06b6d4",
        },
        {
            order: 4,
            startLat: 35.6762,
            startLng: 139.6503,
            endLat: 37.7749,
            endLng: -122.4194,
            arcAlt: 0.3,
            color: "#3b82f6",
        },
    ];

    return <World data={sampleArcs} globeConfig={globeConfig} />;
};

export default Earth;
