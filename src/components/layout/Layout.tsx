import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ta';

  return (
    <div 
      className="min-h-screen bg-background"
      style={{ 
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      <Navbar />
      <main 
        className="animate-fade-in"
        style={{ 
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left'
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
