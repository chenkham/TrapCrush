import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
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
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
              <p>Welcome to TrapCrush! We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li><strong className="text-gray-300">Personal Data:</strong> When you create an account or use our service, we may ask for personally identifiable information such as your email address and name.</li>
                <li><strong className="text-gray-300">Usage Data:</strong> We may collect information on how the service is accessed and used, including your IP address, browser type, pages visited, and time spent on pages.</li>
                <li><strong className="text-gray-300">User-Generated Content:</strong> Content you create on TrapCrush (such as interactive pages sent to others).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p className="mb-2">We use the collected data to:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li>Provide and maintain our service</li>
                <li>Notify you about changes to our service</li>
                <li>Provide customer support</li>
                <li>Monitor the usage of our service</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Disclosure of Data</h2>
              <p className="mb-2">We may disclose your personal data in the good faith belief that such action is necessary to:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li>Comply with a legal obligation</li>
                <li>Protect and defend the rights or property of TrapCrush</li>
                <li>Prevent or investigate possible wrongdoing in connection with the service</li>
                <li>Protect the personal safety of users of the service or the public</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Security of Data</h2>
              <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Children's Privacy</h2>
              <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@trapcrush.com.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
