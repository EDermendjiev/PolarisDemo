import Header from './components/Header';
import Navbar from './components/Navbar';
import OfferDetails from './components/OfferDetails';
import ActionsToolbar from './components/ActionsToolbar';
import ProductTable from './components/ProductTable';
import OfferSummary from './components/OfferSummary';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <OfferDetails />
        <ActionsToolbar />
        <ProductTable />
        <OfferSummary />
      </main>
    </div>
  );
}

export default App;
