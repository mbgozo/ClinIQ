import { useState, useEffect } from 'react';
import { 
  SystemStats, 
  SystemAlert, 
  AdminRole, 
  Permission,
  ADMIN_ROLE_DEFINITIONS,
  PERMISSION_DEFINITIONS
} from '@cliniq/shared-types';

interface AdminDashboardProps {
  stats?: SystemStats;
  alerts?: SystemAlert[];
  userRole?: AdminRole;
  userPermissions?: Permission[];
  className?: string;
}

export function AdminDashboard({ 
  stats, 
  alerts = [], 
  userRole = AdminRole.ADMIN,
  userPermissions = [],
  className = ''
}: AdminDashboardProps) {
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const hasPermission = (permission: Permission) => {
    return userPermissions.includes(permission);
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      INFO: 'ℹ️',
      WARNING: '⚠️',
      ERROR: '❌',
      SUCCESS: '✅',
      MAINTENANCE: '🔧',
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  };

  const getAlertColor = (type: string) => {
    const colors = {
      INFO: 'bg-blue-50 border-blue-200 text-blue-800',
      WARNING: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      ERROR: 'bg-red-50 border-red-200 text-red-800',
      SUCCESS: 'bg-green-50 border-green-200 text-green-800',
      MAINTENANCE: 'bg-gray-50 border-gray-200 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.INFO;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };

  const dismissAlert = async (alertId: string) => {
    // This would call the dismiss alert API
    console.log('Dismissing alert:', alertId);
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{formatPercentage(trend.value)}</span>
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getAlertIcon(alert.type)}</span>
                  <div>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-xs mt-2 opacity-75">
                      {new Date(alert.startsAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-lg hover:opacity-75"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {hasPermission(Permission.MANAGE_USERS) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Manage Users</div>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">🚩</div>
              <div className="text-sm font-medium">Moderation Queue</div>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Analytics</div>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium">System Settings</div>
            </button>
          </div>
        </div>
      )}

      {/* System Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={formatNumber(stats.users.total)}
            subtitle={`${formatNumber(stats.users.new)} new this week`}
            icon="👥"
            color="text-blue-600"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Active Users"
            value={formatNumber(stats.users.active)}
            subtitle={`${formatPercentage((stats.users.active / stats.users.total) * 100)} of total`}
            icon="🟢"
            color="text-green-600"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Total Content"
            value={formatNumber(stats.content.questions + stats.content.answers + stats.content.resources)}
            subtitle={`${stats.content.questions} questions, ${stats.content.answers} answers`}
            icon="📚"
            color="text-purple-600"
            trend={{ value: 15.3, isPositive: true }}
          />
          <StatCard
            title="Pending Flags"
            value={stats.moderation.pendingFlags}
            subtitle="Need attention"
            icon="🚩"
            color="text-orange-600"
            trend={{ value: 5.1, isPositive: false }}
          />
        </div>
      )}

      {/* Content Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Content Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Questions</span>
                <span className="font-semibold">{formatNumber(stats.content.questions)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Answers</span>
                <span className="font-semibold">{formatNumber(stats.content.answers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resources</span>
                <span className="font-semibold">{formatNumber(stats.content.resources)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Study Groups</span>
                <span className="font-semibold">{formatNumber(stats.content.studyGroups)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Engagement</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Interactions</span>
                <span className="font-semibold">{formatNumber(stats.engagement.totalInteractions)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Active</span>
                <span className="font-semibold">{formatNumber(stats.engagement.dailyActive)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weekly Active</span>
                <span className="font-semibold">{formatNumber(stats.engagement.weeklyActive)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Active</span>
                <span className="font-semibold">{formatNumber(stats.engagement.monthlyActive)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Health */}
      {stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-gray-600">Uptime</div>
              <div className="font-semibold text-green-600">{formatPercentage(stats.system.uptime)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="font-semibold text-orange-600">{formatPercentage(stats.system.errorRate)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm text-gray-600">Response Time</div>
              <div className="font-semibold text-blue-600">{stats.system.responseTime}ms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💾</div>
              <div className="text-sm text-gray-600">Storage Used</div>
              <div className="font-semibold text-purple-600">{formatNumber(stats.system.storageUsed / 1024 / 1024)}MB</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">New user registration</span>
            <span className="text-gray-400">2 minutes ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Question posted in Pharmacology</span>
            <span className="text-gray-400">5 minutes ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Content flagged for review</span>
            <span className="text-gray-400">12 minutes ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Resource uploaded</span>
            <span className="text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
