import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerHeader } from './CustomerHeader';
import { HeroSearch } from './HeroSearch';
import { PopularRoutesAndOffers } from './PopularRoutesAndOffers';
import { BusSearchResults } from './BusSearchResults';
import { PassengerDetailsPage } from './PassengerDetailsPage';
import { PaymentPage } from './PaymentPage';
import { BookingConfirmationPage } from './BookingConfirmationPage';
import { MyBookingsPage } from './MyBookingsPage';
import { CustomerHelpPage } from './CustomerHelpPage';
import { CustomerFooter } from './CustomerFooter';

export const CustomerPanel: React.FC = () => {
  const { customerView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CustomerHeader />

      <main className="flex-1">
        {customerView === 'HOME' && (
          <>
            <HeroSearch />
            <PopularRoutesAndOffers />
          </>
        )}

        {customerView === 'SEARCH_RESULTS' && <BusSearchResults />}

        {customerView === 'PASSENGER_DETAILS' && <PassengerDetailsPage />}

        {customerView === 'PAYMENT' && <PaymentPage />}

        {customerView === 'CONFIRMATION' && <BookingConfirmationPage />}

        {customerView === 'MY_BOOKINGS' && <MyBookingsPage />}

        {customerView === 'HELP' && <CustomerHelpPage />}
      </main>

      <CustomerFooter />
    </div>
  );
};
