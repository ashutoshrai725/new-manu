import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [activePage, setActivePage] = useState(null);
    const [activeType, setActiveType] = useState(null); // 'company' or 'service'
    const contentRef = useRef(null);

    const handleContactClick = (type) => {
        switch (type) {
            case 'email':
                window.location.href = 'mailto:manudocs.ai@gmail.com';
                break;
            case 'phone':
                window.location.href = 'tel:+918949522947';
                break;
            default:
                break;
        }
    };

    const handleServiceClick = (service) => {
        if (activePage === service && activeType === 'service') {
            setActivePage(null);
            setActiveType(null);
        } else {
            setActivePage(service);
            setActiveType('service');
        }
    };

    const handleCompanyClick = (page) => {
        if (activePage === page && activeType === 'company') {
            setActivePage(null);
            setActiveType(null);
        } else {
            setActivePage(page);
            setActiveType('company');
        }
    };

    useEffect(() => {
        if (activePage && contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activePage]);

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        console.warn('Footer logo failed to load');
    };

    const services = [
        'Import Documentation',
        'Export Documentation',
        'AI Document Processing',
        'Compliance Check'
    ];

    const companyPages = [
        'About Us',
        'Contact Us',
        'Help',
        'Privacy Policy'
    ];

    const otherPages = ['Terms of Service', 'Support'];

    const contactInfo = [
        {
            type: 'email',
            icon: Mail,
            label: 'Email us',
            action: () => handleContactClick('email')
        },
        {
            type: 'phone',
            icon: Phone,
            label: 'Call us',
            action: () => handleContactClick('phone')
        },
        {
            type: 'linkedin',
            icon: Linkedin,
            label: 'LinkedIn',
            action: () => window.open('https://linkedin.com/company/manudocs', '_blank')
        }

    ];

    const companyContent = {
        'About Us': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">About MANUDOCS</h2>
                <p>MANUDOCS is an AI-powered platform revolutionizing global import-export documentation with intelligent automation and compliance solutions.</p>
            </>
        ),
        'Contact Us': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Get in Touch</h2>
                <p>Email: manudocs.ai@gmail.com</p>
                <p>Phone: +91 89495 22947</p>
                <p>phone: +91 7697546063</p>
                <p>phone: +91 9958889387</p>
                <p>phone: +91 6376400524</p>


            </>
        ),
        'Help': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Help Center</h2>
                <p>Find answers to common questions and troubleshooting tips for MANUDOCS users.</p>
            </>
        ),
        'Privacy Policy': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Privacy Policy</h2>
                <p>We are committed to protecting your privacy and data. Read our detailed privacy policy for more information.</p>
            </>
        ),
        'Terms of Service': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Terms of Service</h2>
                <p>Review the terms and conditions governing the use of MANUDOCS platform and services.</p>
            </>
        ),
        'Support': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Support</h2>
                <p>Need assistance? Our support team is here to help with any issues or queries you may have.</p>
            </>
        )
    };

    const serviceContent = {
        'Import Documentation': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Import Documentation</h2>
                <p>Complete, automated solutions for all your import documentation needs to ensure smooth customs clearance and compliance.</p>
            </>
        ),
        'Export Documentation': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Export Documentation</h2>
                <p>Reliable export documentation management to support your global trade operations with accuracy and speed.</p>
            </>
        ),
        'AI Document Processing': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">AI Document Processing</h2>
                <p>Leverage artificial intelligence to extract, validate, and process trade documents efficiently and error-free.</p>
            </>
        ),
        'Compliance Check': (
            <>
                <h2 className="text-xl font-semibold text-manu-green mb-2">Compliance Check</h2>
                <p>Ensure your import-export documents comply with all regulatory standards, reducing risk and delays.</p>
            </>
        )
    };

    return (
        <>
            <footer className="bg-manu-dark text-white py-12" role="contentinfo">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        {/* Logo and Description */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="mb-4">
                                <img
                                    src="https://i.postimg.cc/qhqjBrYN/mnuverse.jpg"
                                    alt="MANUDOCS Logo"
                                    className="h-12 w-auto"
                                    onError={handleImageError}
                                />
                            </div>
                            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
                                AI-Powered Export Documentation platform for global trade.
                                Streamline your import-export processes with intelligent automation.
                            </p>

                            {/* Contact Icons */}
                            <div className="flex space-x-4">
                                {contactInfo.map((contact) => {
                                    const IconComponent = contact.icon;
                                    return (
                                        <button
                                            key={contact.type}
                                            onClick={contact.action}
                                            className="text-manu-green hover:text-green-400 transition-colors duration-200 p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-manu-green focus:ring-opacity-50"
                                            aria-label={contact.label}
                                            title={contact.label}
                                        >
                                            <IconComponent size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-manu-green">
                                Services
                            </h3>
                            <ul className="space-y-3" role="list">
                                {services.map((service, index) => (
                                    <li key={`service-${index}`}>
                                        <button
                                            onClick={() => handleServiceClick(service)}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 text-left focus:outline-none focus:text-white hover:underline"
                                        >
                                            {service}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-manu-green">
                                Company
                            </h3>
                            <ul className="space-y-3" role="list">
                                {companyPages.map((page, index) => (
                                    <li key={`company-${index}`}>
                                        <button
                                            onClick={() => handleCompanyClick(page)}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 text-left focus:outline-none focus:text-white hover:underline"
                                        >
                                            {page}
                                            {page === 'Privacy Policy' && (
                                                <ExternalLink
                                                    size={14}
                                                    className="inline ml-1 opacity-60"
                                                />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-700 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-gray-400 text-sm text-center md:text-left">
                                © {currentYear} MANUDOCS. All rights reserved. Powered by AI and N8N Innovation.
                            </p>

                            {/* Additional links */}
                            <div className="flex space-x-6 text-sm">
                                {otherPages.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handleCompanyClick(page)}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Content area shown below footer */}
            {activePage && (
                <div
                    ref={contentRef}
                    className="bg-gray-900 text-white p-6 max-w-4xl mx-auto my-6 rounded shadow-lg"
                    tabIndex={-1}
                >
                    <button
                        onClick={() => { setActivePage(null); setActiveType(null); }}
                        className="mb-4 text-sm text-manu-green hover:underline focus:outline-none"
                    >
                        &larr; Close
                    </button>
                    {activeType === 'company' && companyContent[activePage]}
                    {activeType === 'service' && serviceContent[activePage]}
                </div>
            )}
        </>
    );
};

export default Footer;
