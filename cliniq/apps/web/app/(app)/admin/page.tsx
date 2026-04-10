'use client';

import { useState } from 'react';
import { 
  AdminDashboard, 
  ModerationQueue,
  useSystemStats,
  useSystemAlerts,
  useModerationQueue,
  useResolveModerationItem,
  useDismissModerationItem,
  useAdminPermissions,
  AdminRole,
  ModerationAction
} from '@cliniq/ui';


export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation' | 'users' | 'analytics' | 'settings'>('dashboard');
  
  const { data: stats } = useSystemStats();
  const { data: alerts } = useSystemAlerts();
  const { data: queue, isLoading: queueLoading } = useModerationQueue({ status: 'PENDING' });
  const { data: permissions } = useAdminPermissions();
  
  const resolveMutation = useResolveModerationItem();
  const dismissMutation = useDismissModerationItem();

  const handleResolveModeration = (itemId: string, action: ModerationAction, reason?: string) => {
    resolveMutation.mutate({ id: itemId, action, reason });
  };

  const handleDismissModeration = (itemId: string) => {
    dismissMutation.mutate(itemId);
  };

  const userRole = permissions?.admin?.role || AdminRole.ADMIN;
  const userPermissions = permissions?.allPermissions || [];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'moderation', label: 'Moderation', icon: '🚩', badge: queue?.total || 0 },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                {userRole} • {userPermissions.length} permissions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Quick Actions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            alerts={alerts || []}
            userRole={userRole}
            userPermissions={userPermissions}
          />
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Content Moderation</h2>
              <p className="text-gray-600">Review and manage reported content</p>
            </div>
            
            <ModerationQueue
              queue={queue?.queue || []}
              onResolve={handleResolveModeration}
              onDismiss={handleDismissModeration}
              loading={queueLoading}
            />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats?.users.total || 0}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats?.users.active || 0}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats?.users.verified || 0}</div>
                  <div className="text-sm text-gray-600">Verified Users</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View All Users
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Add Admin User
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Export Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
              <p className="text-gray-600">View system analytics and generate reports</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Active Users</span>
                    <span className="font-semibold">{stats?.engagement.dailyActive || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Active Users</span>
                    <span className="font-semibold">{stats?.engagement.weeklyActive || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Active Users</span>
                    <span className="font-semibold">{stats?.engagement.monthlyActive || 0}</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Detailed Analytics
                </button>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Content Analytics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions</span>
                    <span className="font-semibold">{stats?.content.questions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Answers</span>
                    <span className="font-semibold">{stats?.content.answers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Resources</span>
                    <span className="font-semibold">{stats?.content.resources || 0}</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              <p className="text-gray-600">Configure system-wide settings and preferences</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Maintenance Mode</div>
                        <div className="text-sm text-gray-600">Put the system in maintenance mode</div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">User Registrations</div>
                        <div className="text-sm text-gray-600">Allow new user registrations</div>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Send email notifications to users</div>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Enabled
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">System Health</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                      <div className="font-semibold text-green-600">{stats?.system.uptime || 0}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚠️</div>
                      <div className="text-sm text-gray-600">Error Rate</div>
                      <div className="font-semibold text-orange-600">{stats?.system.errorRate || 0}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">⏱️</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                      <div className="font-semibold text-blue-600">{stats?.system.responseTime || 0}ms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">💾</div>
                      <div className="text-sm text-gray-600">Storage</div>
                      <div className="font-semibold text-purple-600">{Math.round((stats?.system.storageUsed || 0) / 1024 / 1024)}MB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
