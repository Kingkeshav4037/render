import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../commerce/CartDrawer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-snow selection:bg-arctic-gold/30">
      <Navbar />
      <main className="flex-grow w-full relative z-0">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
