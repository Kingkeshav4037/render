import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../commerce/CartDrawer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-snow selection:bg-arctic-gold/30">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow w-full relative z-0" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
