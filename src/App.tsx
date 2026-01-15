import { useState } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import OfferDetails from './components/OfferDetails';
import ActionsToolbar from './components/ActionsToolbar';
import ProductTable from './components/ProductTable';
import OfferSummary from './components/OfferSummary';
import EditProductDialog from './components/EditProductDialog';
import FirmsPage from './components/FirmsPage';

function App() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState('offers');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        {currentView === 'offers' ? (
          <>
            <OfferDetails />
            <ActionsToolbar />
            <ProductTable onEdit={() => setIsEditDialogOpen(true)} />
            <OfferSummary />
            <EditProductDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </>
        ) : currentView === 'firms' ? (
          <FirmsPage />
        ) : (
          <div className="text-center py-20 text-gray-500">
            Страницата "{currentView}" е все още в процес на разработка.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
