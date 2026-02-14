





import React, { useState, useEffect, useRef } from 'react';
import LandingLayout from '../components/LandingLayout';
import { addDemoRequest, getActiveCalendlyConfig } from '../db';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { supabase } from '../supabase';


declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: { url: string, prefill?: any }) => void;
            initInlineWidget: (options: { url: string; parentElement: HTMLElement; prefill?: any; }) => void;
        };
    }
}

// --- Internal Components for Demo Page ---

const CalendlyModal = ({ url, prefill, onClose }: { url: string; prefill: any; onClose: () => void; }) => {
    const calendlyContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (calendlyContainerRef.current && window.Calendly) {
            // Clear any previous widget to prevent duplicates
            calendlyContainerRef.current.innerHTML = ''; 
            window.Calendly.initInlineWidget({
                url: url,
                parentElement: calendlyContainerRef.current,
                prefill: prefill,
            });
        }
    }, [url, prefill]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] relative">
                 <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl z-10"
                    aria-label="Close scheduling window"
                 >
                    &times;
                 </button>
                 <div ref={calendlyContainerRef} className="w-full h-full rounded-lg overflow-hidden">
                    {/* Calendly inline widget will be injected here */}
                 </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
        </div>
    );
};

const BookingConfirmationScreen = () => {
    const { theme } = useTheme();
    const logoLight = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-light.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tbGlnaHQucG5nIiwiaWF0IjoxNzU2NzU2NzkzLCJleHAiOjMzMjkyNzU2NzkzfQ.4sLXHZ9j2o5OpP6lSjYHzGEXYU_-hPkHmZJ1zjETiQI';
    const logoDark = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-dark.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tZGFyay5wbmciLCJpYXQiOjE3NTY3NTY3NjgsImV4cCI6MzMyOTI3NTY3Njh9.XpJbMk19-pJLNUoRSWyNbWDjvn4sUH9CmqOhAyxmzi0';
    const logoSrc = theme === 'light' ? logoLight : logoDark;

    return (
        <div className="py-20">
            <div className="max-w-2xl mx-auto text-center bg-card dark:bg-gray-800/50 rounded-lg shadow-lg p-8 md:p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32">
                    <div className="absolute transform rotate-45 bg-gray-700 text-center text-white font-semibold py-1 right-[-34px] top-[32px] w-[170px]">
                        Powered by Calendly
                    </div>
                </div>
                <img src={logoSrc} alt="Acadeemia Logo" className="h-8 mx-auto mb-6" />
                <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">You are scheduled</h1>
                <p className="mt-2 text-text-secondary dark:text-gray-400">A calendar invitation has been sent to your email address.</p>
                
                <div className="mt-8 border dark:border-gray-700 rounded-lg p-6 text-left max-w-md mx-auto bg-background dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-text-primary dark:text-gray-100 mb-4">Acadeemia Platform Demo Meeting.</h2>
                    <p className="flex items-center text-text-secondary dark:text-gray-400 mb-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg><span>ACADEEMIA</span></p>
                    <p className="flex items-center text-text-secondary dark:text-gray-400 mb-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg><span>Details are in your calendar invitation.</span></p>
                    <p className="flex items-center text-text-secondary dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2-2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg><span>Web conferencing details to follow.</span></p>
                </div>
                
                <Link to="/" className="mt-8 inline-block text-primary hover:underline">
                    → Schedule another event
                </Link>
            </div>
        </div>
    );
};

const FormSubmittedScreen = ({ calendlyConfigured }: { calendlyConfigured: boolean }) => (
    <div className="text-center py-20 px-6">
        <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">Thank You for Your Request!</h2>
        <p className="text-text-secondary dark:text-gray-300 mt-2 max-w-xl mx-auto">
            {calendlyConfigured 
                ? "Please complete the scheduling in the window that has appeared."
                : "A member of our team will contact you shortly to schedule your personalized demo."
            }
        </p>
         <Link to="/" className="mt-6 inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
            Back to Home
        </Link>
    </div>
);


const FAQItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left"
                aria-expanded={isOpen}
            >
                <h3 className="font-bold text-text-primary dark:text-white">{q}</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <p className="text-text-secondary dark:text-gray-400 mt-4">{a}</p>}
        </div>
    );
};

