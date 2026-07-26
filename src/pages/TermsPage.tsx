/**
 * TermsPage.tsx — Terms of Service Page
 *
 * A static content page accessible at "/terms". Displays the PresenceCV
 * terms of service covering agreement, service description, accounts,
 * content ownership, and disclaimers.
 * Uses the same cream-tone visual style as LandingPage.
 *
 * Content sections: Agreement, Service Description, User Accounts, Ownership, Disclaimer
 * Depends on: react-router-dom (Link), lucide-react (Box icon)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1c1c] font-sans pb-32">
      <nav className="sticky top-0 z-50 bg-[#f7f4ed]/80 backdrop-blur-md border-b border-[#eceae4]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/favicon.png" className="w-6 h-6 rounded-full" style={{ mixBlendMode: 'multiply' }} alt="PresenceCV Logo" />
            <span className="text-xl font-semibold tracking-tight">PresenceCV</span>
          </Link>
          <Link to="/" className="text-sm font-medium hover:underline">{t('legal.backToHome')}</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 mt-16">
        <h1 className="text-4xl font-semibold tracking-tight mb-8">{t('legal.terms.title')}</h1>
        <div className="prose prose-stone">
          <p className="text-lg text-gray-600 mb-8">{t('legal.terms.lastUpdated')}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.acceptanceTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.terms.acceptanceDesc')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.serviceTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.terms.serviceDesc')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.userTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.terms.userDesc')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.intellectualTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.terms.intellectualDesc')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.terms.limitationTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.terms.limitationDesc')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
