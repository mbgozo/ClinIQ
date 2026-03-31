"use client";

import { useState } from "react";
import { 
  useResources, 
  useDeleteResource, 
  usePendingFlags, 
  useResolveFlag, 
  useDismissFlag,
  ResourceCard 
} from "@cliniq/ui";

export default function ResourceManagePage() {
  const [activeTab, setActiveTab] = useState<"resources" | "flags">("resources");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const { data: resourcesData, isLoading: resourcesLoading } = useResources({ limit: 50 });
  const { data: flagsData, isLoading: flagsLoading } = usePendingFlags();
  
  const deleteMutation = useDeleteResource();
  const resolveMutation = useResolveFlag();
  const dismissMutation = useDismissFlag();

  const resources = resourcesData?.resources || [];
  const flags = flagsData || [];

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteMutation.mutateAsync(resourceId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const handleResolveFlag = async (flagId: string, notes?: string) => {
    try {
      await resolveMutation.mutateAsync({ id: flagId, notes });
    } catch (error) {
      console.error('Failed to resolve flag:', error);
    }
  };

  const handleDismissFlag = async (flagId: string, notes?: string) => {
    try {
      await dismissMutation.mutateAsync({ id: flagId, notes });
    } catch (error) {
      console.error('Failed to dismiss flag:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEntityTypeName = (entityType: string) => {
    const typeMap: Record<string, string> = {
      'RESOURCE': 'Resource',
      'QUESTION': 'Question',
      'ANSWER': 'Answer',
      'GROUP_POST': 'Group Post',
    };
    return typeMap[entityType] || entityType;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Management</h1>
        <p className="text-gray-600">
          Manage resources and review flagged content for moderation.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("resources")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "resources"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Resources ({resourcesData?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab("flags")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "flags"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pending Flags ({flags.length})
          </button>
        </nav>
      </div>

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <>
          {resourcesLoading ? (
            <div className="text-center py-12 text-gray-500">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No resources found</div>
              <p className="text-sm">No resources have been uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Resource Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Total Resources:</span>
                    <span className="ml-2 text-gray-600">{resourcesData?.total || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">With Files:</span>
                    <span className="ml-2 text-gray-600">
                      {resources.filter(r => r.fileRef).length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">External Links:</span>
                    <span className="ml-2 text-gray-600">
                      {resources.filter(r => r.url).length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Total Downloads:</span>
                    <span className="ml-2 text-gray-600">
                      {resources.reduce((sum, r) => sum + r.downloads, 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onDownload={() => {}} // Disabled in management view
                    onDelete={() => setShowDeleteConfirm(resource.id)}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Flags Tab */}
      {activeTab === "flags" && (
        <>
          {flagsLoading ? (
            <div className="text-center py-12 text-gray-500">Loading flags...</div>
          ) : flags.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No pending flags</div>
              <p className="text-sm">All content has been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flags.map((flag) => (
                <div key={flag.id} className="bg-white border rounded-lg p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {getEntityTypeName(flag.entityType)} Flagged
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Pending Review
                        </span>
                        <span>Entity ID: {flag.entityId}</span>
                        <span>Flagged {formatDate(flag.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Reason</h4>
                    <p className="text-gray-700">{flag.reason}</p>
                  </div>

                  {/* Reporter Info */}
                  {flag.reporter && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Reported By</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                          {flag.reporter.avatarUrl ? (
                            <img 
                              src={flag.reporter.avatarUrl} 
                              alt={flag.reporter.name} 
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">👤</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{flag.reporter.name}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const notes = prompt('Resolution notes (optional):');
                        if (notes !== null) handleResolveFlag(flag.id, notes);
                      }}
                      disabled={resolveMutation.isPending}
                      className="flex-1 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {resolveMutation.isPending ? 'Resolving...' : 'Resolve'}
                    </button>
                    
                    <button
                      onClick={() => {
                        const notes = prompt('Dismissal reason (optional):');
                        if (notes !== null) handleDismissFlag(flag.id, notes);
                      }}
                      disabled={dismissMutation.isPending}
                      className="flex-1 rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {dismissMutation.isPending ? 'Dismissing...' : 'Dismiss'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Resource
            </h3>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this resource? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
