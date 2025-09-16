import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Define the structure of a Service object based on ReserveKit API
type Service = {
  id: number;
  name: string;
  description: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
  bookings_count: number;
  // Optional fields that might be available
  duration?: number;
  price?: number;
  currency?: string;
};

// Define the structure of a TimeSlot object based on ReserveKit API
type TimeSlot = {
  id: number;
  service_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_bookings: number;
  created_at: string;
  updated_at: string;
};

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for handling time slots
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState<boolean>(false);
  const [timeSlotsError, setTimeSlotsError] = useState<string | null>(null);

  // Effect to fetch the list of services on initial load
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('user_id');

        if (!userId) {
          setError('No user specified. Please provide a user_id in the URL.');
          setLoading(false);
          return;
        }
        
        const { data: registration, error: registrationError } = await supabase
          .from('registrations')
          .select('encrypted_reservekit_api_key')
          .eq('id', userId)
          .single();
        
        if (registrationError || !registration) {
          throw new Error('Could not fetch registration details for the specified user.');
        }

        const userApiKey = registration.encrypted_reservekit_api_key;
        
        if (!userApiKey) {
          setError('ReserveKit API key is not set for this user.');
          setLoading(false);
          return;
        }
        
        setApiKey(userApiKey); // Save the API key for later use

        const response = await fetch('https://api.reservekit.io/v1/services', {
          headers: {
            'Authorization': `Bearer ${userApiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch services: ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        console.log('ReserveKit API Response:', data);
        console.log('Full response structure:', JSON.stringify(data, null, 2));
        
        // ReserveKit returns services in data.services
        const servicesData = data.data?.services || [];
        console.log('Services found:', servicesData);
        setServices(servicesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to handle selecting a service and fetching its time slots
  const handleSelectService = async (service: Service) => {
    setSelectedService(service);
    setTimeSlotsLoading(true);
    setTimeSlotsError(null);
    setTimeSlots([]);

    if (!apiKey) {
      setTimeSlotsError("API key is not available.");
      setTimeSlotsLoading(false);
      return;
    }

    try {
      console.log(`Fetching time slots for service ID: ${service.id}`);
      const response = await fetch(`https://api.reservekit.io/v1/time-slots?service_id=${service.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Time slots response status:', response.status);
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Time slots error response:', errorBody);
        throw new Error(`Failed to fetch time slots: ${errorBody}`);
      }

      const data = await response.json();
      console.log('Time slots API Response:', data);
      console.log('Full time slots structure:', JSON.stringify(data, null, 2));
      
      // Try different possible response structures for time slots
      const timeSlotsData = data.data?.time_slots || data.time_slots || data.data || [];
      console.log('Time slots found:', timeSlotsData);
      setTimeSlots(timeSlotsData);
    } catch (err: any) {
      setTimeSlotsError(err.message);
    } finally {
      setTimeSlotsLoading(false);
    }
  };

  // Function to handle clicking on a time slot and create a booking
  const handleTimeSlotClick = async (slot: TimeSlot) => {
    if (!apiKey || !selectedService) {
      alert('Missing API key or service information');
      return;
    }

    console.log('=== BOOKING DEBUG START ===');
    console.log('Selected slot:', slot);
    console.log('API key (first 20 chars):', apiKey.substring(0, 20) + '...');
    console.log('Selected service:', selectedService);

    // For now, let's try booking with the original time slot data
    // instead of calculating future dates to see if that works
    const confirmBooking = window.confirm(
      `Confirm booking for ${selectedService.name} at ${new Date(slot.start_time).toLocaleString()}?`
    );

    if (!confirmBooking) return;

    try {
      // Try the simplest possible booking first
      const bookingData = {
        service_id: selectedService.id
      };

      console.log('Booking payload (minimal):', JSON.stringify(bookingData, null, 2));

      const response = await fetch('https://api.reservekit.io/v1/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      alert('Booking request sent successfully!');
      
    } catch (error) {
      console.error('=== BOOKING ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('=== BOOKING ERROR END ===');
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    console.log('=== BOOKING DEBUG END ===');
  };

  if (loading) {
    return <p className="text-center text-zinc-500">Loading services...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  // View for showing available time slots for a selected service
  if (selectedService) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
        <button onClick={() => setSelectedService(null)} className="mb-6 text-blue-600 hover:underline">
          &larr; Back to Services
        </button>
        <h2 className="text-2xl font-bold mb-2 text-zinc-800">Available Slots for {selectedService.name}</h2>
        <p className="text-zinc-600 mb-6">Select a time to book your appointment.</p>
        
        {timeSlotsLoading && <p className="text-center text-zinc-500">Loading time slots...</p>}
        {timeSlotsError && <p className="text-center text-red-600">Error: {timeSlotsError}</p>}
        
        {!timeSlotsLoading && !timeSlotsError && (
          timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {timeSlots.map((slot, index) => (
                <button 
                  key={`${slot.start_time}-${index}`} 
                  onClick={() => handleTimeSlotClick(slot)}
                  className="p-4 border rounded-lg text-center bg-blue-50 hover:bg-blue-100"
                >
                  <span className="font-semibold">{new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">No available time slots for this service.</p>
          )
        )}
      </div>
    );
  }

  // Default view for showing the list of services
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800">Our Services</h2>
      {services.length > 0 ? (
        <ul className="space-y-4">
          {services.map((service) => (
            <li key={service.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                {service.duration ? (
                  <p className="text-sm text-zinc-600">{service.duration} minutes</p>
                ) : (
                  <p className="text-sm text-zinc-600">Duration: Contact for details</p>
                )}
              </div>
              <div className="text-right">
                {service.price && service.currency ? (
                  <p className="font-bold text-lg text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(service.price / 100)}
                  </p>
                ) : (
                  <p className="font-bold text-lg text-zinc-600">Contact for pricing</p>
                )}
                <button 
                  onClick={() => handleSelectService(service)}
                  className="mt-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                >
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
