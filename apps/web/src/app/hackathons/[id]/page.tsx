'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Define the type for a hackathon object
interface Hackathon {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  prize_pool: string;
}

export default function HackathonDetailsPage() {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchHackathonDetails = async () => {
        try {
          const res = await fetch(`/api/hackathons/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch hackathon details');
          }
          const data = await res.json();
          setHackathon(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchHackathonDetails();
    }
  }, [id]);

  const handleRegister = async () => {
    setRegistrationStatus('Registering...');
    const token = localStorage.getItem('token');
    if (!token) {
        setRegistrationStatus('You must be logged in to register.');
        return;
    }

    try {
        const res = await fetch('/api/hackathons/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ hackathon_id: id })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to register');
        }
        setRegistrationStatus('Successfully registered!');

    } catch (err: any) {
        setRegistrationStatus(`Registration failed: ${err.message}`);
    }
  };


  if (loading) {
    return <p className="text-center">Loading hackathon details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!hackathon) {
    return <p className="text-center">Hackathon not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{hackathon.name}</h1>
        <div className="flex items-center justify-between mb-6 text-gray-500 dark:text-gray-300">
            <span><strong>Starts:</strong> {new Date(hackathon.start_date).toLocaleDateString()}</span>
            <span><strong>Ends:</strong> {new Date(hackathon.end_date).toLocaleDateString()}</span>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">Prize: {hackathon.prize_pool}</span>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{hackathon.description}</p>
        </div>
        <div className="mt-8 text-center">
            <button
                onClick={handleRegister}
                className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Register for this Hackathon
            </button>
            {registrationStatus && <p className="mt-4 text-sm">{registrationStatus}</p>}
        </div>
      </div>
    </div>
  );
}
