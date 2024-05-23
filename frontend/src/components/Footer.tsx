import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto flex justify-center items-center">
                <div className="text-sm flex items-center space-x-1">
                    <span>© {new Date().getFullYear()} MNZL Movies .</span>
                    <span>Made with</span>
                    <span className="text-red-500">❤️</span>
                    <span>and</span>
                    <span>☕</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
