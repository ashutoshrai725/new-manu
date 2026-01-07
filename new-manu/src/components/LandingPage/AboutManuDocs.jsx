import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Zap,
    Globe,
    Shield,
    TrendingUp,
    Users,
    FileText,
    Lightbulb,
    BarChart,
    Rocket,
    Brain,
    Sparkles,
    Factory,
    Truck,
    Ship,
    Banknote,
    Building2,
    CheckCircle2,
    Cpu,
    Database,
    Network,
    Lock,
    Cloud,
    GitBranch,
    ArrowRight,
    Circle,
    ChevronRight
} from 'lucide-react';

const railSteps = [
    {
        icon: Factory,
        label: 'Factory & Warehouse',
        sub: 'Orders, SKUs, inventory snapshots'
    },
    {
        icon: FileText,
        label: 'Documentation Hub',
        sub: 'Invoices, packing lists, shipping bills'
    },
    {
        icon: Shield,
        label: 'Customs & Compliance',
        sub: 'DGFT, ICEGATE, duties, licences'
    },
    {
        icon: Truck,
        label: 'Logistics & Ports',
        sub: 'Transporters, CFS, terminals'
    },
    {
        icon: Ship,
        label: 'Shipping Line & Bank',
        sub: 'BL, eBRC, remittances'
    },
    {
        icon: Building2,
        label: 'Buyer Delivery',
        sub: 'POD, claims, dispute-free closure'
    }
];

