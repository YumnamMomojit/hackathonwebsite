'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the type for a hackathon object
interface Hackathon {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  prize_pool: string;
}

// A simple card component to display hackathon info
const HackathonCard = ({ hackathon }: { hackathon: Hackathon }) => (
  <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{hackathon.name}</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{hackathon.description?.substring(0, 100)}...</p>
    <div className="text-sm text-gray-500 dark:text-gray-300 mb-4">
      <p><strong>Starts:</strong> {new Date(hackathon.start_date).toLocaleDateString()}</p>
      <p><strong>Ends:</strong> {new Date(hackathon.end_date).toLocaleDateString()}</p>
      <p><strong>Prize Pool:</strong> {hackathon.prize_pool}</p>
    </div>
    <Link href={`/hackathons/${hackathon.id}`} className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
        View Details
    </Link>
  </div>
);

export default function HackathonDiscoveryPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch('/api/hackathons');
        if (!res.ok) {
          throw new Error('Failed to fetch hackathons');
        }
        const data = await res.json();
        setHackathons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) {
    return <p className="text-center">Loading hackathons...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-8">
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Discover Hackathons</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find your next challenge and start building the future.</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <input
                type="text"
                placeholder="Search by name or keyword..."
                className="flex-grow px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <select className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option>All Statuses</option>
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
            </select>
            <button className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Search
            </button>
        </div>

      {hackathons.length === 0 && !loading ? (
        <p className="text-center py-12">No hackathons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </div>
  );
}
