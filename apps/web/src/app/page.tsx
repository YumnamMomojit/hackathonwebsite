'use client';

import Link from 'next/link';
import { ShieldCheckIcon, RocketLaunchIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{children}</p>
    </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
        <p className="italic text-gray-700 dark:text-gray-300">"{quote}"</p>
        <p className="mt-4 font-semibold text-gray-900 dark:text-white">{author}</p>
        <p className="text-sm text-blue-500">{role}</p>
    </div>
);

const HackathonCard = ({ title, description }: { title: string, description: string }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <Link href="/hackathons" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Learn More &rarr;
        </Link>
    </div>
);


export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          The Future of <span className="text-blue-600 dark:text-blue-500">Innovation</span> is Here.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Join a global community of developers, builders, and innovators to solve real-world problems and launch your next big idea.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/hackathons" className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg">
            Explore Hackathons
          </Link>
          <Link href="/register" className="inline-block px-8 py-3 text-lg font-medium text-blue-600 bg-transparent border border-blue-600 rounded-lg hover:bg-blue-50 dark:text-white dark:border-white">
            Become an Organizer
          </Link>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section>
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Featured Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <HackathonCard title="DeFi Forward 2025" description="Build the next generation of decentralized finance applications." />
              <HackathonCard title="AI for Social Good" description="Leverage artificial intelligence to create solutions for global challenges." />
              <HackathonCard title="Web3 Gaming Gala" description="Create immersive, decentralized gaming experiences on the blockchain." />
          </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why TaikaiClone?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<RocketLaunchIcon className="w-8 h-8 text-blue-600" />} title="Launch Your Ideas">
                Bring your concepts to life and get valuable feedback from industry experts.
            </FeatureCard>
            <FeatureCard icon={<UserGroupIcon className="w-8 h-8 text-blue-600" />} title="Build Your Network">
                Connect with fellow developers, mentors, and potential employers.
            </FeatureCard>
            <FeatureCard icon={<ShieldCheckIcon className="w-8 h-8 text-blue-600" />} title="Web3 Integrated">
                Utilize blockchain technology for transparent judging, rewards, and participation proofs.
            </FeatureCard>
            <FeatureCard icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />} title="Community Driven">
                A platform built for the community, by the community.
            </FeatureCard>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">What Our Community Says</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard quote="An incredible experience. I met my co-founder at a hackathon here!" author="Jane Doe" role="Participant & Founder" />
            <TestimonialCard quote="The platform made organizing our global hackathon seamless and efficient." author="John Smith" role="Hackathon Organizer" />
            <TestimonialCard quote="The quality of projects and talent is consistently top-notch. A go-to for innovation." author="Emily White" role="Venture Capitalist" />
        </div>
      </section>
    </div>
  );
}
