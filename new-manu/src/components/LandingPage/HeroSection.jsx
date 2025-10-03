import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = ({ isMobile, user }) => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isMobile) {
                // For mobile, try to play with muted and playsInline
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch((error) => {
                    console.log('Mobile video play failed:', error);
                    setIsPlaying(false);
                });
            } else {
                // For desktop
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    }, [isMobile]);

    const toggleVideo = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    };

    const handleSearchClick = () => {
        if (user) navigate('/ai-agent');
        else {
            setShowAuthPrompt(true);
            setTimeout(() => {
                navigate('/auth');
                setShowAuthPrompt(false);
            }, 1500);
        }
    };

    const handleNavigation = (path, requiresAuth = false) => {
        if (requiresAuth && !user) navigate('/auth');
        else navigate(path);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchClick();
    };

    const getUserDisplayName = () => user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const fallback = e.target.parentElement.querySelector('.e-cha-fallback');
        if (fallback) fallback.style.display = 'flex';
    };
    const closeAuthPrompt = () => setShowAuthPrompt(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    };
    const rightSideVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
    };
    const floatingAnimation = {
        animate: { y: [0, -10, 0] },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    };

    return (
        <section className="relative min-h-screen w-full bg-manu-light" id="backed-by">
            {/* Background Video */}
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
                autoPlay
                loop
                muted
                playsInline
                src="/videos/hero-video-ship.mp4"
            >
                Your browser does not support the video tag.
            </video>

            {/* Video Controls for Mobile */}
            {isMobile && (
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={toggleVideo}
                        className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-manu-dark via-gray-800 to-manu-green opacity-60"></div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen w-full px-4 py-4 lg:py-12">
                {/* Left Side */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex-1 max-w-full lg:max-w-xl w-full text-white space-y-4 mt-12 lg:mt-0"
                >
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-manu-green/20 border border-manu-green/30 rounded-lg p-3 mb-2"
                        >
                            <p className="text-manu-green text-xs font-medium">
                                👋 Welcome back, {getUserDisplayName()}!
                            </p>
                        </motion.div>
                    )}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold leading-snug break-words max-w-full">
                        AI-Powered<br />
                        <span className="text-manu-green">Export Documentation</span><br />
                        for Global Trade
                    </h1>
                    <p className="text-sm md:text-base lg:text-sm xl:text-base text-gray-200 max-w-full lg:max-w-md lg:ml-10 leading-relaxed">
                        Transform your export documentation process with AI. Upload invoices, extract data automatically, and generate professional export documents in minutes.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 pt-6 w-full max-w-md justify-center items-center lg:ml-10">
                        {/* 100% */}
                        <div className="flex flex-col items-center lg:items-start flex-1 min-w-[80px]">
                            <div className="text-lg md:text-xl lg:text-lg xl:text-xl font-bold text-white mb-1">100%</div>
                            <div className="text-xs md:text-sm lg:text-xs xl:text-sm text-gray-300">Accuracy Rate</div>
                        </div>
                        {/* 3 Min */}
                        <div className="flex flex-col items-center lg:items-start flex-1 min-w-[80px]">
                            <div className="text-lg md:text-xl lg:text-lg xl:text-xl font-bold text-white mb-1">3 Min</div>
                            <div className="text-xs md:text-sm lg:text-xs xl:text-sm text-gray-300">Avg. Processing</div>
                        </div>
                        {/* 1000+ */}
                        <div className="flex flex-col items-center lg:items-start flex-1 min-w-[80px]">
                            <div className="text-lg md:text-xl lg:text-lg xl:text-xl font-bold text-white mb-1 lg:mt-6">1000+</div>
                            <div className="text-xs md:text-sm lg:text-xs xl:text-sm text-gray-300">Documents Generated</div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-6 lg:ml-10">
                        <button
                            onClick={() => handleNavigation('/upload', true)}
                            className="bg-gradient-to-r from-manu-green to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg w-full sm:w-auto flex-1 text-base"
                        >
                            {user ? 'Upload Documents' : 'Get Started Free'}
                        </button>

                        <button
                            onClick={() => handleNavigation('/ai-agent', true)}
                            className="bg-gradient-to-r from-manu-green to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg w-full sm:w-auto flex-1 text-base"
                        >
                            {user ? 'Generate Documents' : 'Watch Demo'}
                        </button>
                    </div>
                </motion.div>

                {/* Right Side */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={rightSideVariants}
                    className="flex-1 w-full flex justify-center lg:justify-end py-6 lg:py-0"
                >
                    <div className="relative flex flex-col items-center w-full max-w-[280px] md:max-w-sm lg:max-w-md lg:mr-10 lg:mt-12">
                        <motion.div
                            animate={floatingAnimation.animate}
                            transition={floatingAnimation.transition}
                            className="relative w-full flex justify-center"
                        >
                            <img
                                src="https://i.postimg.cc/XJbWW8k4/e0chaaigent.png"
                                alt="E-CHA AI Agent"
                                className="w-full max-w-[280px] md:max-w-[320px] lg:max-w-[350px] h-auto object-contain drop-shadow-2xl opacity-80 rounded-3xl"
                                onError={handleImageError}
                                loading="eager"
                            />
                            <div className="e-cha-fallback hidden w-full h-[250px] md:h-[300px] bg-gradient-to-br from-manu-green to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                                <div className="text-white text-center">
                                    <div className="text-4xl mb-3">🤖</div>
                                    <div className="text-lg font-bold">E-CHA</div>
                                    <div className="text-xs opacity-80">AI Agent</div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-black/50 backdrop-blur-md rounded-full p-2 shadow-2xl mb-10 border border-manu-green"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Search className="text-manu-green flex-shrink-0" size={16} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={user ? "Generate Invoice..!" : "Try E-CHA & Generate Docs!!"}
                                            className="flex-1 bg-transparent outline-none text-white placeholder-green-300 text-xs md:text-sm"
                                            onClick={handleSearchClick}
                                            onKeyDown={handleKeyDown}
                                            readOnly
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSearchClick}
                                            className="bg-manu-green text-white p-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                            aria-label="Search or access AI agent"
                                        >
                                            <Search size={14} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Auth Prompt Modal */}
            {showAuthPrompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={closeAuthPrompt}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold text-manu-dark mb-2">
                            Hello! I'm E-CHA
                        </h3>
                        <p className="text-gray-600 mb-6">
                            To help you with document processing, please sign up or log in first.
                        </p>
                        <div className="w-full bg-manu-green h-2 rounded-full animate-pulse mb-4"></div>
                        <p className="text-sm text-gray-500">
                            Redirecting to authentication...
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
};

export default HeroSection;