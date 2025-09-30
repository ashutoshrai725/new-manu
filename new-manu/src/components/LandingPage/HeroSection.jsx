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

    // Video autoplay handling - SAFE VERSION
    useEffect(() => {
        if (videoRef.current) {
            if (isMobile) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                // Delay to ensure DOM is ready
                const timer = setTimeout(() => {
                    if (videoRef.current) {
                        videoRef.current.play()
                            .then(() => {
                                setIsPlaying(true);
                            })
                            .catch((error) => {
                                console.warn('Video autoplay failed:', error);
                                setIsPlaying(false);
                            });
                    }
                }, 500);

                return () => clearTimeout(timer);
            }
        }
    }, [isMobile]);

    const toggleVideo = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.warn('Video play failed:', error);
                        setIsPlaying(false);
                    });
            }
        }
    };

    const handleSearchClick = () => {
        if (user) {
            // If logged in, go to AI agent
            navigate('/ai-agent');
        } else {
            // If not logged in, show auth prompt
            setShowAuthPrompt(true);
            const timer = setTimeout(() => {
                navigate('/auth');
                setShowAuthPrompt(false);
            }, 1500);

            // Cleanup timer if component unmounts
            return () => clearTimeout(timer);
        }
    };

    const handleNavigation = (path, requiresAuth = false) => {
        if (requiresAuth && !user) {
            navigate('/auth');
        } else {
            navigate(path);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const getUserDisplayName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const fallback = e.target.parentElement.querySelector('.e-cha-fallback');
        if (fallback) {
            fallback.style.display = 'flex';
        }
        console.warn('E-CHA agent image failed to load');
    };

    const closeAuthPrompt = () => {
        setShowAuthPrompt(false);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8 }
        }
    };

    const rightSideVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, delay: 0.2 }
        }
    };

    const floatingAnimation = {
        animate: { y: [0, -10, 0] },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    };

    return (
        <section className="relative h-screen overflow-hidden bg-gradient-to-br from-manu-dark via-gray-800 to-manu-green">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                {!isMobile ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover opacity-30"
                        loop
                        muted
                        playsInline
                        poster="/images/hero-fallback.jpg"
                        onError={() => {
                            console.warn('Hero video failed to load');
                        }}
                    >
                        <source src="/videos/hero-video-ship.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center opacity-30"
                        style={{
                            backgroundImage: 'url(/images/hero-fallback.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                )}

                {/* Video Controls */}
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
            <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-white space-y-6"
                    >
                        {/* Welcome message for logged in users */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-manu-green/20 border border-manu-green/30 rounded-lg p-4 mb-6"
                            >
                                <p className="text-manu-green text-sm font-medium">
                                    👋 Welcome back, {getUserDisplayName()}!
                                </p>
                            </motion.div>
                        )}

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            AI-Powered
                            <br />
                            <span className="text-manu-green">Export Documentation</span>
                            <br />
                            for Global Trade
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
                            Transform your export documentation process with AI. Upload invoices,
                            extract data automatically, and generate professional export documents in minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleNavigation('/upload', true)}
                                className="bg-manu-green text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                            >
                                {user ? 'Upload Documents' : 'Get Started Free'}
                            </button>
                            <button
                                onClick={() => handleNavigation('/ai-agent', true)}
                                className="bg-manu-green text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                            >
                                {user ? 'Generate Documents' : 'Watch Demo'}
                            </button>


                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-manu-green mb-2 -mt-3">100%</div>
                                <div className="text-sm text-gray-300">Accuracy Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-manu-green mb-2 -mt-3">3 Min</div>
                                <div className="text-sm text-gray-300">Avg. Processing</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-manu-green mb-2 -mt-3">1000+</div>
                                <div className="text-sm text-gray-300">Documents Generated</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - E-CHA AI Agent */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={rightSideVariants}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            {/* E-CHA Character */}
                            <motion.div
                                animate={floatingAnimation.animate}
                                transition={floatingAnimation.transition}
                                className="relative"
                            >
                                {/* AI Agent Image */}
                                <img
                                    src="https://i.postimg.cc/sxfmMMsk/20250928-1634-image.png"
                                    alt="E-CHA AI Agent - Your intelligent document processing assistant"
                                    className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
                                    onError={handleImageError}
                                    loading="eager"
                                />

                                {/* Fallback placeholder */}
                                <div className="e-cha-fallback hidden w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-manu-green to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                                    <div className="text-white text-center">
                                        <div className="text-6xl mb-4">🤖</div>
                                        <div className="text-xl font-bold">E-CHA</div>
                                        <div className="text-sm opacity-80">AI Agent</div>
                                    </div>
                                </div>

                                {/* Floating Search Bar */}
                                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-2xl"
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
                                                className="bg-manu-green text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 flex-shrink-0"
                                                aria-label="Search or access AI agent"
                                            >
                                                <Search size={16} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-4 -right-4 w-16 h-16 bg-manu-green/20 rounded-full flex items-center justify-center"
                            >
                                <div className="w-8 h-8 bg-manu-green rounded-full"></div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                            >
                                <div className="w-6 h-6 bg-white rounded-full"></div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-4xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold text-manu-dark mb-2">
                            Hello! I'm E-CHA
                        </h3>
                        <p className="text-gray-600 mb-6">
                            To help you with document processing, please sign up or log in first.
                        </p>
                        <div className="w-full bg-manu-green h-2 rounded-full animate-pulse mb-4"></div>
                        <p className="text-sm text-gray-500">Redirecting to authentication...</p>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
};

export default HeroSection;