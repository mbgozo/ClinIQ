"use client";

import { useState } from "react";
import { 
  useResources, 
  useCategories, 
  useCreateResource, 
  useDownloadResource, 
  useFlagResource,
  ResourceCard, 
  ResourceUpload 
} from "@cliniq/ui";

export default function ResourcesPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: "",
    course: "",
    year: "",
    tags: [] as string[],
    search: "",
  });

  const { data: resourcesData, isLoading, error } = useResources({
    ...filters,
    year: filters.year ? parseInt(filters.year) : undefined
  });
  const { data: categories } = useCategories();
  const createMutation = useCreateResource();
  const downloadMutation = useDownloadResource();
  const flagMutation = useFlagResource();

  const resources = resourcesData?.resources || [];
  const total = resourcesData?.total || 0;

  const handleUpload = async (formData: FormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload resource:', error);
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      const result = await downloadMutation.mutateAsync(resourceId);
      
      // For external links, open in new tab
      if (result.downloadUrl.startsWith('http')) {
        window.open(result.downloadUrl, '_blank');
      } else {
        // For files, trigger download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = '';
        link.click();
      }
    } catch (error) {
      console.error('Failed to download resource:', error);
    }
  };

  const handleFlag = async (resourceId: string) => {
    const reason = prompt('Reason for flagging this resource:');
    if (reason) {
      try {
        await flagMutation.mutateAsync({ id: resourceId, reason });
      } catch (error) {
        console.error('Failed to flag resource:', error);
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      course: "",
      year: "",
      tags: [],
      search: "",
    });
  };

  const commonTags = [
    "NCLEX", "fundamentals", "assessment", "medication", "safety",
    "infection-control", "documentation", "leadership", "ethics",
    "pediatrics", "obstetrics", "mental-health", "critical-care",
    "pharmacology", "anatomy", "physiology", "pathophysiology",
    "evidence-based", "clinical-guidelines", "case-study",
    "study-guide", "cheat-sheet", "exam-prep", "review"
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Library</h1>
          <p className="text-gray-600">
            Share and discover study materials, guides, and resources for nursing education.
          </p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Upload Resource
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <input
              type="text"
              placeholder="e.g., NURS 101"
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              placeholder="Academic year"
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Tags */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {commonTags.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm">#{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Found {total} resource{total !== 1 ? 's' : ''}
          </p>
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading resources...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Failed to load resources.</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No resources found</div>
          <p className="text-sm mb-4">
            Try adjusting your filters or be the first to upload a resource!
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Upload First Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDownload={handleDownload}
              onFlag={handleFlag}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <ResourceUpload
          onSubmit={handleUpload}
          onCancel={() => setShowUploadModal(false)}
          isLoading={createMutation.isPending}
        />
      )}
    </main>
  );
}
