'use client';

import React from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
    return (
        <div className="App">
            <HexColorPicker color={color} onChange={onChange} />

            <div className="value" style={{ borderLeftColor: color }}>
                Current color is {color}
            </div>

            <div className="buttons">
                <button onClick={() => onChange("#c6ad23")}>Choose gold</button>
                <button onClick={() => onChange("#556b2f")}>Choose green</button>
                <button onClick={() => onChange("#207bd7")}>Choose blue</button>
            </div>
        </div>
    );
};

export default ColorPicker;
