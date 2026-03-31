"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ClinIQ</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/questions" className="text-gray-600 hover:text-gray-900">
                Questions
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900">
                Resources
              </Link>
              <Link href="/mentors" className="text-gray-600 hover:text-gray-900">
                Mentors
              </Link>
              <Link href="/study-groups" className="text-gray-600 hover:text-gray-900">
                Study Groups
              </Link>
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                Chat
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Clinical Intelligence for
            <span className="text-blue-600"> Nursing Education</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with experienced nurses, access comprehensive resources, and excel in your
            nursing education journey through collaborative learning.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions, resources, mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4">
            <Link
              href="/questions/ask"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ask a Question
            </Link>
            <Link
              href="/resources/upload"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Share Resource
            </Link>
            <Link
              href="/study-groups/create"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Study Group
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Nursing Excellence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/questions" className="group">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">❓</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Q&A Forum</h4>
                <p className="text-gray-600">
                  Get answers from experienced nurses and contribute your knowledge.
                </p>
              </div>
            </Link>

            <Link href="/resources" className="group">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Resource Library</h4>
                <p className="text-gray-600">
                  Access comprehensive study materials and share valuable resources.
                </p>
              </div>
            </Link>

            <Link href="/mentors" className="group">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Mentor Directory</h4>
                <p className="text-gray-600">
                  Connect with experienced nurses for guidance and mentorship.
                </p>
              </div>
            </Link>

            <Link href="/study-groups" className="group">
              <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Study Groups</h4>
                <p className="text-gray-600">
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
              <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Expert Mentors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5,000+</div>
              <div className="text-gray-600">Questions Answered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">800+</div>
              <div className="text-gray-600">Study Resources</div>
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
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <h4 className="text-xl font-bold">ClinIQ</h4>
              </div>
              <p className="text-gray-400">
                Empowering nursing education in Ghana through collaborative learning and mentorship.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/questions" className="hover:text-white">
                    Q&A Forum
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/mentors" className="hover:text-white">
                    Mentors
                  </Link>
                </li>
                <li>
                  <Link href="/study-groups" className="hover:text-white">
                    Study Groups
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <p className="text-gray-400 mb-4">
                Join our community of nursing professionals and students.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 ClinIQ. Built for Ghana's nursing education community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
