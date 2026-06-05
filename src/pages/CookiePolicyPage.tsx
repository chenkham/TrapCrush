import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-pink-400" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-sm mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. What Are Cookies</h2>
              <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How TrapCrush Uses Cookies</h2>
              <p className="mb-2">When you use and access the service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li><strong className="text-gray-300">Essential Cookies:</strong> To enable certain functions of the service, such as authenticating users and preventing fraudulent use of user accounts.</li>
                <li><strong className="text-gray-300">Analytics Cookies:</strong> To track information on how the service is used so that we can make improvements. We may also use analytics cookies to test new pages, features, or new functionality of the service to see how our users react to them.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Third-Party Cookies</h2>
              <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. What Are Your Choices Regarding Cookies</h2>
              <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
              <p>If you have any questions about our Cookie Policy, please contact us at support@trapcrush.com.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
