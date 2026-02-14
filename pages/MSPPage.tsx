import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingLayout from '../components/LandingLayout';

const MSPPage = () => {
  const [emailSubscribe, setEmailSubscribe] = useState('');

  const services = [
    {
      icon: '💻',
      title: 'Workstation Leasing',
      description: 'High-performance desktop computers and workstations leased on flexible terms to meet your institution\'s computing needs.'
    },
    {
      icon: '📱',
      title: 'Laptop Leasing',
      description: 'Portable computing solutions for teachers, administrators, and students with comprehensive support and maintenance.'
    },
    {
      icon: '❤️',
      title: 'Network Infrastructure',
      description: 'Complete network setup, management, and maintenance including routers, switches, and wireless access points.'
    },
    {
      icon: '🖥️',
      title: 'Server Management',
      description: 'Dedicated server hosting, virtualization, and cloud infrastructure management for your critical applications.'
    },
    {
      icon: '☎️',
      title: 'IT Support & Maintenance',
      description: '24/7 technical support, proactive maintenance, and rapid response to ensure minimal downtime.'
    },
    {
      icon: '🔒',
      title: 'Security (CCTV and Biometrics)',
      description: 'Comprehensive security solutions including CCTV surveillance and biometric access control systems for campus safety.'
    }
  ];

  const benefits = [
    { icon: '💰', title: 'Cost-effective leasing options with flexible terms' },
    { icon: '⚙️', title: 'Proactive maintenance and support to minimize disruptions' },
    { icon: '📈', title: 'Scalable solutions that grow with your institution' },
    { icon: '👨‍💼', title: 'Expert IT management by certified professionals' },
    { icon: '💾', title: 'Reduced capital expenditure on IT infrastructure' },
    { icon: '🔄', title: 'Access to latest technology without large upfront costs' },
    { icon: '📋', title: 'Comprehensive warranty and insurance coverage' },
    { icon: '📜', title: 'Customized service level agreements (SLAs)' }
  ];

  return (
    <LandingLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Managed Service Provider (MSP)
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive IT infrastructure management and equipment leasing solutions tailored for educational institutions.
            </p>
          </div>
        </div>

        {/* Our MSP Services Section */}
        <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Our MSP Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-50 dark:bg-gray-800 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Why Choose Our MSP Services?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Focus on education while we handle your IT infrastructure needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-2xl mr-4 flex-shrink-0">{benefit.icon}</span>
                  <p className="text-gray-700 dark:text-gray-300">{benefit.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Streamline Your IT Infrastructure?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Contact our MSP team to discuss your institution's specific requirements and get a customized solution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
              >
                Contact MSP Team
              </Link>
              <Link
                to="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </div>

        
      </div>
    </LandingLayout>
  );
};

export default MSPPage;
