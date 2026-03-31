"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useStudyGroup, 
  useGroupMembers, 
  useGroupPosts, 
  useCreateGroupPost,
  useUpdateGroupPost,
  useDeleteGroupPost,
  usePinGroupPost,
  useUnpinGroupPost,
  GroupPost,
  StudyGroupCard
} from "@cliniq/ui";

export default function StudyGroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const { data: group, isLoading: groupLoading } = useStudyGroup(groupId);
  const { data: members } = useGroupMembers(groupId);
  const { data: posts, isLoading: postsLoading } = useGroupPosts(groupId);
  
  const createPostMutation = useCreateGroupPost();
  const updatePostMutation = useUpdateGroupPost();
  const deletePostMutation = useDeleteGroupPost();
  const pinMutation = usePinGroupPost();
  const unpinMutation = useUnpinGroupPost();

  const handleCreatePost = async (data: { body: string; pinned?: boolean }) => {
    try {
      await createPostMutation.mutateAsync({ groupId, ...data });
      setShowNewPostModal(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleEditPost = async (postId: string, content: string) => {
    try {
      await updatePostMutation.mutateAsync({ postId, body: content });
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handlePinPost = async (postId: string) => {
    try {
      await pinMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Failed to pin post:', error);
    }
  };

  const handleUnpinPost = async (postId: string) => {
    try {
      await unpinMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Failed to unpin post:', error);
    }
  };

  const handleFlagPost = async (postId: string) => {
    const reason = prompt('Reason for flagging this post:');
    if (reason) {
      // In a real implementation, this would call a flag API
      console.log('Flagging post:', postId, 'Reason:', reason);
    }
  };

  const getUserPermissions = () => {
    if (!group?.userRole) return null;
    
    const permissions = {
      canEdit: group.userRole === 'OWNER' || group.userRole === 'ADMIN',
      canDelete: group.userRole === 'OWNER' || group.userRole === 'ADMIN',
      canPin: group.userRole === 'OWNER' || group.userRole === 'ADMIN' || group.userRole === 'MODERATOR',
      canPost: true, // All members can post
    };
    
    return permissions;
  };

  if (groupLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-12 text-gray-500">Loading group...</div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-12 text-gray-500">Group not found</div>
      </main>
    );
  }

  const permissions = getUserPermissions();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Group Header */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h1>
            <p className="text-gray-600 mb-4">{group.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                {group.privacy === 'PUBLIC' && '🌍'}
                {group.privacy === 'PRIVATE' && '🔒'}
                {group.privacy === 'INVITE_ONLY' && '📧'}
                {group.privacy}
              </span>
              <span className="flex items-center gap-1">
                {group.cadence === 'DAILY' && '📅'}
                {group.cadence === 'WEEKLY' && '📆'}
                {group.cadence === 'BI_WEEKLY' && '📋'}
                {group.cadence === 'MONTHLY' && '🗓️'}
                {group.cadence === 'AS_NEEDED' && '⏰'}
                {group.cadence}
              </span>
              <span>👥 {group.memberCount} members</span>
              <span>💬 {group.postCount} posts</span>
            </div>
          </div>

          {group.userRole && (
            <div className="flex items-center gap-2">
              <span 
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-teal-100 text-teal-800"
              >
                {group.userRole === 'OWNER' && '👑 Owner'}
                {group.userRole === 'ADMIN' && '⚡ Admin'}
                {group.userRole === 'MODERATOR' && '🛡️ Moderator'}
                {group.userRole === 'MEMBER' && '👤 Member'}
              </span>
            </div>
          )}
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{group.memberCount}</div>
            <div className="text-sm text-gray-500">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{group.postCount}</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {new Date(group.lastActivity).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">Last Active</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {permissions?.canPost && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Create Post
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {postsLoading ? (
          <div className="text-center py-12 text-gray-500">Loading posts...</div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <GroupPost
              key={post.id}
              post={post}
              onEdit={permissions?.canEdit ? handleEditPost : undefined}
              onDelete={permissions?.canDelete ? handleDeletePost : undefined}
              onPin={permissions?.canPin ? handlePinPost : undefined}
              onUnpin={permissions?.canPin ? handleUnpinPost : undefined}
              onFlag={handleFlagPost}
              canEdit={permissions?.canEdit}
              canDelete={permissions?.canDelete}
              canPin={permissions?.canPin}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">No posts yet</div>
            <p className="text-sm mb-4">
              Be the first to start a conversation in this group!
            </p>
            {permissions?.canPost && (
              <button
                onClick={() => setShowNewPostModal(true)}
                className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                Create First Post
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <NewPostModal
          onSubmit={handleCreatePost}
          onCancel={() => setShowNewPostModal(false)}
          isLoading={createPostMutation.isPending}
        />
      )}
    </main>
  );
}

// New Post Modal Component
function NewPostModal({ onSubmit, onCancel, isLoading }: any) {
  const [formData, setFormData] = useState({
    body: '',
    pinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              required
              minLength={1}
              maxLength={2000}
              rows={6}
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Share your thoughts, questions, or resources with the group..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.body.length}/2000 characters
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
              disabled={isLoading || !formData.body.trim()}
              className="flex-1 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isLoading ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
