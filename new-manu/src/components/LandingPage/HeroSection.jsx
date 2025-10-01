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
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                const timer = setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                    }
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [isMobile]);

    const toggleVideo = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            setIsPlaying(!isPlaying);
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
        <section className="relative min-h-screen bg-gradient-to-br from-manu-dark via-gray-800 to-manu-green flex flex-col">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                {!isMobile ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover opacity-45"
                        loop
                        muted
                        playsInline
                        autoPlay
                        poster="/images/hero-fallback.jpg"
                    >
                        <source src="/videos/hero-video-ship.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center opacity-40"
                        style={{
                            backgroundImage: "url('https://i.postimg.cc/14hxdY8M/generated-image-1.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                )}

                {!isMobile && (
                    <button
                        onClick={toggleVideo}
                        className="absolute bottom-4 right-4 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                )}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 w-full flex-1 px-4 py-12 mt-10">
                {/* Left Side */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex-1 max-w-full lg:max-w-2xl w-full text-white space-y-6"
                >
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-manu-green/20 border border-manu-green/30 rounded-lg p-4 mb-3"
                        >
                            <p className="text-manu-green text-sm font-medium">
                                👋 Welcome back, {getUserDisplayName()}!
                            </p>
                        </motion.div>
                    )}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-4xl font-bold leading-tight break-words max-w-full lg:max-w-2xl">
                        AI-Powered<br />
                        <span className="text-manu-green">Export Documentation</span><br />
                        for Global Trade
                    </h1>
                    <p className=" text-sm md:text-base lg:text-sm xl:text-base text-white-300 max-w-full lg:max-w-xl leading-relaxed">
                        Transform your export documentation process with AI. Upload invoices, extract data automatically, and generate professional export documents in minutes.
                    </p>
                    {/* Stats */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 pt-8 w-full max-w-xl justify-center items-center lg:ml-8">
                        {/* 100% */}
                        <div className="flex flex-col items-center lg:items-start flex-1 min-w-[100px]">
                            <div className="text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold text-manu-white mb-1">100%</div>
                            <div className="text-xs md:text-sm lg:text-xs xl:text-sm text-white-300">Accuracy Rate</div>
                        </div>
                        {/* 3 Min */}
                        <div className="flex flex-col items-center lg:items-start flex-1 min-w-[100px]">
                            <div className="text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold text-manu-white mb-1">3 Min</div>
                            <div className="text-xs md:text-sm lg:text-xs xl:text-sm text-white-300">Avg. Processing</div>
                        </div>
                        {/* 1000+ */}
                        <div className="flex flex-col items-center lg:items-start flex-1 min-w-[100px]">
                            <div className="text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold text-manu-white mb-1">1000+</div>
                            <div className="text-xs md:text-sm lg:text-xs xl:text-sm text-white-300">Documents Generated</div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-8 w-full max-w-lg">
                        <button
                            onClick={() => handleNavigation('/upload', true)}
                            className="bg-gradient-to-r from-manu-green to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg w-full sm:w-auto flex-1 lg:ml-12"
                        >
                            {user ? 'Upload Documents' : 'Get Started Free'}
                        </button>

                        <button
                            onClick={() => handleNavigation('/ai-agent', true)}
                            className="bg-gradient-to-r from-manu-green to-green-600 text-white px-6 py-3  rounded-lg hover:from-green-600 hover:to-green-700 font-semibold shadow-lg w-full sm:w-auto flex-1 lg:ml-4"
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
                    className="flex-1 w-full flex justify-center lg:justify-end py-8 lg:py-0 lg:mr-10"
                >
                    <div className="relative flex flex-col items-center w-full max-w-[320px] md:max-w-md">
                        <motion.div
                            animate={floatingAnimation.animate}
                            transition={floatingAnimation.transition}
                            className="relative w-full flex justify-center"
                        >
                            <img
                                src="https://i.postimg.cc/GhffpfzC/generated-image-3.jpg"
                                alt="E-CHA AI Agent"
                                className="w-full max-w-[350px] md:max-w-md-[400px] h-auto object-contain drop-shadow-2xl opacity-80 rounded-3xl mt-5"
                                onError={handleImageError}
                                loading="eager"
                            />
                            <div className="e-cha-fallback hidden w-full h-[320px] md:h-[384px] bg-gradient-to-br from-manu-green to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                                <div className="text-white text-center">
                                    <div className="text-6xl mb-4">🤖</div>
                                    <div className="text-xl font-bold">E-CHA</div>
                                    <div className="text-sm opacity-80">AI Agent</div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/90 backdrop-blur-md rounded-full p-1 shadow-2xl mb-20"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Search className="text-manu-green flex-shrink-0" size={20} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={user ? "Generate invoice..." : "Try E-CHA - Sign up first!"}
                                            className="flex-1 bg-transparent outline-none text-manu-dark placeholder-gray-500 text-sm"
                                            onClick={handleSearchClick}
                                            onKeyDown={handleKeyDown}
                                            readOnly
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSearchClick}
                                            className="bg-manu-green text-white p-3 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                            aria-label="Search or access AI agent"
                                        >
                                            <Search size={16} />
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
