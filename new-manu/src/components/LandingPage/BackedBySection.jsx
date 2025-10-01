import React from 'react';
import { motion } from 'framer-motion';

const BackedBySection = () => {
    const partners = [
        {
            name: 'IIT MADRAS',
            logo: 'https://i.postimg.cc/CZmcV5vk/iitm.png',
            description: 'NIRF 1 Ranked Institute'
        },
        {
            name: 'BITS Pilani',
            logo: 'https://i.postimg.cc/bG3mjr6t/BITS-Pilani-Logo.png',
            description: 'Premier Engineering Institute'
        },
        {
            name: 'IIT PATNA',
            logo: 'https://i.postimg.cc/qtj1dqmC/IIT-PATNA.jpg',
            description: 'Top Indian Institute of Technology'
        },
        {
            name: 'PIEDS',
            logo: 'https://i.postimg.cc/CB5mM0tz/pieds-logo.jpg',
            description: 'Incubation Program'
        },
        {
            name: 'RKIC',
            logo: 'https://i.postimg.cc/N9FpGtVy/rkic.jpg',
            description: 'Rakesh Kapoor Innovation Centre'
        },
        {
            name: 'IOI',
            logo: 'https://i.postimg.cc/phrqVv7T/IOI-B.jpg',
            description: 'Innovation Centre Bengaluru'
        }
    ];

    // Fallback SVG as a data URL for missing images
    const fallbackImageSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwYjk4MSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1OWY2OSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiPjwvcmVjdD48L3N2Zz4=';

    const handleImageError = (e) => {
        e.target.src = fallbackImageSrc;
        console.warn(`Failed to load logo: ${e.target.alt}`);
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0
        }
    };

    const containerVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0
        }
    };

    return (
        <section className="relative py-16 bg-manu-light  overflow-hidden" id="backed-by">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover opacity-100 "
                autoPlay
                loop
                muted
                playsInline
                src="/videos/hero-video-ship.mp4"
            >
                Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-gradient-to-br from-manu-green via-gray-800 to-manu-dark opacity-70 pointer-events-none"></div>

            {/* Foreground Content */}
            <div className="relative container mx-auto px-4 opacity-80">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-manu-light mb-4  inline-block px-4 py-2 rounded-lg shadow-lg">
                        Backed By
                    </h2>
                    <p className="text-manu-light max-w-2xl mx-auto text-lg  px-3 py-1 rounded">
                        Supported by leading institutions and innovation programs
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={`${partner.name}-${index}`}
                            initial="hidden"
                            whileInView="visible"
                            variants={cardVariants}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gray-200 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group cursor-pointer border border-gray-200"
                        >
                            <div className="mb-6 flex justify-center items-center h-16">
                                <img
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    className="h-16 w-auto max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-manu-dark mb-2 group-hover:text-manu-green transition-colors duration-300">
                                {partner.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {partner.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Additional styling for better visual hierarchy */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        Trusted by leading academic institutions and innovation centers
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default BackedBySection;
