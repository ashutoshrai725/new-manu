import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MessageCircle, FileText, Edit3 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Header from '../LandingPage/Header';
import { generateDocuments } from '../LandingPage/TemplateEngine';
import { ITEM_DATABASE } from './itemDatabase';

// Initialize Supabase client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY
);

const AIAgentPage = ({ user, onPageChange, onLogout, documentsUploaded = true }) => {
    // State management
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState('loading');
    const [initialized, setInitialized] = useState(false);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [companyData, setCompanyData] = useState(null);
    const [userInputs, setUserInputs] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [awaitingInput, setAwaitingInput] = useState(false);
    const [generatedDocuments, setGeneratedDocuments] = useState([]);
    const [activeDocIndex, setActiveDocIndex] = useState(0);
    const [manualFillRequired, setManualFillRequired] = useState(false);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Product entry states
    const [productEntryStep, setProductEntryStep] = useState(0);
    const [currentProduct, setCurrentProduct] = useState({
        item: '',
        description: '',
        hsCode: '',
        quantity: '',
        unitPrice: ''
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    // Refs for auto-scroll
    const messagesEndRef = useRef(null);

    // Storage key for persistence
    const storageKey = useMemo(() => `manudocs.aiagent.chat.${user?.id || 'guest'}`, [user?.id]);

    // Unique ID generator to avoid duplicate keys
    const generateUniqueId = useCallback(() => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Questions configuration
    const questions = useMemo(() => [
        { field: 'buyer_company', question: 'What is the buyer\'s company name?', type: 'text' },
        { field: 'buyer_address', question: 'What is the buyer\'s complete address with country?', type: 'textarea' },
        { field: 'products', question: 'Please add your products one by one.', type: 'products' },
        { field: 'currency', question: 'What currency would you like to use?', type: 'select', options: ['USD', 'EUR', 'INR', 'GBP'] },
        { field: 'port_loading', question: 'Which is the Port of Loading?', type: 'text' },
        { field: 'port_discharge', question: 'Which is the Port of Discharge?', type: 'text' },
        { field: 'transport_mode', question: 'What is the mode of transport?', type: 'select', options: ['Sea', 'Air', 'Road'] },
    ], []);

    // Load saved chat state on mount or when user changes
    useEffect(() => {
        const loadSavedState = () => {
            try {
                const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
                if (raw) {
                    const saved = JSON.parse(raw);
                    if (saved) {
                        setMessages(saved.messages || []);
                        setCurrentStep(saved.currentStep || 'loading');
                        setInitialized(Boolean(saved.initialized));
                        setSelectedTemplates(saved.selectedTemplates || []);
                        setCompanyData(saved.companyData || null);
                        setUserInputs(saved.userInputs || {});
                        setCurrentQuestion(saved.currentQuestion || 0);
                        setAwaitingInput(Boolean(saved.awaitingInput));
                        setGeneratedDocuments(saved.generatedDocuments || []);
                        setActiveDocIndex(saved.activeDocIndex || 0);
                        setManualFillRequired(Boolean(saved.manualFillRequired));
                        setShowContinueButton(Boolean(saved.showContinueButton));
                        setProductEntryStep(saved.productEntryStep || 0);
                        setCurrentProduct(saved.currentProduct || {
                            item: '',
                            description: '',
                            hsCode: '',
                            quantity: '',
                            unitPrice: ''
                        });
                        setShowSuggestions(Boolean(saved.showSuggestions));
                        setFilteredItems(saved.filteredItems || []);
                        setProducts(saved.products || []);
                        setIsSendingEmail(Boolean(saved.isSendingEmail));
                    }
                }
            } catch (error) {
                console.warn('Error loading saved chat state:', error);
            }
        };

        loadSavedState();
    }, [storageKey]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                setTimeout(() => {
                    messagesEndRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                    });
                }, 300);
            }
        };

        scrollToBottom();

        if (window.innerWidth <= 768) {
            setTimeout(scrollToBottom, 500);
        }
    }, [messages]);

    // Save chat state whenever significant pieces change
    useEffect(() => {
        const saveState = () => {
            try {
                const stateToSave = {
                    messages,
                    currentStep,
                    initialized,
                    selectedTemplates,
                    companyData,
                    userInputs,
                    currentQuestion,
                    awaitingInput,
                    generatedDocuments,
                    activeDocIndex,
                    manualFillRequired,
                    showContinueButton,
                    productEntryStep,
                    currentProduct,
                    showSuggestions,
                    filteredItems,
                    products,
                    isSendingEmail
                };
                if (typeof window !== 'undefined') {
                    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
                }
            } catch (error) {
                console.warn('Error saving chat state:', error);
            }
        };

        saveState();
    }, [
        messages,
        currentStep,
        initialized,
        selectedTemplates,
        companyData,
        userInputs,
        currentQuestion,
        awaitingInput,
        generatedDocuments,
        activeDocIndex,
        manualFillRequired,
        showContinueButton,
        productEntryStep,
        currentProduct,
        showSuggestions,
        filteredItems,
        products,
        isSendingEmail,
        storageKey
    ]);

    // Complete data collection
    const completeDataCollection = useCallback(async () => {
        console.log('completeDataCollection called - starting document generation');

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'bot',
            content: '🎉 All information collected!\n\nGenerating your documents now...\n\n📄 Templates will be populated with:\n✅ Company data (auto-filled)\n✅ Your provided information\n✅ Professional formatting',
            timestamp: new Date()
        }]);

        setCurrentStep('generating');

        // Generate templates using the engine
        try {
            const generatedDocs = generateDocuments(selectedTemplates, companyData, userInputs);
            setGeneratedDocuments(generatedDocs);

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: generateUniqueId(),
                    type: 'bot',
                    content: '✅ Documents generated successfully!\n\nYou can preview and download them from the right panel.',
                    timestamp: new Date(),
                    showDownloadButton: true
                }]);
                setCurrentStep('completed');
            }, 3000);
        } catch (error) {
            console.error('Template generation error:', error);
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: '❌ Error generating documents. Please try again.',
                timestamp: new Date()
            }]);
        }
    }, [selectedTemplates, companyData, userInputs, generateUniqueId]);

    // Ask questions one by one
    const askNextQuestion = useCallback(() => {
        console.log('askNextQuestion called - currentQuestion:', currentQuestion, 'questions length:', questions.length);

        if (currentQuestion >= questions.length) {
            console.log('🎉 All questions completed, calling completeDataCollection');
            completeDataCollection();
            return;
        }

        const question = questions[currentQuestion];
        console.log('Asking question:', question.field, 'type:', question.type);

        if (question.field === 'products') {
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: `Let's add your products one by one. Start typing the item name below.`,
                timestamp: new Date(),
                showInput: true,
                inputType: 'products',
                expectedField: 'products'
            }]);
            setAwaitingInput(true);
            return;
        }

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'bot',
            content: `${currentQuestion + 1}/${questions.length} - ${question.question}`,
            timestamp: new Date(),
            showInput: true,
            inputType: question.type,
            inputOptions: question.options,
            expectedField: question.field
        }]);
        setAwaitingInput(true);
    }, [currentQuestion, questions, completeDataCollection, generateUniqueId]);

    // Handle continue button click
    const handleContinueClick = useCallback(() => {
        console.log('Continue button clicked, starting questions');
        setShowContinueButton(false);
        setCurrentStep('data_collection');
        setCurrentQuestion(0);
        setAwaitingInput(false);

        setTimeout(() => {
            askNextQuestion();
        }, 100);
    }, [askNextQuestion]);

    // Enhanced useEffect to handle question flow
    useEffect(() => {
        console.log('useEffect - currentStep:', currentStep, 'currentQuestion:', currentQuestion, 'awaitingInput:', awaitingInput);

        const isStuck = currentStep === 'data_collection' &&
            currentQuestion === 0 &&
            !awaitingInput &&
            selectedTemplates.length > 0 &&
            companyData;

        if (isStuck) {
            console.log('🔄 Detected stuck state after navigation, auto-recovering...');
            const timer = setTimeout(() => {
                askNextQuestion();
            }, 200);
            return () => clearTimeout(timer);
        }

        if (currentStep === 'data_collection' && !awaitingInput && currentQuestion >= questions.length) {
            console.log('✅ All questions completed, triggering document generation');
            const timer = setTimeout(() => {
                completeDataCollection();
            }, 100);
            return () => clearTimeout(timer);
        }

        if (currentStep === 'data_collection' && !awaitingInput && currentQuestion < questions.length) {
            console.log('✅ Conditions met for asking question');
            const timer = setTimeout(() => {
                askNextQuestion();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [currentStep, currentQuestion, awaitingInput, askNextQuestion, questions.length, selectedTemplates, companyData, completeDataCollection]);

    // Detect when user navigates away and comes back
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('📱 User returned to page, checking state...');

                if (currentStep === 'data_collection' &&
                    currentQuestion === 0 &&
                    !awaitingInput &&
                    selectedTemplates.length > 0 &&
                    companyData) {

                    console.log('🚨 Auto-recovering from navigation stuck state');

                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            id: generateUniqueId(),
                            type: 'bot',
                            content: '👋 Welcome back! Continuing with your questions...',
                            timestamp: new Date()
                        }]);

                        setAwaitingInput(false);
                        askNextQuestion();
                    }, 500);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [currentStep, currentQuestion, awaitingInput, selectedTemplates, companyData, askNextQuestion, generateUniqueId]);

    // Initialize the chat on component mount
    useEffect(() => {
        if (initialized) return;

        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved?.initialized) {
                    setInitialized(true);
                    return;
                }
            }
        } catch (_e) { }

        if (!documentsUploaded) {
            setMessages([{
                id: 1,
                type: 'bot',
                content: '⚠️ Please upload your identity and company documents first to use the AI Agent.',
                timestamp: new Date(),
                showUploadButton: true
            }]);
            setCurrentStep('need_documents');
            setInitialized(true);
            return;
        }

        setTimeout(() => {
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    content: 'Hello! Welcome to ManuDocs AI Agent! 🤖\n\nI can help you generate professional export documents.',
                    timestamp: new Date()
                },
                {
                    id: 2,
                    type: 'bot',
                    content: 'Which documents would you like to generate?',
                    timestamp: new Date(),
                    showTemplateSelector: true
                }
            ]);
            setCurrentStep('template_selection');
            setInitialized(true);
        }, 1000);

    }, [documentsUploaded, initialized, storageKey]);

    const fetchCompanyData = async () => {
        try {
            setManualFillRequired(false);
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: '🔄 Fetching your company information...',
                timestamp: new Date()
            }]);

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .limit(1);

            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                console.log('No user profile found for user:', user.id);
                setManualFillRequired(true);
                setMessages(prev => [...prev, {
                    id: generateUniqueId(),
                    type: 'bot',
                    content: 'We could not find your company information. Please fill it manually below.',
                    manualFill: true,
                    timestamp: new Date()
                }]);
                setShowContinueButton(true);
                return null;
            }

            const profileData = data[0];
            setCompanyData(profileData);

            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: `✅ Company info loaded:\n\n• Company: ${profileData.company_name}\n• Address: ${profileData.comp_reg_address}\n\nClick "Continue" to proceed with the questions.`,
                timestamp: new Date(),
                showContinueButton: true
            }]);
            setShowContinueButton(true);
            return profileData;

        } catch (error) {
            console.error('Supabase fetch error:', error);
            setManualFillRequired(true);
            setMessages(prev => [...prev, {
                id: generateUniqueId(),
                type: 'bot',
                content: 'We could not retrieve your company information automatically. Please fill it manually below.',
                manualFill: true,
                timestamp: new Date()
            }]);
            setShowContinueButton(true);
            return null;
        }
    }

    // Handle template selection
    const handleTemplateSelection = async () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selected = Array.from(checkboxes).map(cb => ({
            id: cb.value,
            name: cb.getAttribute('data-name')
        }));

        if (selected.length === 0) {
            alert('Please select at least one document to generate');
            return;
        }

        setSelectedTemplates(selected);
        setMessages(prev => [...prev,
        {
            id: generateUniqueId(),
            type: 'user',
            content: `Selected: ${selected.map(t => t.name).join(', ')}`,
            timestamp: new Date()
        }
        ]);

        await fetchCompanyData();
    };

    // Handle manual form submission
    const handleManualFormSubmit = () => {
        if (!companyData?.company_name || !companyData?.comp_reg_address) {
            alert('Please fill in both company name and address');
            return;
        }

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: `Company: ${companyData.company_name}\nAddress: ${companyData.comp_reg_address}`,
            timestamp: new Date()
        }]);

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'bot',
            content: `✅ Company info saved:\n\n• Company: ${companyData.company_name}\n• Address: ${companyData.comp_reg_address}\n\nClick "Continue" to proceed with the questions.`,
            timestamp: new Date(),
            showContinueButton: true
        }]);

        setManualFillRequired(false);
        setShowContinueButton(true);
    };

    // Handle user input
    const handleUserInput = useCallback((inputValue, field) => {
        console.log('handleUserInput called - field:', field, 'value:', inputValue);

        setUserInputs(prev => ({
            ...prev,
            [field]: inputValue
        }));

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        }]);

        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.showInput && msg.expectedField === field
                    ? { ...msg, showInput: false, inputDisabled: true, userAnswer: inputValue }
                    : msg
            )
        );

        setAwaitingInput(false);
        setCurrentQuestion(prev => {
            const newQuestion = prev + 1;
            console.log('📈 Moving from question', prev, 'to', newQuestion);
            return newQuestion;
        });

    }, [generateUniqueId]);

    const downloadAllPdfs = async () => {
        if (generatedDocuments.length === 0) {
            alert("No documents generated to download.");
            return;
        }
        for (const doc of generatedDocuments) {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-9999px';
            container.innerHTML = doc.html;
            document.body.appendChild(container);

            const canvas = await html2canvas(container, { scale: 2 });
            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${doc.name || 'Document'}.pdf`);
        }
    };

    const sendPdfViaEmail = async () => {
        if (generatedDocuments.length === 0) {
            alert("No documents generated to send.");
            return;
        }

        setIsSendingEmail(true);

        try {
            const userEmail = user?.email || user?.user_metadata?.email || 'unknown@example.com';
            console.log('Generating combined PDF and sending via email webhook for user:', userEmail);

            const pdf = new jsPDF('p', 'pt', 'a4');
            let currentPage = 0;

            for (let i = 0; i < generatedDocuments.length; i++) {
                const doc = generatedDocuments[i];
                const container = document.createElement('div');
                container.style.position = 'fixed';
                container.style.left = '-9999px';
                container.style.width = '794px';
                container.style.padding = '20px';
                container.style.backgroundColor = 'white';
                container.innerHTML = doc.html;
                document.body.appendChild(container);

                const canvas = await html2canvas(container, {
                    scale: 1.5,
                    useCORS: true,
                    allowTaint: true,
                    width: 794,
                    windowWidth: 794
                });

                document.body.removeChild(container);
                const imgData = canvas.toDataURL('image/jpeg', 0.7);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                if (currentPage > 0) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
                pdf.setFontSize(12);
                pdf.setTextColor(100);
                pdf.text(`Document: ${doc.name || 'Untitled'}`, 40, 30);
                pdf.text(`Page ${currentPage + 1}`, pdfWidth - 60, 30);
                currentPage++;
            }

            const pdfArrayBuffer = pdf.output('arraybuffer');
            const uint8Array = new Uint8Array(pdfArrayBuffer);
            let binaryString = '';
            const chunkSize = 8192;

            for (let i = 0; i < uint8Array.length; i += chunkSize) {
                const chunk = uint8Array.subarray(i, i + chunkSize);
                binaryString += String.fromCharCode.apply(null, chunk);
            }

            const pdfBase64 = btoa(binaryString);
            const pdfDataArray = [{
                filename: `Export_Documents_${new Date().toISOString().split('T')[0]}.pdf`,
                base64Data: pdfBase64,
                mimetype: 'application/pdf',
                size: pdfArrayBuffer.byteLength,
                documentType: 'combined',
                documentName: 'All Export Documents'
            }];

            const webhookUrl = 'https://snobbily-tombless-louisa.ngrok-free.dev/webhook/60c9760c-650d-471c-9d4f-e7d4e362980f';
            const payload = {
                action: 'send_email',
                userEmail: userEmail,
                documents: generatedDocuments.map(doc => ({
                    name: doc.name,
                    type: doc.type,
                    content: doc.content
                })),
                pdfFiles: pdfDataArray,
                companyData: companyData,
                userInputs: userInputs,
                timestamp: new Date().toISOString(),
                documentCount: generatedDocuments.length,
                isCombined: true
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                alert(`✅ ${generatedDocuments.length} documents combined and sent successfully via email!`);
                console.log('Successfully sent combined PDF to webhook');
            } else {
                console.error('Webhook response error:', response.status, response.statusText);
                alert('❌ Failed to send documents via webhook. Check console for details.');
            }
        } catch (error) {
            console.error('Error sending combined PDF via webhook:', error);
            if (error.name === 'AbortError') {
                alert('❌ Request timed out. Please try again.');
            } else {
                alert('❌ Error sending documents. Check console for details.');
            }
        } finally {
            setIsSendingEmail(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header
                user={user}
                onPageChange={onPageChange}
                onLogout={onLogout}
                documentsUploaded={documentsUploaded}
            />



            <div className="pt-16 h-screen flex flex-col md:flex-row">
                {/* Left Panel - Chat Interface */}
                <div className="w-full md:w-1/2 bg-gray-800 border-r border-gray-700 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-700 bg-gray-900">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <MessageCircle className="text-manu-green" size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold">E-CHA</h3>
                                <p className="text-sm opacity-90">Export Document Assistant</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                    ? 'bg-manu-green text-white'
                                    : 'bg-gray-700 text-gray-100'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{message.content}</div>

                                    {/* Manual fill form */}
                                    {message.manualFill && manualFillRequired && (
                                        <div className="manual-fill-form p-4 border border-gray-600 rounded bg-gray-700 mt-4">
                                            <input
                                                type="text"
                                                placeholder="Company Name"
                                                value={companyData?.company_name || ''}
                                                onChange={(e) =>
                                                    setCompanyData((prev) => ({ ...prev, company_name: e.target.value }))
                                                }
                                                className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-600 text-white placeholder-gray-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Company Address"
                                                value={companyData?.comp_reg_address || ''}
                                                onChange={(e) =>
                                                    setCompanyData((prev) => ({ ...prev, comp_reg_address: e.target.value }))
                                                }
                                                className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-600 text-white placeholder-gray-400"
                                            />
                                            <button
                                                onClick={handleManualFormSubmit}
                                                className="w-full bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                            >
                                                Submit Company Details
                                            </button>
                                        </div>
                                    )}

                                    {/* Continue Button */}
                                    {message.showContinueButton && showContinueButton && (
                                        <button
                                            onClick={handleContinueClick}
                                            className="mt-3 bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Continue to Questions
                                        </button>
                                    )}

                                    {/* Upload Documents Button */}
                                    {message.showUploadButton && (
                                        <button
                                            onClick={() => onPageChange('upload')}
                                            className="mt-3 bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Upload Documents
                                        </button>
                                    )}

                                    {/* Template Selector */}
                                    {message.showTemplateSelector && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm font-medium text-gray-200 mb-2">
                                                Select documents to generate:
                                            </p>

                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    { id: 'commercial_invoice', name: 'Commercial Invoice', desc: 'Main export invoice' },
                                                    { id: 'proforma_invoice', name: 'Proforma Invoice', desc: 'Quotation document' },
                                                    { id: 'packing_list', name: 'Packing List', desc: 'Item packaging details' },
                                                    { id: 'delivery_challan', name: 'Delivery Challan', desc: 'Export shipment details' },
                                                    { id: 'credit_note', name: 'Credit Note', desc: 'Amount adjustment' },
                                                    { id: 'debit_note', name: 'Debit Note', desc: 'Additional charges' }
                                                ].map((template) => (
                                                    <label key={template.id} className="flex items-center space-x-2 p-2 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            value={template.id}
                                                            data-name={template.name}
                                                            className="text-manu-green"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm text-white">📄 {template.name}</div>
                                                            <div className="text-xs text-gray-400">{template.desc}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>

                                            <button
                                                className="w-full mt-3 bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                onClick={handleTemplateSelection}
                                            >
                                                Generate Selected Documents
                                            </button>
                                        </div>
                                    )}

                                    {/* Input Fields for Questions */}
                                    {message.showInput && awaitingInput && (
                                        <div className="mt-4">
                                            {message.inputType === 'text' && (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your answer..."
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                e.preventDefault();
                                                                handleUserInput(e.target.value.trim(), message.expectedField);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            const input = e.target.previousElementSibling;
                                                            if (input.value.trim()) {
                                                                handleUserInput(input.value.trim(), message.expectedField);
                                                                input.value = '';
                                                            }
                                                        }}
                                                        className="w-full bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                    >
                                                        Send Answer
                                                    </button>
                                                </div>
                                            )}

                                            {message.inputType === 'textarea' && (
                                                <div className="space-y-2">
                                                    <textarea
                                                        placeholder="Enter complete address..."
                                                        rows="3"
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.ctrlKey && e.target.value.trim()) {
                                                                e.preventDefault();
                                                                handleUserInput(e.target.value.trim(), message.expectedField);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    ></textarea>
                                                    <button
                                                        onClick={(e) => {
                                                            const textarea = e.target.previousElementSibling;
                                                            if (textarea.value.trim()) {
                                                                handleUserInput(textarea.value.trim(), message.expectedField);
                                                                textarea.value = '';
                                                            }
                                                        }}
                                                        className="w-full bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                    >
                                                        Send Answer
                                                    </button>
                                                    <p className="text-xs text-gray-400">Press Ctrl+Enter or click button</p>
                                                </div>
                                            )}

                                            {message.inputType === 'select' && (
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {message.inputOptions?.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => handleUserInput(option, message.expectedField)}
                                                                className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-sm hover:border-manu-green text-white"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {message.inputType === 'products' && awaitingInput && (
                                                <div className="space-y-2 mt-4">
                                                    {showSuggestions && filteredItems.length > 0 && (
                                                        <div className="border border-gray-600 rounded bg-gray-700 shadow-md max-h-48 overflow-y-auto z-10 mb-2">
                                                            {filteredItems.map(item => (
                                                                <div
                                                                    key={item.hsCode}
                                                                    className="p-2 hover:bg-manu-green hover:text-white cursor-pointer"
                                                                    onClick={() => {
                                                                        setCurrentProduct({
                                                                            item: item.name,
                                                                            description: item.description,
                                                                            hsCode: item.hsCode,
                                                                            quantity: '',
                                                                            unitPrice: ''
                                                                        });
                                                                        setShowSuggestions(false);
                                                                    }}
                                                                >
                                                                    <div className="font-semibold text-white">{item.name}</div>
                                                                    <div className="text-xs text-gray-300">{item.description}</div>
                                                                    <div className="text-xs text-blue-400">HS Code: {item.hsCode}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <input
                                                        type="text"
                                                        placeholder="Type item name to search..."
                                                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                                                        value={currentProduct.item}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            setShowSuggestions(val.length > 0);
                                                            const filtered = val.length > 0
                                                                ? ITEM_DATABASE.filter(item =>
                                                                    item.name.toLowerCase().includes(val.toLowerCase()) ||
                                                                    item.description.toLowerCase().includes(val.toLowerCase())
                                                                )
                                                                : [];
                                                            setFilteredItems(filtered);
                                                            setCurrentProduct(prev => ({ ...prev, item: val }));
                                                        }}
                                                        autoFocus
                                                    />

                                                    {currentProduct.description && (
                                                        <div className="mt-2 p-2 bg-gray-600 border border-gray-500 rounded">
                                                            <div className="text-white"><strong>Description:</strong> {currentProduct.description}</div>
                                                            <div className="text-white"><strong>HS Code:</strong> {currentProduct.hsCode}</div>
                                                        </div>
                                                    )}

                                                    {currentProduct.description && (
                                                        <>
                                                            <input
                                                                type="number"
                                                                placeholder="Quantity"
                                                                className="w-full p-2 border border-gray-600 rounded-lg mt-2 bg-gray-700 text-white placeholder-gray-400"
                                                                value={currentProduct.quantity}
                                                                onChange={e => setCurrentProduct(prev => ({ ...prev, quantity: e.target.value }))}
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Unit Price"
                                                                className="w-full p-2 border border-gray-600 rounded-lg mt-2 bg-gray-700 text-white placeholder-gray-400"
                                                                value={currentProduct.unitPrice}
                                                                onChange={e => setCurrentProduct(prev => ({ ...prev, unitPrice: e.target.value }))}
                                                            />
                                                        </>
                                                    )}

                                                    {(currentProduct.item && currentProduct.quantity && currentProduct.unitPrice) && (
                                                        <div className="flex gap-2 mt-3">
                                                            <button
                                                                className="flex-1 bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                                onClick={() => {
                                                                    const newProduct = { ...currentProduct };
                                                                    setProducts(prev => [...prev, newProduct]);
                                                                    const productSummary = `Added: ${newProduct.item} | Qty: ${newProduct.quantity} | Price: ${newProduct.unitPrice}`;
                                                                    setMessages(prev => [...prev, {
                                                                        id: generateUniqueId(),
                                                                        type: 'user',
                                                                        content: productSummary,
                                                                        timestamp: new Date()
                                                                    }]);
                                                                    setCurrentProduct({ item: '', description: '', hsCode: '', quantity: '', unitPrice: '' });
                                                                    setShowSuggestions(false);
                                                                    setFilteredItems([]);
                                                                    setTimeout(() => {
                                                                        const searchInput = document.querySelector('input[placeholder="Type item name to search..."]');
                                                                        if (searchInput) searchInput.focus();
                                                                    }, 100);
                                                                }}
                                                            >
                                                                Add Product & Continue Adding
                                                            </button>

                                                            <button
                                                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                                onClick={() => {
                                                                    let finalProducts = [...products];
                                                                    if (currentProduct.item && currentProduct.quantity && currentProduct.unitPrice) {
                                                                        finalProducts.push({ ...currentProduct });
                                                                    }
                                                                    if (finalProducts.length === 0) {
                                                                        alert("Please add at least one product before finishing.");
                                                                        return;
                                                                    }
                                                                    setUserInputs(prev => ({
                                                                        ...prev,
                                                                        products: finalProducts
                                                                    }));
                                                                    const productsSummary = `Added ${finalProducts.length} product(s):\n${finalProducts.map((p, i) => `${i + 1}. ${p.item} - Qty: ${p.quantity} @ ${p.unitPrice}`).join('\n')}`;
                                                                    setMessages(prev => [...prev, {
                                                                        id: generateUniqueId(),
                                                                        type: 'user',
                                                                        content: productsSummary,
                                                                        timestamp: new Date()
                                                                    }]);
                                                                    setMessages(prevMessages =>
                                                                        prevMessages.map(msg =>
                                                                            msg.showInput && msg.expectedField === 'products'
                                                                                ? { ...msg, showInput: false, inputDisabled: true, userAnswer: `Added ${finalProducts.length} product(s)` }
                                                                                : msg
                                                                        )
                                                                    );
                                                                    setCurrentProduct({ item: '', description: '', hsCode: '', quantity: '', unitPrice: '' });
                                                                    setShowSuggestions(false);
                                                                    setFilteredItems([]);
                                                                    setProducts([]);
                                                                    setAwaitingInput(false);
                                                                    setCurrentQuestion(prev => prev + 1);
                                                                }}
                                                            >
                                                                Finish Adding Products ({products.length + (currentProduct.item && currentProduct.quantity && currentProduct.unitPrice ? 1 : 0)})
                                                            </button>
                                                        </div>
                                                    )}

                                                    {products.length > 0 && (
                                                        <div className="mt-4 p-3 bg-gray-600 border border-gray-500 rounded">
                                                            <h4 className="font-semibold mb-2 text-white">Products Added ({products.length}):</h4>
                                                            {products.map((product, index) => (
                                                                <div key={index} className="text-sm border-b border-gray-500 pb-2 mb-2 last:border-b-0">
                                                                    <div className="text-white"><strong>{product.item}</strong></div>
                                                                    <div className="text-gray-300">Qty: {product.quantity} | Unit Price: {product.unitPrice}</div>
                                                                    {product.description && <div className="text-xs text-gray-400">{product.description}</div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {message.inputDisabled && (
                                        <div className="mt-4 p-3 bg-gray-600 border border-gray-500 rounded-lg">
                                            <div className="text-sm text-gray-300 mb-1">Your answer:</div>
                                            <div className="text-sm font-medium text-white">
                                                ✓ {message.userAnswer}
                                            </div>
                                        </div>
                                    )}

                                    {message.showDownloadButton && (
                                        <div className="flex flex-col gap-2 mt-3">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                onClick={downloadAllPdfs}
                                            >
                                                📥 Download Documents
                                            </button>
                                            <button
                                                className={`px-4 py-2 text-white rounded flex items-center justify-center gap-2 ${isSendingEmail ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                                    } text-sm`}
                                                onClick={sendPdfViaEmail}
                                                disabled={isSendingEmail}
                                            >
                                                <MessageCircle size={16} />
                                                {isSendingEmail ? 'Sending...' : 'Send via Email'}
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-xs opacity-70 mt-2 text-gray-400">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {!awaitingInput && (
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-manu-green"
                                />
                                <button className="bg-manu-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Template Preview */}
                <div className="w-full md:w-1/2 bg-gray-800 flex flex-col">
                    {/* Preview Header */}
                    <div className="p-4 border-b border-gray-700 bg-gray-900">
                        <div className="flex items-center space-x-3">
                            <FileText className="text-manu-green" size={20} />
                            <div>
                                <h3 className="font-semibold text-white">Document Preview</h3>
                                <p className="text-sm text-gray-400">Live preview of your documents</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 p-4">
                        {currentStep === 'template_selection' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {[
                                            { icon: '📄', name: 'Invoice' },
                                            { icon: '📋', name: 'Proforma' },
                                            { icon: '📦', name: 'Packing' },
                                            { icon: '🚛', name: 'Challan' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600">
                                                <div className="text-2xl mb-2">{item.icon}</div>
                                                <div className="text-sm font-medium text-white">{item.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        Choose your documents from the chat panel
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 'data_collection' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white text-xl">📝</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Collecting Information
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </p>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'generating' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <span className="text-white text-xl">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Generating Documents...
                                    </h3>
                                    <p className="text-gray-400">
                                        Please wait while we create your professional export documents
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 'completed' && (
                            <div className="bg-gray-700 rounded-lg p-6 shadow-sm h-full flex flex-col">
                                <div className="flex gap-3 mb-3">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                                        onClick={downloadAllPdfs}
                                    >
                                        <FileText size={16} />
                                        Download All PDFs
                                    </button>

                                    <button
                                        className={`px-4 py-2 text-white rounded flex items-center gap-2 ${isSendingEmail
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        onClick={sendPdfViaEmail}
                                        disabled={isSendingEmail}
                                    >
                                        <MessageCircle size={16} />
                                        {isSendingEmail ? 'Sending...' : 'Send via Email'}
                                    </button>

                                    <button
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        <Edit3 size={16} />
                                        {isEditing ? 'Save Edits' : 'Edit Text'}
                                    </button>
                                </div>

                                {generatedDocuments.length > 1 && (
                                    <div className="flex space-x-2 border-b border-gray-600 pb-2 mb-3">
                                        {generatedDocuments.map((doc, i) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => setActiveDocIndex(i)}
                                                className={`px-4 py-1 rounded-t ${activeDocIndex === i ? 'bg-manu-green text-white' : 'bg-gray-600 text-gray-300'} text-sm font-semibold`}
                                            >
                                                {doc.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex-1 overflow-auto" style={{ minHeight: 500 }}>
                                    {generatedDocuments.length > 0 && (
                                        <div className="document-preview-container relative">
                                            {isEditing ? (
                                                <div
                                                    className="editable-document p-6 border-2 border-purple-400 rounded-lg bg-white"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => {
                                                        const editedHtml = e.currentTarget.innerHTML;
                                                        const updatedDocuments = [...generatedDocuments];
                                                        updatedDocuments[activeDocIndex] = {
                                                            ...updatedDocuments[activeDocIndex],
                                                            html: editedHtml
                                                        };
                                                        setGeneratedDocuments(updatedDocuments);
                                                    }}
                                                    style={{
                                                        minHeight: '500px',
                                                        outline: 'none',
                                                        fontFamily: 'Arial, Helvetica, sans-serif !important'
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `<div style="font-family: Arial, Helvetica, sans-serif !important">${generatedDocuments[activeDocIndex]?.html}</div>`
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="document-html-preview p-6 border border-gray-600 rounded-lg bg-white"
                                                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `<div style="font-family: Arial, Helvetica, sans-serif !important; font-size: 12px;">${generatedDocuments[activeDocIndex]?.html}</div>`
                                                    }}
                                                />
                                            )}

                                            {isEditing && (
                                                <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">
                                                    ✏️ Click any text to edit
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {generatedDocuments.length === 0 && (
                                        <div className="text-gray-400">No preview available.</div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="mt-4 p-4 bg-gray-600 border border-gray-500 rounded-lg">
                                        <h4 className="font-semibold mb-2 text-white">Quick Edit Tools</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                                onClick={() => document.execCommand('bold', false, null)}
                                            >
                                                <strong>B</strong>
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                                onClick={() => document.execCommand('italic', false, null)}
                                            >
                                                <em>I</em>
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                                onClick={() => document.execCommand('underline', false, null)}
                                            >
                                                <u>U</u>
                                            </button>
                                            <select
                                                className="px-2 py-1 border border-gray-500 rounded text-sm bg-gray-700 text-white"
                                                onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
                                            >
                                                <option value="">Size</option>
                                                <option value="1">Small</option>
                                                <option value="3">Medium</option>
                                                <option value="5">Large</option>
                                                <option value="7">X-Large</option>
                                            </select>
                                            <select
                                                className="px-2 py-1 border border-gray-500 rounded text-sm bg-gray-700 text-white"
                                                onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
                                            >
                                                <option value="">Color</option>
                                                <option value="#000000">Black</option>
                                                <option value="#FF0000">Red</option>
                                                <option value="#0000FF">Blue</option>
                                                <option value="#008000">Green</option>
                                            </select>
                                            <button
                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                onClick={() => {
                                                    const editableDiv = document.querySelector('.editable-document');
                                                    if (editableDiv) {
                                                        const updatedDocuments = [...generatedDocuments];
                                                        updatedDocuments[activeDocIndex] = {
                                                            ...updatedDocuments[activeDocIndex],
                                                            html: editableDiv.innerHTML
                                                        };
                                                        setGeneratedDocuments(updatedDocuments);
                                                        setIsEditing(false);
                                                    }
                                                }}
                                            >
                                                Save & Exit
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAgentPage;