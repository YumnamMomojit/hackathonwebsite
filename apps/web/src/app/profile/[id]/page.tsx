'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { UserCircleIcon, CubeIcon, FlagIcon, StarIcon } from '@heroicons/react/24/outline';

// --- TYPE DEFINITIONS ---
interface User {
  id: number;
  wallet_address: string;
  masked_email: string;
}
interface Project {
  id: number;
  name: string;
  description: string;
}
interface Hackathon {
  id: number;
  name: string;
  description: string;
}
interface ProfileData {
  user: User;
  roles: string[];
  projects: Project[];
  registeredHackathons: Hackathon[];
  organizedHackathons: Hackathon[];
}

// --- SUB-COMPONENTS ---
const ProfileHeader = ({ user, roles }: { user: User; roles: string[] }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex items-center space-x-6">
        <UserCircleIcon className="h-24 w-24 text-gray-400" />
        <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {user.masked_email || user.wallet_address}
            </h1>
            <div className="flex space-x-2 mt-2">
                {roles.map(role => (
                    <span key={role} className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
                        {role}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const ProjectList = ({ projects }: { projects: Project[] }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <CubeIcon className="h-6 w-6 mr-2" /> Project Portfolio
        </h2>
        {projects.length > 0 ? (
            <ul className="space-y-4">
                {projects.map(project => (
                    <li key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{project.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
                    </li>
                ))}
            </ul>
        ) : <p className="text-gray-500 dark:text-gray-400">This user has not submitted any projects yet.</p>}
    </div>
);

const OrganizerHackathonList = ({ hackathons }: { hackathons: Hackathon[] }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FlagIcon className="h-6 w-6 mr-2" /> Organized Hackathons
        </h2>
        {hackathons.length > 0 ? (
            <ul className="space-y-4">
                {hackathons.map(hackathon => (
                    <li key={hackathon.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                         <Link href={`/hackathons/${hackathon.id}`} className="font-bold text-lg text-blue-600 dark:text-blue-400 hover:underline">
                            {hackathon.name}
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400">{hackathon.description}</p>
                    </li>
                ))}
            </ul>
        ) : <p className="text-gray-500 dark:text-gray-400">This user has not organized any hackathons.</p>}
    </div>
);


// --- MAIN PAGE COMPONENT ---
export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchProfileData = async () => {
        try {
          const res = await fetch(`/api/users/${id}/profile`);
          if (!res.ok) {
            throw new Error('Failed to fetch profile data');
          }
          const data = await res.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!profile) {
    return <p className="text-center">User not found.</p>;
  }

  const isOrganizer = profile.roles.includes('ORGANIZER');

  return (
    <div className="space-y-12">
        <ProfileHeader user={profile.user} roles={profile.roles} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProjectList projects={profile.projects} />
            {isOrganizer && <OrganizerHackathonList hackathons={profile.organizedHackathons} />}
        </div>
    </div>
  );
}