const DemoPage = () => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
    const [calendlyLink, setCalendlyLink] = useState('');
    const [prefillData, setPrefillData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCalendlyEvent = (e: MessageEvent) => {
            if (e.data.event && e.data.event === 'calendly.event_scheduled') {
                setIsCalendlyModalOpen(false);
                setBookingConfirmed(true);
            }
        };
        window.addEventListener('message', handleCalendlyEvent);
        return () => {
            window.removeEventListener('message', handleCalendlyEvent);
        };
    }, []);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const submission = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            institution: formData.get('institution') as string,
            role: formData.get('role') as string,
            interest: formData.get('interested') as string,
            additional_info: formData.get('info') as string,
        };

        try {
            await addDemoRequest(submission);
            
            // Send admin notification
            try {
                const adminEmail = 'admin@acadeemia.com'; // Replace with a real admin email or env variable
                const { error: emailError } = await supabase.functions.invoke('send-email', {
                    body: {
                        to: adminEmail,
                        subject: `New Demo Request from ${submission.name}`,
                        html: `
                            <h2>New Demo Request Received</h2>
                            <p>A new demo request has been submitted on the website.</p>
                            <h3>Details:</h3>
                            <ul>
                                <li><strong>Name:</strong> ${submission.name}</li>
                                <li><strong>Email:</strong> ${submission.email}</li>
                                <li><strong>Phone:</strong> ${submission.phone || 'N/A'}</li>
                                <li><strong>Institution:</strong> ${submission.institution}</li>
                                <li><strong>Role:</strong> ${submission.role}</li>
                                <li><strong>Interested In:</strong> ${submission.interest}</li>
                                <li><strong>Additional Info:</strong> ${submission.additional_info || 'N/A'}</li>
                            </ul>
                            <p>Please follow up with them shortly.</p>
                        `,
                    },
                });
                if (emailError) {
                    console.error("Error sending admin notification email:", emailError);
                    // Non-critical, so we don't show an error to the user
                }
            } catch (e) {
                console.error("Failed to invoke email function:", e);
            }

            const calendlyConfig = await getActiveCalendlyConfig();
            
            setFormSubmitted(true);
            window.scrollTo(0, 0);

            if (calendlyConfig?.scheduling_link && window.Calendly) {
                setCalendlyLink(calendlyConfig.scheduling_link);
                setPrefillData({
                    name: submission.name,
                    email: submission.email,
                    customAnswers: {
                        a1: submission.phone,
                        a2: submission.institution,
                        a3: submission.role,
                        a4: submission.interest,
                        a5: submission.additional_info
                    }
                });
                setIsCalendlyModalOpen(true);
            }
        } catch (err) {
            setError('There was an error submitting your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleScrollToForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formElement = document.getElementById('request-demo-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const demoCredentials = [
        { role: 'ADMIN', user: 'demoadmin@acadeemia.com', pass: 'AcadeemiaDemo' },
        { role: 'TEACHER', user: 'demoteacher@acadeemia.com', pass: 'AcadeemiaDemo' },
        { role: 'STUDENT', user: 'demostudent@acadeemia.com', pass: 'AcadeemiaDemo' },
        { role: 'PARENT', user: 'demoparent@acadeemia.com', pass: 'AcadeemiaDemo' },
        { role: 'ACCOUNTANT', user: 'demoaccountant@acadeemia.com', pass: 'AcadeemiaDemo' },
        { role: 'RECEPTIONIST', user: 'demoreceptionist@acadeemia.com', pass: 'AcadeemiaDemo' },
    ];

    const guidedDemoFeatures = [
        "One-on-one session with product specialists", "Focused on your institution's specific needs", "Opportunity to ask questions in real-time", "Detailed exploration of relevant features",
        "Discussion of customization options", "Implementation and migration insights", "Walkthrough of both SaaS and standalone versions", "Overview of user roles and permissions setup",
        "Guidance on integrating your existing systems and data", "Breakdown of licensing and pricing options", "Advice on best practices for onboarding your staff and users", "Data privacy and backup strategy overview",
        "Support and training resources overview", "Time for feedback and next steps planning", "Demonstration of real-time communication tools (e.g. SMS, WhatsApp)", "Insight into performance tracking and reporting features",
        "Explore financial and fee management tools", "Custom branding, subdomain setup, and white-label options", "Optional language support and localization settings", "Insight into cloud hosting vs on-premise deployment"
    ];

    const demoExperienceFeatures = {
        'Student Management': ["Student profiles and records", "Enrollment and registration", "Attendance tracking", "Academic progress monitoring", "Behavior and discipline tracking", "Health and medical information", "Parent/guardian contact management", "ID card generation and student grouping", "Student promotion and graduation workflows"],
        'Academic Functions': ["Course management", "Curriculum planning", "Grading and assessments", "Exam scheduling and result publishing", "Timetable scheduling", "Homework and assignment tracking", "Syllabus uploading and sharing", "Report cards and transcripts generation", "Online classes and lesson planning"],
        'Administrative Tools': ["Financial management", "Staff management", "Reporting and analytics", "Communication tools", "Document and certificate generation (TCs, letters)", "Asset and inventory management", "Hostel and transport management", "Admission management and online application portal", "Licensing and permission control system"],
    };
    
     const faqs = [
        { q: "How long does the guided demo typically last?", a: "Our personalized demos usually last 45-60 minutes, depending on your questions and areas of interest." },
        { q: "Who should attend the demo from our institution?", a: "We recommend including key decision-makers, IT staff, and representatives from departments that will use the system." },
        { q: "Can we get access to the demo environment after the guided session?", a: "Yes, we provide extended access to the demo environment for your team to explore further." },
        { q: "Is the demo customized to our specific type of institution?", a: "Absolutely! We tailor the demonstration to showcase features most relevant to your institution type (K-12, higher education, vocational, etc.)." },
        { q: "What technical requirements are needed for the interactive demo?", a: "Just a modern web browser (Chrome, Firefox, Safari, or Edge) and an internet connection." },
        { q: "Can we request a demo of specific add-on modules?", a: "Yes, please mention the specific add-ons you're interested in when completing the request form." }
    ];

    const renderContent = () => {
        if (bookingConfirmed) {
            return <BookingConfirmationScreen />;
        }
        if (formSubmitted) {
            return <FormSubmittedScreen calendlyConfigured={!!calendlyLink} />;
        }
        return (
            <>
                <section className="bg-gradient-to-b from-purple-100 to-white dark:from-gray-800/50 dark:to-gray-900 py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-gray-100">Experience Acadeemia in Action</h1>
                        <p className="mt-4 text-lg text-text-secondary dark:text-gray-300 max-w-3xl mx-auto">Try our interactive demos or request a personalized walkthrough tailored to your institution's needs.</p>
                    </div>
                </section>
                <div className="py-20 bg-background dark:bg-gray-900">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-text-primary dark:text-white mb-12">Choose Your Demo Experience</h2>
                        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
                            {/* Interactive Demo Card */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 space-y-6">
                                <h3 className="text-2xl font-bold text-text-primary dark:text-white">Interactive Online Demo</h3>
                                <p className="text-text-secondary dark:text-gray-400">Explore our system immediately with pre-populated sample data. Get hands-on experience with both deployment versions.</p>
                                <div className="space-y-4">
                                    <a href="https://saas.acadeemia.com/saasdemo" target="_blank" rel="noopener noreferrer" className="block p-4 border dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary transition-colors">
                                        <p className="font-semibold text-primary">SaaS Demo</p>
                                        <p className="text-sm text-text-secondary dark:text-gray-400">Experience our cloud-based solution with sample data.</p>
                                        <span className="text-sm font-semibold text-primary mt-2 inline-block">Launch SaaS School Website Demo &rarr;</span>
                                    </a>
                                    <a href="https://selfhost.acadeemia.com" target="_blank" rel="noopener noreferrer" className="block p-4 border dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-primary transition-colors">
                                        <p className="font-semibold text-teal-500">Standalone Demo</p>
                                        <p className="text-sm text-text-secondary dark:text-gray-400">Experience our self-hosted solution with sample data.</p>
                                        <span className="text-sm font-semibold text-teal-500 mt-2 inline-block">Launch Standalone School Website Demo &rarr;</span>
                                    </a>
                                </div>
                                <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-lg text-sm text-text-secondary dark:text-gray-300 space-y-2">
                                    <h4 className="font-bold text-text-primary dark:text-white">Demo Credentials:</h4>
                                    {demoCredentials.map(cred => (
                                        <div key={cred.role}>
                                            <p className="font-semibold">{cred.role}</p>
                                            <p>Username: {cred.user}</p>
                                            <p>Password: {cred.pass}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Guided Demo Card */}
                            <div className="border-2 border-primary rounded-xl p-8 space-y-6">
                                <h3 className="text-2xl font-bold text-text-primary dark:text-white">Personalized Guided Demo</h3>
                                <p className="text-text-secondary dark:text-gray-400">Schedule a live demonstration with our product specialists tailored to your institution's specific requirements.</p>
                                <ul className="space-y-2 text-text-secondary dark:text-gray-300">
                                    {guidedDemoFeatures.slice(0, 6).map(feature => (
                                        <li key={feature} className="flex items-start"><span className="text-primary mr-2">&#8594;</span> {feature}</li>
                                    ))}
                                    <li className="font-semibold text-primary">... and many more!</li>
                                </ul>
                                <button onClick={handleScrollToForm} className="w-full text-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors block">Request Guided Demo</button>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-center text-text-primary dark:text-white mb-12">What You'll Experience in the Demo</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-6">
                            {Object.entries(demoExperienceFeatures).map(([category, features]) => (
                                <div key={category} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                                    <h3 className="font-bold text-lg text-text-primary dark:text-white mb-4">{category}</h3>
                                    <ul className="space-y-2 text-sm text-text-secondary dark:text-gray-400">
                                        {features.map(feature => <li key={feature} className="flex items-start"><span className="text-primary mr-2">&#8594;</span>{feature}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-text-secondary dark:text-gray-400 mb-20">Note: Demo environments contain sample data to help you visualize how the system works with real information.</p>
                        <div id="request-demo-form" className="max-w-4xl mx-auto bg-card dark:bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 md:col-span-2">Request a Personalized Demo</h2>
                                <p className="text-text-secondary dark:text-gray-400 md:col-span-2 -mt-4">Fill out the form below and our team will contact you to schedule a customized demonstration.</p>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name*</label>
                                    <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address*</label>
                                    <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution Name*</label>
                                    <input type="text" id="institution" name="institution" required className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Role*</label>
                                    <select id="role" name="role" required className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option>Select your role</option><option>Administrator</option><option>Principal / Headmaster</option><option>IT Director</option><option>Teacher</option><option>Other</option></select>
                                </div>
                                <div>
                                    <label htmlFor="interested" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interested In*</label>
                                    <select id="interested" name="interested" required className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option>Select an option</option><option>SaaS (Cloud-Based)</option><option>Standalone (Self-Hosted)</option><option>Not Sure</option></select>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="info" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Information</label>
                                    <textarea id="info" name="info" rows={4} placeholder="Tell us about your institution's specific needs or any questions you have..." className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"></textarea>
                                </div>
                                {error && <p className="text-sm text-red-500 md:col-span-2">{error}</p>}
                                <div className="md:col-span-2">
                                    <button type="submit" disabled={loading} className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-75">
                                        {loading ? 'Submitting...' : 'Schedule My Demo'}
                                    </button>
                                    <p className="text-xs text-center mt-3 text-text-secondary dark:text-gray-500">By submitting this form, you agree to our privacy policy and terms of service.</p>
                                </div>
                            </form>
                        </div>

                        <div className="pt-20">
                            <h2 className="text-3xl font-bold text-center text-text-primary dark:text-white mb-12">Frequently Asked Questions</h2>
                            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                                {faqs.map(faq => (
                                    <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <LandingLayout>
            {isCalendlyModalOpen && calendlyLink && (
                <CalendlyModal 
                    url={calendlyLink} 
                    prefill={prefillData}
                    onClose={() => setIsCalendlyModalOpen(false)} 
                />
            )}
            {renderContent()}
        </LandingLayout>
    );
};

export default DemoPage;