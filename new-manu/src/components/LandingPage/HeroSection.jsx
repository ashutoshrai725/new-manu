import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, Pause, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = ({ isMobile, user }) => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    // Ab video background use hi nahi ho raha,
    // agar tu chaahe to yeh pura effect bhi hata sakta hai.
    useEffect(() => {
        if (videoRef.current) {
            if (isMobile) {
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
                videoRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(() => {
                        setIsPlaying(false);
                    });
            } else {
                videoRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }
    }, [isMobile]);

    const toggleVideo = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
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

    const getUserDisplayName = () =>
        user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const fallback = e.target.parentElement.querySelector('.e-cha-fallback');
        if (fallback) fallback.style.display = 'flex';
    };

    const closeAuthPrompt = () => setShowAuthPrompt(false);

    const containerVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    const rightSideVariants = {
        hidden: { opacity: 0, x: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.15,
                ease: 'easeOut',
            },
        },
    };

    const floatingAnimation = {
        animate: {
            y: [0, -8, 0],
        },
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    };

    const textGlowAnimation = {
        animate: {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        },
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
        },
    };

    return (
        <section
            className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden"
            id="backed-by"
            style={{
                backgroundImage: "url('/images/001.jpg')", // Yahan apna image path daal
            }}
        >

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-start min-h-screen w-full px-4 sm:px-6 lg:px-12 py-6 mt-8">

                {/* Left Side - Content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex-1 w-full text-white space-y-4 lg:space-y-6 mt-12 lg:mt-0 lg:pr-4"
                >


                    <div className="space-y-3">
                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight text-left"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.15,
                                    },
                                },
                            }}
                        >
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        },
                                    },
                                }}
                                className="overflow-hidden"
                            >
                                AI-Powered
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    visible: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        },
                                    },
                                }}
                                className="overflow-hidden"
                            >
                                <motion.span
                                    className="text-manu-green bg-manu-green bg-clip-text text-transparent bg-[length:200%_auto]"
                                    animate={textGlowAnimation.animate}
                                    transition={textGlowAnimation.transition}
                                >
                                    Export Documentation
                                </motion.span>
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -40 },
                                    visible: {
                                        opacity: 1,
                                        x: 0,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            delay: 0.3,
                                        },
                                    },
                                }}
                                className="overflow-hidden"
                            >
                                for Global Trade
                            </motion.div>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-sm sm:text-base md:text-lg text-gray-200 max-w-lg leading-relaxed lg:ml-8"
                        >

                        </motion.p>
                    </div>



                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 pt-4 justify-start w-full"

                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavigation('/upload', true)}
                            className="group relative bg-manu-green text-white px-6 py-3 rounded-xl font-semibold shadow-lg overflow-hidden min-w-[140px]"
                        >
                            <div className="absolute inset-0 bg-manu-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center justify-center gap-2 text-sm">
                                {user ? 'Upload Documents' : 'Get Started Free'}
                                <ArrowRight
                                    size={16}
                                    className="group-hover:translate-x-1 transition-transform duration-300"
                                />
                            </span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNavigation('/ai-agent', true)}
                            className="group relative bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 min-w-[140px]"
                        >
                            <span className="flex items-center justify-center gap-2 text-sm">
                                {user ? 'Generate Documents' : 'Watch Demo'}
                                <Play size={14} />
                            </span>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right Side - Video/iframe card */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={rightSideVariants}
                    className="flex-1 w-full flex justify-center lg:justify-end items-center py-6 lg:py-0 lg:pl-4"
                >
                    <div className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm lg:max-w-md">
                        <motion.div
                            animate={floatingAnimation.animate}
                            transition={floatingAnimation.transition}
                            className="relative w-full flex justify-center"
                            onHoverStart={() => setIsHovered(true)}
                            onHoverEnd={() => setIsHovered(false)}
                        >
                            <div className="relative w-full">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: isHovered ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute -inset-4 bg-manu-green rounded-3xl blur-xl"
                                />

                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-manu-green/20 z-10">
                                    <iframe
                                        className="w-full aspect-video"
                                        src="https://www.youtube.com/embed/AKcC0XKgtPM?controls=1&modestbranding=1&rel=0&showinfo=0"
                                        title="ManuDocs Platform Demo"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-6 w-full flex justify-center"
                        >
                            <motion.a
                                href="https://payments.cashfree.com/forms?code=manudocs"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-6 bg-manu-green text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-manu-green/90"
                            >
                                Support Us / Invest in ManuDocs!
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Auth Prompt Modal */}
            <AnimatePresence>
                {showAuthPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeAuthPrompt}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            className="bg-gradient-to-br from-gray-900 to-manu-dark rounded-2xl p-6 text-center max-w-sm mx-4 shadow-2xl border border-manu-green/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-4xl mb-4"
                            >
                                🤖
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Hello! I'm E-CHA
                            </h3>
                            <p className="text-gray-300 mb-4 text-sm">
                                To help you with document processing, please sign up or log in
                                first.
                            </p>
                            <div className="w-full bg-manu-green/30 h-1.5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                                    className="h-full bg-manu-green rounded-full"
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                Redirecting to authentication...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
};

export default HeroSection;
