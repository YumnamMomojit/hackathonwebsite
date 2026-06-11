'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  description: string;
  github_url: string;
}

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{project.name}</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{project.description?.substring(0, 150)}...</p>
    {project.github_url && (
      <Link href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-auto px-4 py-2 text-sm font-medium text-white bg-gray-700 dark:bg-gray-600 rounded-md hover:bg-gray-800 dark:hover:bg-gray-500">
        View on GitHub
      </Link>
    )}
  </div>
);

export default function ProjectShowcasePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p className="text-center">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Project Showcase</h1>
      {projects.length === 0 ? (
        <p className="text-center">No projects have been submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
