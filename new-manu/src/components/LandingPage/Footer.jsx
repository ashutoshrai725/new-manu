import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const handleContactClick = (type) => {
        switch (type) {
            case 'email':
                window.location.href = 'mailto:support@manudocs.com';
                break;
            case 'phone':
                window.location.href = 'tel:+919876543210';
                break;
            case 'location':
                window.open('https://maps.google.com/?q=Bengaluru,Karnataka,India', '_blank');
                break;
            default:
                break;
        }
    };

    const handleServiceClick = (service) => {
        // You can implement navigation or modal logic here
        console.log(`Navigate to ${service} page`);
        // Example: navigate(`/services/${service.toLowerCase().replace(/\s+/g, '-')}`);
    };

    const handleCompanyClick = (page) => {
        // You can implement navigation or modal logic here
        console.log(`Navigate to ${page} page`);
        // Example: navigate(`/${page.toLowerCase().replace(/\s+/g, '-')}`);
    };

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
            type: 'location',
            icon: MapPin,
            label: 'Find us',
            action: () => handleContactClick('location')
        }
    ];

    return (
        <footer className="bg-manu-dark text-white py-12" role="contentinfo">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <img
                                src="/logos/manudocs_logo.jpg"
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
                        
                        {/* Optional: Add additional links or social media */}
                        <div className="flex space-x-6 text-sm">
                            <button 
                                onClick={() => handleCompanyClick('Terms of Service')}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Terms of Service
                            </button>
                            <button 
                                onClick={() => handleCompanyClick('Support')}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;