import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
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
            Terms and Conditions
          </h1>
          <p className="text-gray-400 text-sm mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using TrapCrush, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
              <p>TrapCrush is a platform that allows users to create interactive web pages to share with others.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. User Conduct and Acceptable Use</h2>
              <p className="mb-2">Since TrapCrush is designed for fun and positive interactions, you agree not to use the service to:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-400">
                <li>Harass, stalk, threaten, or otherwise violate the legal rights of others.</li>
                <li>Publish, post, upload, or distribute any inappropriate, profane, defamatory, infringing, obscene, or unlawful topic, name, material, or information.</li>
                <li>Impersonate any person or entity.</li>
              </ul>
              <p className="mt-4">TrapCrush reserves the right to terminate accounts or remove content that violates these guidelines.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. User-Generated Content</h2>
              <p>You retain all rights to any content you submit, post, or display on or through the service. By submitting content, you grant TrapCrush a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, and display that content in connection with providing the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
              <p>The service and its original content (excluding user-provided content), features, and functionality are and will remain the exclusive property of TrapCrush and its licensors.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Termination</h2>
              <p>We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h2>
              <p>In no event shall TrapCrush, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Governing Law</h2>
              <p>These Terms shall be governed and construed in accordance with the laws of our operating jurisdiction, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Changes</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at support@trapcrush.com.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