const AboutManuDocs = () => {
    const features = [
        {
            icon: Brain,
            title: 'What is ManuDocs?',
            subtitle: 'India\'s Unified Trade Interface for exports.',
            bullets: [
                'A single digital layer unifying India\'s fragmented import–export ecosystem',
                'Sits above and orchestrates key government trade systems including:',
                'DGFT (IEC, RoDTEP, AA, EPCG, DFIA, e-CoO, e-BRC)',
                'ICEGATE (Shipping Bill, Bill of Entry, e-SANCHIT, EGM / IGM)',
                'ULIP & NLP Marine for shipment, container and port visibility',
                'PCS 1x and port / terminal operating systems (via PCS & NLP)',
                'LDB 2.0 for inland container movement and rail visibility',
                'Product regulatory portals such as FSSAI, APEDA, MPEDA, Spices Board and PQIS',
                'Shipping line, logistics, CFS, ICD and 3PL systems',
                'Buyer, bank and trade finance document workflows',
                'ManuDocs does not replace these systems — it unifies them into one exporter experience'
            ],
            color: 'from-sky-500 to-cyan-400',
            gradient: 'bg-gradient-to-br from-sky-900/20 to-cyan-900/20'
        },
        {
            icon: Target,
            title: 'Our Mission',
            subtitle: 'To make exporting simple, transparent and self-service for Indian MSMEs.',
            bullets: [
                'Unify multiple government portals, logistics systems and private platforms into one interface',
                'Remove documentation complexity and prevent compliance errors before filing',
                'Reduce exporter dependency on agents, runners and informal coordination',
                'Give exporters complete control and real-time visibility over documents and shipments',
                'Enable confidence-based trade by bringing overseas buyers into a shared, transparent workflow',
                'Lower time, cost and operational friction in executing export shipments',
                'Increase MSME participation in global trade through guided, digital-first infrastructure',
                'Support India\'s FTP 2023, Digital India and national export growth objectives'
            ],
            color: 'from-emerald-500 to-green-400',
            gradient: 'bg-gradient-to-br from-emerald-900/20 to-green-900/20'
        },
        {
            icon: Zap,
            title: 'What We Do',
            subtitle: 'Everything required to move a shipment from factory to buyer — on one rail.',
            bullets: [
                'AI-driven export documentation with intelligent data extraction and validation',
                'Auto-preparation and readiness for invoices, packing lists and shipping bills',
                'Product-level and country-specific compliance intelligence',
                'DGFT, ICEGATE and Customs filing readiness with pre-validation',
                'Shipping line discovery, comparison and booking enablement',
                '3PL, inland transport and container movement orchestration (road & rail)',
                'End-to-end shipment and container visibility across ports and destinations',
                'Digital document management including secure e-doc sharing and e-BL where applicable',
                'Buyer collaboration with shared shipment and document visibility',
                'Predictive alerts for delays, demurrage risk, cost overruns and compliance gaps',
                'A single exporter dashboard replacing multiple portals and manual coordination'
            ],
            color: 'from-indigo-500 to-fuchsia-500',
            gradient: 'bg-gradient-to-br from-indigo-900/20 to-fuchsia-900/20'
        }
    ];

    const impactStats = [
        {
            icon: FileText,
            value: '60–80%',
            label: 'Lower Manual Effort',
            description: 'Automation across export documentation & filings',
            color: 'text-cyan-400'
        },
        {
            icon: Shield,
            value: '99%+',
            label: 'Data Accuracy',
            description: 'Pre-validation before Customs & DGFT submission',
            color: 'text-emerald-400'
        },
        {
            icon: TrendingUp,
            value: 'Faster',
            label: 'Clearances',
            description: 'Reduced rejections, delays & follow-ups',
            color: 'text-sky-400'
        },
        {
            icon: Globe,
            value: 'End-to-End',
            label: 'Visibility',
            description: 'Factory → Port → Destination',
            color: 'text-indigo-400'
        }
    ];

    const extraMetrics = [
        {
            label: 'Shipments orchestration ',
            value: '10K+',
            hint: 'Building on real exporter workflows',
            icon: GitBranch,
            color: 'text-cyan-400'
        },
        {
            label: 'System unifying orchestration ',
            value: '12+',
            hint: 'DGFT, ICEGATE, logistics, and banks',
            icon: Network,
            color: 'text-sky-400'
        },
        {
            label: 'Setup time reduction',
            value: '70%',
            hint: 'From weeks of manual setup to days',
            icon: Zap,
            color: 'text-emerald-400'
        }
    ];

    const futureVision = [
        {
            title: 'Unified Trade Infrastructure',
            description:
                'A single digital layer connecting DGFT, ICEGATE, ULIP, ports, shipping lines, logistics providers, banks, and buyers — eliminating fragmentation in Indian exports.',
            icon: Sparkles,
            features: ['Interoperability', 'Real-time sync', 'Standardized protocols']
        },
        {
            title: 'Agentic AI for Exports',
            description:
                'AI that behaves like a digital export manager — guiding exporters step-by-step, predicting delays, flagging compliance risks, and automating decisions.',
            icon: Brain,
            features: ['Predictive analytics', 'Risk assessment', 'Smart recommendations']
        },
        {
            title: 'Trust & Transparency Layer',
            description:
                'Shared real-time visibility for exporters and buyers to build confidence, support advance payments, and reduce disputes through transparent shipment and document access.',
            icon: Users,
            features: ['Role-based access', 'Document sharing', 'Audit trails']
        }
    ];

    const platformFeatures = [
        {
            title: 'Intelligent AI,RAG Automation',
            description: 'AI-powered document processing and compliance checks',
            icon: Cpu,
            color: 'from-cyan-500 to-blue-500'
        },
        {
            title: 'Real-time Personalized Analytics',
            description: 'Live dashboards with predictive insights and reporting',
            icon: BarChart,
            color: 'from-emerald-500 to-green-500'
        },
        {
            title: 'Blockchain Secure Ecosystem',
            description: 'Bank-grade security with encrypted data transmission',
            icon: Lock,
            color: 'from-violet-500 to-purple-500'
        },
        {
            title: 'Cloud & RBAC, ABAC Infrastructure',
            description: 'Scalable platform with 99.9% uptime guarantee',
            icon: Cloud,
            color: 'from-orange-500 to-red-500'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: 'easeOut' }
        }
    };

    const floatVariant = {
        initial: { y: 0 },
        animate: {
            y: -6,
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
            }
        }
    };

    return (
        <section
            id="about"
            className="relative py-16 md:py-24 overflow-hidden min-h-screen bg-slate-950"
        >
            {/* Professional gradient background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            {/* Soft radial highlights */}
            <div className="pointer-events-none absolute -top-40 -right-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

            {/* Subtle grid overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:80px_80px]" />

            {/* Subtle animated network nodes */}
            <div className="pointer-events-none absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-[1px] w-[1px] rounded-full bg-cyan-400/15"
                        initial={{
                            x: Math.random() * 100 + 'vw',
                            y: Math.random() * 100 + 'vh',
                        }}
                        animate={{
                            x: Math.random() * 100 + 'vw',
                            y: Math.random() * 100 + 'vh',
                        }}
                        transition={{
                            duration: 25 + Math.random() * 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* ALL CONTENT GOES HERE - WITH RELATIVE POSITIONING */}
            <div className="relative container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mb-16 md:mb-20 pt-6"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
                        {/* UTI Logo */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                            <div className="relative bg-slate-900/900 border border-slate-700/60 rounded-3xl p-3 backdrop-blur-xl shadow-4xl">
                                <img
                                    src="https://i.postimg.cc/FsJ1rRg6/UTI-logo.jpg"
                                    alt="UTI Logo"
                                    className="w-40 md:w-44 h-auto"
                                />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-50 leading-tight">
                                India&apos;s{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                                    Unified Trade Interface
                                </span>
                            </h1>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Trade Rail Animation */}
                <div className="mb-16 md:mb-20">


                    <div className="relative rounded-3xl border border-slate-700/60 bg-slate-950/80 px-4 py-6 md:px-6 md:py-8 shadow-[0_22px_55px_rgba(8,47,73,0.8)] backdrop-blur-xl overflow-hidden">
                        {/* Glow */}
                        <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-cyan-500/15 to-transparent" />

                        {/* Rail */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="relative"
                        >
                            {/* Header */}
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300 mb-1">
                                        Unified export workflow
                                    </p>
                                    <h4 className="text-lg md:text-xl font-semibold text-slate-50">
                                        One continuous line of sight from first document to final delivery
                                    </h4>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-300">
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
                                        Live milestones
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-6 rounded-full bg-indigo-400/80" />
                                        Multi-party events
                                    </span>
                                </div>
                            </div>

                            {/* Rail Container */}
                            <div className="relative overflow-x-auto">
                                <div className="min-w-[760px] md:min-w-0">
                                    <div className="relative flex items-center py-6">

                                        {/* Rail line */}
                                        <svg
                                            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 w-full pointer-events-none"
                                        >
                                            <defs>
                                                <linearGradient id="rail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#22d3ee" />
                                                    <stop offset="50%" stopColor="#3b82f6" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>

                                            {/* Base rail */}
                                            <line
                                                x1="0"
                                                y1="1"
                                                x2="100%"
                                                y2="1"
                                                stroke="url(#rail-gradient)"
                                                strokeWidth="2"
                                                strokeOpacity="0.35"
                                                strokeDasharray="6 6"
                                            />

                                            {/* Animated highlight */}
                                            <motion.line
                                                x1="0"
                                                y1="1"
                                                x2="100%"
                                                y2="1"
                                                stroke="url(#rail-gradient)"
                                                strokeWidth="2"
                                                strokeDasharray="6 6"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                transition={{ duration: 2.2, ease: 'easeInOut' }}
                                            />

                                            {/* Moving signal */}
                                            <svg className="w-full h-16" viewBox="0 0 100 20" preserveAspectRatio="none">
                                                <motion.line
                                                    x1="0"
                                                    y1="10"
                                                    x2="100"
                                                    y2="10"
                                                    stroke="url(#rail-gradient)"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="6 6"
                                                />
                                                <motion.circle
                                                    r="4"
                                                    cy="20"
                                                    initial={{ cx: -5 }}
                                                    animate={{ cx: 105 }}
                                                    transition={{
                                                        duration: 4,
                                                        ease: 'linear',
                                                        repeat: Infinity
                                                    }}
                                                    fill="#22ee47ff"
                                                />
                                            </svg>

                                        </svg>

                                        {/* Nodes */}
                                        <div className="relative z-10 flex w-full items-start justify-between">
                                            {railSteps.map((step, index) => (
                                                <motion.div
                                                    key={step.label}
                                                    initial={{ opacity: 0, y: 14 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.45,
                                                        delay: index * 0.08,
                                                        ease: 'easeOut'
                                                    }}
                                                    viewport={{ once: true, margin: '-100px' }}
                                                    className="relative flex flex-col items-center text-center px-2"
                                                >
                                                    {/* Node */}
                                                    <motion.div
                                                        whileHover={{ y: -6, scale: 1.06 }}
                                                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                                                        className="mb-3 flex flex-col items-center gap-2"
                                                    >
                                                        <div className="relative">
                                                            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div className="relative w-12 h-12 rounded-2xl bg-slate-950 border border-slate-600 flex items-center justify-center shadow-lg shadow-slate-900/70 hover:border-cyan-400/60 transition-all duration-300">
                                                                <step.icon className="w-5 h-5 text-slate-100 hover:text-cyan-300 transition-colors" />
                                                            </div>
                                                        </div>

                                                        <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse" />
                                                    </motion.div>

                                                    {/* Labels */}
                                                    <div className="mt-2">
                                                        <p className="text-sm font-semibold text-slate-100 mb-1">
                                                            {step.label}
                                                        </p>
                                                        <p className="text-xs text-slate-400 max-w-[150px] mx-auto leading-tight">
                                                            {step.sub}
                                                        </p>
                                                    </div>

                                                    {/* Connector arrow */}
                                                    {index < railSteps.length - 1 && (
                                                        <ChevronRight className="absolute -right-6 top-7 w-5 h-5 text-slate-600" />
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>






                {/* Impact stats */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
                            Our Impact
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base">
                            Built with real exporter workflows, compliance demands, and logistics
                            constraints in mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {impactStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.45,
                                    delay: i * 0.06,
                                    ease: 'easeOut'
                                }}
                                viewport={{ once: true, margin: '-60px' }}
                                whileHover={{
                                    y: -4,
                                    scale: 1.02,
                                    transition: { type: 'spring', stiffness: 220, damping: 18 }
                                }}
                                className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 px-4 py-5 text-center shadow-[0_14px_38px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/60"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/[0.03] to-transparent opacity-80" />
                                <div className="relative flex flex-col items-center gap-1.5">
                                    <div className="mb-3 w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md shadow-slate-900/70">
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-semibold text-slate-50">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-slate-200">
                                        {stat.label}
                                    </div>
                                    <div className="text-[11px] md:text-xs text-slate-400 mt-1">
                                        {stat.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Extra metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                    >
                        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
                            <div className="grid md:grid-cols-3 gap-8">
                                {extraMetrics.map((metric) => (
                                    <div key={metric.label} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
                                            <metric.icon className={`w-6 h-6 ${metric.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-50 mb-1">
                                                {metric.value}
                                            </div>
                                            <div className="text-sm text-slate-300 mb-1">
                                                {metric.label}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {metric.hint}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>



                {/* Vision */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
                            Our Vision
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base">
                            Building India&apos;s digital export backbone for compliant, predictable
                            cross-border trade.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {futureVision.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.08,
                                    ease: 'easeOut'
                                }}
                                viewport={{ once: true, margin: '-60px' }}
                                whileHover={{
                                    y: -5,
                                    transition: { type: 'spring', stiffness: 230, damping: 19 }
                                }}
                                className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/75 px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/65"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50/[0.06] via-transparent to-slate-50/[0.02]" />
                                <div className="relative flex gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-md shadow-slate-900/80 flex-shrink-0">
                                        <v.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-semibold text-slate-50 mb-1.5">
                                            {v.title}
                                        </h4>
                                        <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                                            {v.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {v.features.map((feature, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-slate-800/50 rounded-full text-xs text-slate-200"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>


            </div>
        </section>
    );
};

export default AboutManuDocs;