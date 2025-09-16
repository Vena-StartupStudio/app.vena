import ServiceList from './components/ServiceList';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        {/* You can add a logo here if you have one */}
        {/* <img src="/path-to-your-logo.png" alt="Vena Logo" className="h-20 w-auto mx-auto mb-4" /> */}
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-800 tracking-tight">
          Schedule an Appointment
        </h1>
        <p className="mt-3 text-base text-zinc-600 max-w-md">
          Choose from our available services below to book your session.
        </p>
      </header>
      <main className="w-full">
        <ServiceList />
      </main>
    </div>
  );
}

export default App;
