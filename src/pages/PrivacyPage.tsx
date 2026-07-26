/**
 * PrivacyPage.tsx — Privacy Policy Page
 *
 * A static content page accessible at "/privacy". Displays the PresenceCV
 * privacy policy covering data collection, usage, and security practices.
 * Uses the same cream-tone visual style as LandingPage.
 *
 * Content sections: Introduction, Information Collected, Usage, Security, Contact
 * Depends on: react-router-dom (Link), lucide-react (Box icon)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-semibold tracking-tight mb-8">{t('legal.privacy.title')}</h1>
        <div className="prose prose-stone">
          <p className="text-lg text-gray-600 mb-8">{t('legal.privacy.lastUpdated')}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.privacy.introTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.privacy.introDesc')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.privacy.collectTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('legal.privacy.collectGoogle') }}></p>
            <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t('legal.privacy.collectResume') }}></p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.privacy.useTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('legal.privacy.use1')}<br/>
              {t('legal.privacy.use2')}<br/>
              <span dangerouslySetInnerHTML={{ __html: t('legal.privacy.use3') }}></span><br/>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.privacy.securityTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.privacy.securityDesc')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('legal.privacy.contactTitle')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('legal.privacy.contactDesc')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
