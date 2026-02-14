import React, { useState, useEffect } from 'react';
import LandingLayout from '../components/LandingLayout';
import { supabase } from '../supabase';

const PageHero = () => (
  <div className="bg-gradient-to-br from-primary/10 via-secondary to-primary/5 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-gray-100 mb-4">
        Affiliate Picks
      </h1>
      <p className="text-xl text-text-secondary dark:text-gray-300 max-w-3xl mx-auto mb-6">
        Curated Tools & Resources for Educators
      </p>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-text-secondary dark:text-gray-400 leading-relaxed">
          We've partnered with the best tools and services in the education technology space
          to bring you carefully selected resources that complement Acadeemia's school management platform.
          These are products we trust and recommend to enhance your educational institution's digital ecosystem.
        </p>
      </div>
    </div>
  </div>
);

type AffiliateTool = {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  affiliate_link: string;
  category: string | null;
  display_order: number;
};

const ToolCard = ({ tool }: { tool: AffiliateTool }) => {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full group">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-center h-20 mb-4">
          <img
            src={tool.logo_url}
            alt={`${tool.name} logo`}
            className="max-h-16 max-w-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/150?text=Logo';
            }}
          />
        </div>

        <h3 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-3 text-center group-hover:text-primary transition-colors">
          {tool.name}
        </h3>

        <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed mb-6 flex-grow text-center">
          {tool.description}
        </p>

        <a
          href={tool.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center inline-block transform group-hover:scale-105"
        >
          Visit Tool
        </a>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-card dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="flex items-center justify-center h-20 mb-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

const AffiliatePicksPage = () => {
  const [tools, setTools] = useState<AffiliateTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('affiliate_tools')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (fetchError) throw fetchError;

        setTools(data || []);
      } catch (err) {
        console.error('Error fetching affiliate tools:', err);
        setError('Failed to load tools. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();

    // Set up real-time listener for affiliate_tools changes
    const subscription = supabase
      .channel('affiliate_tools_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'affiliate_tools' },
        () => {
          // Refetch tools when changes occur
          fetchTools();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <LandingLayout>
      <PageHero />

      <section className="py-20 bg-background dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100 mb-4">
              Recommended Tools
            </h2>
            <p className="text-lg text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Explore our handpicked selection of educational technology tools that integrate seamlessly with Acadeemia
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-card dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary dark:text-gray-100 mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-text-secondary dark:text-gray-400 mb-4">
                      We're currently curating the best tools and resources for your educational institution.
                      Check back soon to discover our recommended partners and exclusive offers.
                    </p>
                    <ul className="space-y-2 text-text-secondary dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Carefully vetted educational technology tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Exclusive discounts for Acadeemia users</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Integration-ready solutions that work seamlessly with our platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Resources to enhance teaching, learning, and administration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-text-secondary dark:text-gray-400 mb-4">
                  Want to be notified when we launch?
                </p>
                <a
                  href="/contact"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                >
                  Stay Updated
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default AffiliatePicksPage;
