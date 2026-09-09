import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';
import { BrandLogo } from '../shared/BrandLogo';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-deep-night text-snow py-20 border-t border-white/5 mt-auto relative overflow-hidden z-10">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          <div className="lg:col-span-2 space-y-6">
            <BrandLogo size="lg" showTagline linkTo="/" />
            <p className="text-sm font-sans text-snow/60 leading-relaxed max-w-sm">
              {t('footer.tagline', 'Discover the beauty, sustainability, and technological innovation of Norway. Your premium ecosystem for exploring and experiencing the Nordic way of life.')}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-auto h-10 px-6 rounded-none border border-white/20 flex items-center justify-center hover:bg-snow hover:text-deep-night transition-all text-snow text-xs font-sans uppercase tracking-widest font-semibold">
                Instagram
              </a>
              <a href="#" className="w-auto h-10 px-6 rounded-none border border-white/20 flex items-center justify-center hover:bg-snow hover:text-deep-night transition-all text-snow text-xs font-sans uppercase tracking-widest font-semibold">
                Twitter
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-snow font-sans font-semibold mb-6 tracking-widest uppercase text-xs">
              {t('footer.explore', 'Explore')}
            </h4>
            <ul className="space-y-4 text-sm font-sans text-snow/70">
              <li><Link to="/explore" className="hover:text-arctic-gold transition-colors">{t('footer.destinations', 'Destinations')}</Link></li>
              <li><Link to="/planner" className="hover:text-arctic-gold transition-colors">{t('footer.planner', 'AI Trip Planner')}</Link></li>
              <li><Link to="/flora" className="hover:text-arctic-gold transition-colors">{t('footer.flora', 'Plants & Trees')}</Link></li>
              <li><Link to="/history" className="hover:text-arctic-gold transition-colors">{t('footer.history', 'History & Heritage')}</Link></li>
              <li><Link to="/trails" className="hover:text-arctic-gold transition-colors">{t('footer.trails', 'Hiking Trails')}</Link></li>
              <li><Link to="/stay" className="hover:text-arctic-gold transition-colors">{t('footer.stays', 'Stays & Lodges')}</Link></li>
              <li><Link to="/food" className="hover:text-arctic-gold transition-colors">{t('footer.food', 'Food & Dining')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-snow font-sans font-semibold mb-6 tracking-widest uppercase text-xs">
              {t('footer.insights', 'Insights')}
            </h4>
            <ul className="space-y-4 text-sm font-sans text-snow/70">
              <li><Link to="/smart-city" className="hover:text-arctic-gold transition-colors">{t('footer.smart_city', 'Smart City Hub')}</Link></li>
              <li><Link to="/map" className="hover:text-arctic-gold transition-colors">{t('footer.map', 'Interactive Map')}</Link></li>
              <li><Link to="/impact" className="hover:text-arctic-gold transition-colors">{t('footer.sustainability', 'Sustainability')}</Link></li>
              <li><Link to="/infrastructure" className="hover:text-arctic-gold transition-colors">{t('footer.infrastructure', 'Infrastructure')}</Link></li>
              <li><Link to="/aurora" className="hover:text-arctic-gold transition-colors">{t('footer.aurora', 'Aurora Forecast')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-snow font-sans font-semibold mb-6 tracking-widest uppercase text-xs">
              {t('footer.legal', 'Legal & Tax')}
            </h4>
            <ul className="space-y-4 text-sm font-sans text-snow/70">
              <li><Link to="/sitemap" className="hover:text-arctic-gold transition-colors">{t('footer.sitemap', 'Site Directory')}</Link></li>
              <li><Link to="/user/invoices" className="hover:text-arctic-gold transition-colors">{t('footer.invoices', 'Invoices & Receipts')}</Link></li>
              <li><Link to="#" className="hover:text-snow transition-colors">{t('footer.privacy', 'Privacy Policy')}</Link></li>
              <li><Link to="#" className="hover:text-snow transition-colors">{t('footer.terms', 'Terms of Service')}</Link></li>
              <li><Link to="#" className="hover:text-snow transition-colors">{t('footer.cookies', 'Cookie Policy')}</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans tracking-wide text-snow/40">
            © {new Date().getFullYear()} Norway SmartLife AS. {t('footer.rights', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-2 text-xs font-sans tracking-wide text-snow/40">
            <span>{t('footer.powered_by', 'Powered by')}</span>
            <span className="text-cyan-400 font-semibold">Norway SmartLife Platform</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
