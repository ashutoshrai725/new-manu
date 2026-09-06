import { useState } from 'react';
import { Linkedin, Twitter, Instagram, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const FoundersSection = () => {
    const [expandedFounders, setExpandedFounders] = useState({});

    const toggleExpand = (index) => {
        setExpandedFounders(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const founders = [
        {
            name: "Ashutosh Rai",
            role: "Founder",
            image: "https://i.postimg.cc/9fXFrFYW/ashutoshrai.png",
            quote: "Empowering MSMEs with the right technology isn’t just business...it’s how economies grow and nations move forward",
            bio: `I believe in understanding problems at their deepest level and then building solutions that solve the entire challenge in a simple, intuitive, and user friendly way. From a very young age, I’ve been deeply fascinated by technology...not just using digital systems, but exploring how they actually work beneath the surface.

I’ve always enjoyed diving into emerging technologies and studying how they can disrupt existing industries and create entirely new ecosystems. When I talk about building ecosystems, that’s where ManuDocs comes into the picture. Along with my co-founder, I’m building ManuDocs to create a unified trade ecosystem that connects every stakeholder involved in global trade, while eliminating delays, fragmentation, and manual workflows.


I strongly believe that the backbone of any nation’s economy lies in its MSMEs, businesses, and enterprises that export globally...bringing foreign capital into the country and strengthening the value of its currency. Empowering these businesses with the right technology is key to sustainable economic growth.

My approach to problem solving has always been rooted in first understanding the problem completely identifying root causes, mapping workflows end-to-end, and then applying technology in a structured and meaningful way. This philosophy led to the creation of ManuDocs’ agentic workflows — systems designed to seamlessly connect government portals, agencies, banks, exporters, importers, buyers, sellers, logistics providers, and documentation processes into a single, intelligent, unified flow.

I believe that with deep research, clear thinking, and the right technological advancements, every complex problem can be broken down and solved step by step. ManuDocs is a reflection of that belief.`,
            socials: {
                linkedin: "https://www.linkedin.com/in/ashutoshrai725/",
                twitter: "https://x.com/AshutoshRa77518",
                instagram: "https://www.instagram.com/a5hutoshrai/",
                email: "ashutoshrai7205@gmail.com"
            },
            photoPosition: "right"
        },
    ];

    return (
        <section id="our_founders" className="py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Meet the Team Behind ManuDocs
                    </h2>
                    <p className="text-base md:text-lg text-gray-400">
                        "Designing the unified infrastructure behind global trade."
                    </p>
                </div>

                {/* Individual founder cards */}
                <div className="space-y-10">
                    {founders.map((founder, index) => {
                        const isExpanded = expandedFounders[index];
                        const paragraphs = founder.bio.split('\n\n');

                        return (
                            <div
                                key={index}
                                className={`relative rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 
                                    ${index % 2 === 0
                                        ? 'bg-gradient-to-br from-pink-200/95 via-pink-300/85 to-pink-200/95'
                                        : 'bg-gradient-to-br from-rose-200/95 via-rose-300/85 to-rose-200/95'}
                                    shadow-2xl overflow-hidden`}
                            >
                                {/* Decorative stars */}
                                <div className={`absolute ${index % 2 === 0 ? 'top-6 right-6' : 'bottom-6 left-6'} opacity-50`}>
                                    <div className={`${index % 2 === 0 ? 'text-blue-400' : 'text-green-400'} text-3xl`}>
                                        {index % 2 === 0 ? '✦' : '✧'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                                    {/* Left Column - Photo & Quote */}
                                    <div className={`lg:col-span-4 ${founder.photoPosition === 'right' ? 'lg:order-2 lg:ml-6' : 'lg:order-1 lg:ml-4'}`}>
                                        {/* Quote */}
                                        <h3 className="text-xl md:text-xl font-serif font-bold text-gray-900 mb-4 leading-snug">
                                            "{founder.quote}"
                                        </h3>

                                        {/* Photo */}
                                        <div className="relative w-52 h-52 mx-auto lg:mx-0 mb-4">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white p-2 shadow-xl lg:ml-12">
                                                <div className="w-full h-full rounded-full overflow-hidden ">
                                                    <img
                                                        src={founder.image}
                                                        alt={founder.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                                                        [Photo]
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Name & Role */}
                                        <div className="text-center lg:text-left lg:ml-16 mb-3">
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                                {founder.name}
                                            </h4>
                                            <p className="text-sm md:text-base text-gray-700 font-medium mb-3">
                                                {founder.role}
                                            </p>

                                            {/* Social Icons */}
                                            <div className="flex items-center justify-center lg:justify-start space-x-2">
                                                {founder.socials.linkedin && (
                                                    <a
                                                        href={founder.socials.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="LinkedIn"
                                                    >
                                                        <Linkedin size={15} className="text-white" />
                                                    </a>
                                                )}
                                                {founder.socials.twitter && (
                                                    <a
                                                        href={founder.socials.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="Twitter"
                                                    >
                                                        <Twitter size={15} className="text-white" />
                                                    </a>
                                                )}
                                                {founder.socials.instagram && (
                                                    <a
                                                        href={founder.socials.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="Instagram"
                                                    >
                                                        <Instagram size={15} className="text-white" />
                                                    </a>
                                                )}
                                                {founder.socials.email && (
                                                    <a
                                                        href={`mailto:${founder.socials.email}`}
                                                        className="w-8 h-8 bg-gray-900 hover:bg-black rounded-full flex items-center justify-center transition-all duration-200"
                                                        aria-label="Email"
                                                    >
                                                        <Mail size={15} className="text-white" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Bio with Read More */}
                                    <div className={`lg:col-span-8 ${founder.photoPosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                                        {/* Bio Content */}
                                        <div className="md:columns-2 md:gap-5 space-y-2.5">
                                            {/* Mobile: Show first para only unless expanded, Desktop: Show all */}
                                            {paragraphs.map((paragraph, pIndex) => (
                                                <p
                                                    key={pIndex}
                                                    className={`text-xs md:text-sm text-gray-800 leading-relaxed text-left break-inside-avoid
                                                        ${!isExpanded && pIndex > 0 ? 'hidden md:block' : ''}`}
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>

                                        {/* Read More Button - Only on mobile when there are multiple paragraphs */}
                                        {paragraphs.length > 1 && (
                                            <div className="md:hidden mt-4 text-center">
                                                <button
                                                    onClick={() => toggleExpand(index)}
                                                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-medium transition-all duration-200 shadow-lg"
                                                >
                                                    <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FoundersSection;
