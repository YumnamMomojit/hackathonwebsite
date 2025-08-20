'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Hackathon {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function DashboardPage() {
  const [registeredHackathons, setRegisteredHackathons] = useState<Hackathon[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch registered hackathons
        const hackathonsRes = await fetch('/api/users/me/registrations', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!hackathonsRes.ok) throw new Error('Failed to fetch registered hackathons');
        const hackathonsData = await hackathonsRes.json();
        setRegisteredHackathons(hackathonsData);

        // Fetch user's projects
        const projectsRes = await fetch('/api/users/me/projects', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!projectsRes.ok) throw new Error('Failed to fetch projects');
        const projectsData = await projectsRes.json();
        setMyProjects(projectsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <p className="text-center">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">My Dashboard</h1>

      {/* Registered Hackathons Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Registered Hackathons</h2>
        {registeredHackathons.length > 0 ? (
          <ul className="space-y-4">
            {registeredHackathons.map(hackathon => (
              <li key={hackathon.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <Link href={`/hackathons/${hackathon.id}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    {hackathon.name}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not registered for any hackathons yet.</p>
        )}
      </div>

      {/* My Projects Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Projects</h2>
        {myProjects.length > 0 ? (
          <ul className="space-y-4">
            {myProjects.map(project => (
              <li key={project.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="font-bold">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not created any projects yet.</p>
        )}
      </div>
    </div>
  );
}
