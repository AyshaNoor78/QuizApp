import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import SubscriptionBanner from '../subscription/SubscriptionBanner';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      <SubscriptionBanner />
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
