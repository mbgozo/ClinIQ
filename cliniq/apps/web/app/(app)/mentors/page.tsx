"use client";

import { useState } from "react";
import { useMentors, MentorCard, useCreateMentorshipRequest } from "@cliniq/ui";
import { EXPERTISE_AREA_DEFINITIONS } from "@cliniq/shared-types";

export default function MentorsPage() {
  const [filters, setFilters] = useState({
    expertiseAreas: [] as string[],
    institution: "",
    verificationStatus: "",
    minRating: 0,
    availability: "",
    languages: [] as string[],
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  const { data: mentorsData, isLoading, error } = useMentors(filters);
  const createRequestMutation = useCreateMentorshipRequest();

  const mentors = mentorsData?.mentors || [];
  const total = mentorsData?.total || 0;

  const handleExpertiseToggle = (area: string) => {
    setFilters(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter(a => a !== area)
        : [...prev.expertiseAreas, area]
    }));
  };

  const handleLanguageToggle = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleRequestMentorship = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (formData: any) => {
    if (!selectedMentor) return;

    try {
      await createRequestMutation.mutateAsync({
        mentorId: selectedMentor.id,
        topic: formData.topic,
        description: formData.description,
        urgency: formData.urgency,
        preferredTime: formData.preferredTime,
      });

      setShowRequestModal(false);
      setSelectedMentor(null);
      // Reset form
      (document.getElementById('mentorship-form') as HTMLFormElement)?.reset();
    } catch (error) {
      console.error('Failed to create mentorship request:', error);
    }
  };

  const commonLanguages = ['English', 'Twi', 'Ga', 'Ewe', 'Fante', 'Hausa', 'French'];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Directory</h1>
        <p className="text-gray-600">
          Connect with experienced nursing professionals for guidance and support in your studies.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Your Mentor</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Expertise Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(EXPERTISE_AREA_DEFINITIONS).map(([area, definition]) => (
                <label key={area} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.expertiseAreas.includes(area)}
                    onChange={() => handleExpertiseToggle(area)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm">{definition.icon} {definition.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
            <input
              type="text"
              placeholder="Search by institution..."
              value={filters.institution}
              onChange={(e) => setFilters(prev => ({ ...prev, institution: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {commonLanguages.map((lang) => (
                <label key={lang} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(lang)}
                    onChange={() => handleLanguageToggle(lang)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value={0}>All Ratings</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <input
              type="text"
              placeholder="e.g., weekends, evenings..."
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
            <select
              value={filters.verificationStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, verificationStatus: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Mentors</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Verification</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Found {total} mentor{total !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setFilters({
              expertiseAreas: [],
              institution: "",
              verificationStatus: "",
              minRating: 0,
              availability: "",
              languages: [],
            })}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading mentors...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Failed to load mentors.</div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No mentors found</div>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onRequestMentorship={handleRequestMentorship}
            />
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Mentorship with {selectedMentor.user.name}
            </h3>
            
            <form id="mentorship-form" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSubmitRequest({
                topic: formData.get('topic') as string,
                description: formData.get('description') as string,
                urgency: formData.get('urgency') as string,
                preferredTime: formData.get('preferredTime') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    name="topic"
                    type="text"
                    required
                    placeholder="What do you need help with?"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    placeholder="Provide more details about your request..."
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    name="urgency"
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    name="preferredTime"
                    type="text"
                    required
                    placeholder="e.g., Weekday evenings, weekends"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRequestMutation.isPending}
                  className="flex-1 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {createRequestMutation.isPending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
