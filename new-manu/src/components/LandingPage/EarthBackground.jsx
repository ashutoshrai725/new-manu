import React from "react";
import Earth from "../ui/earth";

const EarthBackground = () => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center" style={{ marginTop: '60px' }}>
            <Earth />
        </div>
    );
};

export default EarthBackground;
