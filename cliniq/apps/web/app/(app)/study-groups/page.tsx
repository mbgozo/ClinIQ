"use client";

import { useState } from "react";
import { 
  useStudyGroups, 
  useMyStudyGroups, 
  useCreateStudyGroup, 
  useJoinStudyGroup,
  StudyGroupCard 
} from "@cliniq/ui";

export default function StudyGroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [filters, setFilters] = useState({
    categoryId: "",
    institution: "",
    privacy: "",
    cadence: "",
    search: "",
    hasSpace: false,
  });

  const { data: groupsData, isLoading, error } = useStudyGroups(filters);
  const { data: myGroups } = useMyStudyGroups();
  const createMutation = useCreateStudyGroup();
  const joinMutation = useJoinStudyGroup();

  const groups = groupsData?.groups || [];
  const total = groupsData?.total || 0;

  const handleCreateGroup = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleJoinGroup = async (groupId: string, inviteCode?: string) => {
    try {
      await joinMutation.mutateAsync({ groupId, inviteCode });
      setShowJoinModal(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleJoinClick = (group: any) => {
    if (group.privacy === 'PRIVATE') {
      setSelectedGroup(group);
      setShowJoinModal(true);
    } else {
      handleJoinGroup(group.id);
    }
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      institution: "",
      privacy: "",
      cadence: "",
      search: "",
      hasSpace: false,
    });
  };

  const myGroupIds = myGroups?.map(g => g.id) || [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
          <p className="text-gray-600">
            Connect with fellow nursing students for collaborative learning and exam preparation.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* My Groups */}
      {myGroups && myGroups.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onManage={() => window.location.href = `/study-groups/${group.id}`}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Discover Groups</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search groups..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
            <select
              value={filters.privacy}
              onChange={(e) => setFilters(prev => ({ ...prev, privacy: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Privacy</option>
              <option value="PUBLIC">🌍 Public</option>
              <option value="PRIVATE">🔒 Private</option>
              <option value="INVITE_ONLY">📧 Invite Only</option>
            </select>
          </div>

          {/* Cadence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Cadence</label>
            <select
              value={filters.cadence}
              onChange={(e) => setFilters(prev => ({ ...prev, cadence: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Cadences</option>
              <option value="DAILY">📅 Daily</option>
              <option value="WEEKLY">📆 Weekly</option>
              <option value="BI_WEEKLY">📋 Bi-Weekly</option>
              <option value="MONTHLY">🗓️ Monthly</option>
              <option value="AS_NEEDED">⏰ As Needed</option>
            </select>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
            <input
              type="text"
              placeholder="Filter by institution..."
              value={filters.institution}
              onChange={(e) => setFilters(prev => ({ ...prev, institution: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Has Space */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasSpace}
                onChange={(e) => setFilters(prev => ({ ...prev, hasSpace: e.target.checked }))}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Only show groups with space</span>
            </label>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Found {total} group{total !== 1 ? 's' : ''}
          </p>
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading groups...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Failed to load groups.</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No groups found</div>
          <p className="text-sm mb-4">
            Try adjusting your filters or create a new group!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Create First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <StudyGroupCard
              key={group.id}
              group={{
                ...group,
                userRole: myGroupIds.includes(group.id) ? 'MEMBER' : undefined
              }}
              onJoin={handleJoinClick}
              onManage={() => window.location.href = `/study-groups/${group.id}`}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onSubmit={handleCreateGroup}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <JoinGroupModal
          group={selectedGroup}
          onSubmit={(inviteCode) => handleJoinGroup(selectedGroup.id, inviteCode)}
          onCancel={() => setShowJoinModal(false)}
          isLoading={joinMutation.isPending}
        />
      )}
    </main>
  );
}

// Create Group Modal Component
function CreateGroupModal({ onSubmit, onCancel, isLoading }: any) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    institution: '',
    privacy: 'PUBLIC',
    cadence: 'WEEKLY',
    maxMembers: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Study Group</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={100}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              required
              minLength={10}
              maxLength={500}
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Describe the group's purpose and goals"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
              <select
                value={formData.privacy}
                onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="PUBLIC">🌍 Public</option>
                <option value="PRIVATE">🔒 Private</option>
                <option value="INVITE_ONLY">📧 Invite Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cadence</label>
              <select
                value={formData.cadence}
                onChange={(e) => setFormData(prev => ({ ...prev, cadence: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="DAILY">📅 Daily</option>
                <option value="WEEKLY">📆 Weekly</option>
                <option value="BI_WEEKLY">📋 Bi-Weekly</option>
                <option value="MONTHLY">🗓️ Monthly</option>
                <option value="AS_NEEDED">⏰ As Needed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
              <input
                type="number"
                min={2}
                max={100}
                value={formData.maxMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: Number(e.target.value) }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Join Group Modal Component
function JoinGroupModal({ group, onSubmit, onCancel, isLoading }: any) {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inviteCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Join Private Group</h2>
        
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-medium text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code *</label>
            <input
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Enter 8-character invite code"
              maxLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask the group owner for the invite code
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
