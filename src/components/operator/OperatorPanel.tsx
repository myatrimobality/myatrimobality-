import React, { useState } from 'react';
import { Trip } from '../../types';
import { OperatorHeader } from './OperatorHeader';
import { OperatorDashboard } from './OperatorDashboard';
import { OperatorFleetManager } from './OperatorFleetManager';
import { OperatorTripsManager } from './OperatorTripsManager';
import { OperatorPassengerChart } from './OperatorPassengerChart';
import { OperatorSettlements } from './OperatorSettlements';
import { AddBusModal } from './AddBusModal';
import { AddTripModal } from './AddTripModal';

export const OperatorPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [addBusModalOpen, setAddBusModalOpen] = useState(false);
  const [addTripModalOpen, setAddTripModalOpen] = useState(false);
  const [manifestSelectedTrip, setManifestSelectedTrip] = useState<Trip | null>(null);

  const handleOpenManifest = (trip: Trip) => {
    setManifestSelectedTrip(trip);
    setActiveTab('PASSENGER_CHART');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <OperatorHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddBus={() => setAddBusModalOpen(true)}
        onOpenAddTrip={() => setAddTripModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'DASHBOARD' && (
          <OperatorDashboard
            onNavigateTab={setActiveTab}
            onOpenAddBus={() => setAddBusModalOpen(true)}
            onOpenAddTrip={() => setAddTripModalOpen(true)}
          />
        )}

        {activeTab === 'FLEET' && (
          <OperatorFleetManager onOpenAddBus={() => setAddBusModalOpen(true)} />
        )}

        {activeTab === 'TRIPS' && (
          <OperatorTripsManager
            onOpenAddTrip={() => setAddTripModalOpen(true)}
            onViewManifest={handleOpenManifest}
          />
        )}

        {activeTab === 'PASSENGER_CHART' && (
          <OperatorPassengerChart initialTrip={manifestSelectedTrip} />
        )}

        {activeTab === 'SETTLEMENTS' && <OperatorSettlements />}
      </main>

      {/* Modals */}
      <AddBusModal
        isOpen={addBusModalOpen}
        onClose={() => setAddBusModalOpen(false)}
      />

      <AddTripModal
        isOpen={addTripModalOpen}
        onClose={() => setAddTripModalOpen(false)}
      />
    </div>
  );
};
