import React from 'react';
import backgroundImage from '../assets/images/home.jpg';

interface HeroProps {
    title?: string;
    subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({ title = "MNZL Movies", subtitle = "Place where users post their movie list recommendations for all tastes." }) => {
    return (
        <div
            className="relative bg-cover bg-center h-96 flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="relative z-10 text-center text-white p-6 max-w-2xl mx-auto">
                <h1 className="text-5xl font-extrabold mb-4">{title}</h1>
                <p className="text-2xl font-light">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

export default Hero;
