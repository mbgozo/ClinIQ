"use client";

import Link from "next/link";
import { useState } from "react";

// Inline SVG icons for feature cards
const QAIcon = () => (
  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LibraryIcon = () => (
  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MentorIcon = () => (
  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const GroupsIcon = () => (
  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ClinIQ</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/questions" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Questions
              </Link>
              <Link href="/resources" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Resources
              </Link>
              <Link href="/mentors" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Mentors
              </Link>
              <Link href="/study-groups" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Study Groups
              </Link>
              <Link href="/chat" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Chat
              </Link>
              <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Admin
              </Link>
              <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Clinical Intelligence for<br />
            <span className="text-teal-600">Nursing Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with experienced nurses, access comprehensive resources, and excel in your
            nursing education journey through collaborative learning.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions, resources, mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-36 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/questions/ask"
              className="px-6 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Ask a Question
            </Link>
            <Link
              href="/resources/upload"
              className="px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Share Resource
            </Link>
            <Link
              href="/study-groups/create"
              className="px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Start Study Group
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Nursing Excellence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/questions" className="group">
              <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <QAIcon />
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900">Q&amp;A Forum</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get answers from experienced nurses and contribute your knowledge.
                </p>
              </div>
            </Link>

            <Link href="/resources" className="group">
              <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-green-200 transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <LibraryIcon />
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900">Resource Library</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Access comprehensive study materials and share valuable resources.
                </p>
              </div>
            </Link>

            <Link href="/mentors" className="group">
              <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-purple-200 transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <MentorIcon />
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900">Mentor Directory</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Connect with experienced nurses for guidance and mentorship.
                </p>
              </div>
            </Link>

            <Link href="/study-groups" className="group">
              <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-orange-200 transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <GroupsIcon />
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900">Study Groups</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Collaborate with peers and form study groups for better learning.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">1,200+</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Expert Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">5,000+</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">800+</div>
              <div className="text-sm text-gray-600">Study Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-lg font-bold">ClinIQ</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering nursing education in Ghana through collaborative learning and mentorship.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-sm">Platform</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/questions" className="hover:text-white transition-colors">Q&amp;A Forum</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link href="/mentors" className="hover:text-white transition-colors">Mentors</Link></li>
                <li><Link href="/study-groups" className="hover:text-white transition-colors">Study Groups</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-sm">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-sm">Connect</h5>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Join our community of nursing professionals and students.
              </p>
              <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 ClinIQ. Built for Ghana's nursing education community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
