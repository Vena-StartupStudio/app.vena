import React, { useState, useEffect } from 'react';

// Define the structure of a Service object based on ReserveKit's API docs
type Service = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  currency: string;
};

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      // Retrieve the API key from environment variables
      const apiKey = import.meta.env.VITE_RESERVEKIT_API_KEY;

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        setError('ReserveKit API key is not configured. Please add it to your .env file.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.reservekit.io/v1/services', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        const data = await response.json();
        setServices(data.data); // The services are in the 'data' property of the response
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p className="text-center text-zinc-500">Loading services...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800">Our Services</h2>
      {services.length > 0 ? (
        <ul className="space-y-4">
          {services.map((service) => (
            <li key={service.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-zinc-600">{service.duration} minutes</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(service.price / 100)}
                </p>
                <button className="mt-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                  Book Now
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-zinc-500">No services found. Please add some in your ReserveKit dashboard.</p>
      )}
    </div>
  );
};

export default ServiceList;
