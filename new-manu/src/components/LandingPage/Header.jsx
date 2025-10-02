import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [infoVisible, setInfoVisible] = useState(null); // 'help' | 'contact' | null
    const profileRef = useRef(null);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setInfoVisible(null); // Hide info on route change
    }, [location.pathname]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isProfileOpen]);

    // Close dropdowns on ESC key
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
                setIsProfileOpen(false);
                setInfoVisible(null);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleNavigation = (path, requiresAuth = false) => {
        if (requiresAuth && !user) {
            navigate('/auth');
        } else {
            navigate(path);
        }
        setIsMenuOpen(false);
        setInfoVisible(null); // Hide info on navigation
    };

    const handleMobileMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsProfileOpen(false);
        setInfoVisible(null);
    };

    const handleProfileToggle = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsMenuOpen(false);
        setInfoVisible(null);
    };

    const handleLogout = async () => {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        setInfoVisible(null);
        await onLogout();
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        console.warn('Header logo failed to load');
    };

    const getUserDisplayName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    // Toggle info box display on Help and Contact Us button click
    const handleHelpClick = () => {
        setInfoVisible(prev => (prev === 'help' ? null : 'help'));
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    const handleContactClick = () => {
        setInfoVisible(prev => (prev === 'contact' ? null : 'contact'));
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    return (
        <>
            <header className="fixed top-2 left-10 right-10  max-w-6xl mx-auto bg-blur/90 backdrop-blur-md z-50 shadow-sm rounded-3xl border opacity-80  " onPageChange="bg-manu-dark">
                <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-10 ">
                    <div className="flex justify-between items-center h-12">

                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50 rounded-md p-1"
                            >
                                <img
                                    src="https://i.postimg.cc/qhqjBrYN/mnuverse.jpg"
                                    alt="MANUDOCS Logo"
                                    className="h-8 w-auto rounded-full"
                                    onError={handleImageError}
                                />
                                <span className="text-lg font-black text-manu-green hover:text-manu-light tracking-tight opacity-100">
                                    ManuDocs
                                </span>
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={() => handleNavigation('/ai-agent', true)}
                                className={`px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50  ${isActiveRoute('/ai-agent')
                                    ? 'text-manu-dark bg-green-50'
                                    : 'text-manu-light hover:bg-manu-dark hover:text-manu-green'
                                    }`}
                            >
                                Generate Docs
                            </button>



                            <button
                                onClick={() => handleNavigation('/upload', true)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50 ${isActiveRoute('/upload')
                                    ? 'text-manu-dark bg-green-50'
                                    : 'text-manu-light hover:bg-manu-dark hover:text-manu-green'
                                    }`}
                            >
                                Upload Docs
                            </button>

                            <button
                                onClick={handleHelpClick}
                                className="px-3 py-2 rounded-md text-sm font-medium text-manu-light hover:bg-manu-dark hover:text-manu-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50"
                            >
                                Help
                            </button>

                            <button
                                onClick={handleContactClick}
                                className="px-3 py-2 rounded-md text-sm font-medium text-manu-light hover:bg-manu-dark hover:text-manu-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50"
                            >
                                Contact Us
                            </button>
                        </nav>

                        {/* Right Side - Auth or Profile */}
                        <div className="hidden md:block">
                            {!user ? (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="bg-manu-green text-white px-3 py-1 rounded-3xl hover:bg-manu-dark transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                                >
                                    Sign Up / Login
                                </button>
                            ) : (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={handleProfileToggle}
                                        className="flex items-center bg-manu-custom gap-2 text-white px-3 py-1 rounded-3xl hover:bg-manu-green transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                                        aria-expanded={isProfileOpen}
                                        aria-haspopup="true"
                                    >
                                        <div className="w-8 h-8 bg-manu-dark rounded-full flex items-center justify-center">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-manu-dark max-w-32 truncate">
                                            {getUserDisplayName()}
                                        </span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {getUserDisplayName()}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                {user.user_metadata?.phone && (
                                                    <p className="text-xs text-gray-500">{user.user_metadata.phone}</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                                            >
                                                <Settings size={16} />
                                                <span>Profile & Settings</span>
                                            </button>

                                            <hr className="my-1" />

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:bg-red-50"
                                            >
                                                <LogOut size={16} />
                                                <span>Sign out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={handleMobileMenuToggle}
                                className="text-manu-dark hover:text-manu-green p-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50"
                                aria-expanded={isMenuOpen}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1  shadow-lg rounded-lg mt-2 border border-gray-100">
                                <button
                                    onClick={() => handleNavigation('/ai-agent', true)}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/ai-agent')
                                        ? 'text-manu-green bg-green-50'
                                        : 'bg-manu-light hover:text-manu-dark hover:bg-manu-green'
                                        }`}
                                >
                                    Generate Docs
                                </button>



                                <button
                                    onClick={() => handleNavigation('/upload', true)}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/upload')
                                        ? 'text-manu-green bg-green-500'
                                        : 'bg-manu-light hover:text-manu-dark hover:bg-manu-green'
                                        }`}
                                >
                                    Upload Docs
                                </button>

                                <button
                                    onClick={handleHelpClick}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-manu-dark bg-manu-light hover:text-manu-dark hover:bg-manu-green transition-colors duration-200"
                                >
                                    Help
                                </button>

                                <button
                                    onClick={handleContactClick}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-manu-dark bg-manu-light hover:text-manu-dark hover:bg-manu-green transition-colors duration-200"
                                >
                                    Contact Us
                                </button>

                                {/* Mobile Auth Section */}
                                <div className="border-t border-gray-200 pt-2 mt-2 bg">
                                    {!user ? (
                                        <button
                                            onClick={() => handleNavigation('/auth')}
                                            className="block w-full text-left px-3 py-2 bg-manu-green text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors duration-200"
                                        >
                                            Sign Up / Login
                                        </button>
                                    ) : (
                                        <div>
                                            <div className="px-3 py-2 gap-2 bg-manu-dark rounded-lg mb-2">
                                                <p className="text-sm font-medium text-manu-light  truncate rounded-lg px-2 py-1">
                                                    {getUserDisplayName()}
                                                </p>
                                                <p className="text-xs text-manu-light  truncate rounded-lg px-2 py-1">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="block w-full text-left px-3 py-2 text-sm text-manu-dark bg-manu-light hover:text-manu-dark hover:bg-manu-green transition-colors duration-200 rounded-lg font-medium"
                                            >
                                                Profile & Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-3 py-2 text-sm text-manu-dark bg-manu-light hover:text-manu-dark hover:bg-manu-green transition-colors duration-200 rounded-lg font-medium mt-2"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Info box displayed below header */}
            {infoVisible === 'help' && (
                <div className="fixed top-16 left-0 right-0 bg-manu-green text-white p-4 z-40 text-center text-sm font-semibold">
                    <p>To get started.. sign up/login first.</p>
                    <p>Then upload your documents.</p>
                    <p>Then you can start generating your documents using the generate documents option.</p>
                </div>
            )}

            {infoVisible === 'contact' && (
                <div className="fixed top-16 left-0 right-0 bg-manu-green text-white p-4 z-40 text-center text-sm font-semibold space-y-1">
                    <p>Email: manudocs.ai@gmail.com</p>
                    <p>Phone: +91 89495 22947</p>
                    <p>Phone: +91 7697546063</p>
                    <p>Phone: +91 9958889387</p>
                    <p>Phone: +91 6376400524</p>
                </div>
            )}
        </>
    );
};

export default Header;
