"use client";
import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useSpring } from "@react-spring/web";

export const World = ({ globeConfig, data }) => {
    const canvasRef = useRef(null);
    const pointerInteracting = useRef(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener("resize", onResize);
        onResize();

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.5, // Increased from 3 for better lighting
            mapSamples: 16000,
            mapBrightness: 2.5, // Increased from 1.2 for much brighter map
            baseColor: [0.6, 0.6, 0.7], // Increased from [0.3, 0.3, 0.3] for brighter base
            markerColor: [251 / 255, 200 / 255, 100 / 255], // Brighter markers
            glowColor: [0.3, 0.3, 0.3], // No glow - removes white outline completely
            markers: data
                ? data.map((arc) => ({
                    location: [arc.startLat, arc.startLng],
                    size: 0.1,
                }))
                : [],
            onRender: (state) => {
                // This function will be called on every animation frame
                state.phi = phi + r.get();
                phi += 0.005;

                state.width = width * 2;
                state.height = width * 2;
            },
        });

        setTimeout(() => (canvasRef.current.style.opacity = "1"));
        return () => {
            globe.destroy();
            window.removeEventListener("resize", onResize);
        };
    }, [data, r]);

    return (
        <div
            className="absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]"
        >
            <canvas
                className="h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current =
                        e.clientX - pointerInteractionMovement.current;
                    canvasRef.current.style.cursor = "grabbing";
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current.style.cursor = "grab";
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current.style.cursor = "grab";
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 200,
                        });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.targetTouches[0]) {
                        const delta = e.targetTouches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 100,
                        });
                    }
                }}
            />
        </div>
    );
};
