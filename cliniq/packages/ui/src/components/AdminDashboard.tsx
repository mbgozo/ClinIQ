import { useState } from 'react';
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

// Inline SVG icon helpers
const InfoIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const WarningIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);
const ErrorIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const SuccessIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const MaintenanceIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);
const FlagIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6H10.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);
const ChartIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const BookIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const ZapIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const DatabaseIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);
const ActiveDotIcon = () => (
  <div className="w-3 h-3 rounded-full bg-green-500" />
);

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
    switch (type) {
      case 'INFO': return <InfoIcon />;
      case 'WARNING': return <WarningIcon />;
      case 'ERROR': return <ErrorIcon />;
      case 'SUCCESS': return <SuccessIcon />;
      case 'MAINTENANCE': return <MaintenanceIcon />;
      default: return <InfoIcon />;
    }
  };

  const getAlertColor = (type: string) => {
    const colors: Record<string, string> = {
      INFO: 'bg-blue-50 border-blue-200 text-blue-800',
      WARNING: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      ERROR: 'bg-red-50 border-red-200 text-red-800',
      SUCCESS: 'bg-green-50 border-green-200 text-green-800',
      MAINTENANCE: 'bg-gray-50 border-gray-200 text-gray-800',
    };
    return colors[type] || colors.INFO;
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
    console.log('Dismissing alert:', alertId);
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
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
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{formatPercentage(trend.value)}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
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
                  <span className="mt-0.5 flex-shrink-0">{getAlertIcon(alert.type)}</span>
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
                  className="ml-4 text-lg leading-none hover:opacity-75 flex-shrink-0"
                  aria-label="Dismiss alert"
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
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors">
              <div className="mb-2 text-blue-600"><UsersIcon /></div>
              <div className="text-sm font-medium">Manage Users</div>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors">
              <div className="mb-2 text-orange-600"><FlagIcon /></div>
              <div className="text-sm font-medium">Moderation Queue</div>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors">
              <div className="mb-2 text-purple-600"><ChartIcon /></div>
              <div className="text-sm font-medium">Analytics</div>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors">
              <div className="mb-2 text-gray-600"><SettingsIcon /></div>
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
            icon={<UsersIcon />}
            color="text-blue-600"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Active Users"
            value={formatNumber(stats.users.active)}
            subtitle={`${formatPercentage((stats.users.active / stats.users.total) * 100)} of total`}
            icon={<ActiveDotIcon />}
            color="text-green-600"
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Total Content"
            value={formatNumber(stats.content.questions + stats.content.answers + stats.content.resources)}
            subtitle={`${stats.content.questions} questions, ${stats.content.answers} answers`}
            icon={<BookIcon />}
            color="text-purple-600"
            trend={{ value: 15.3, isPositive: true }}
          />
          <StatCard
            title="Pending Flags"
            value={stats.moderation.pendingFlags}
            subtitle="Need attention"
            icon={<FlagIcon />}
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
              <div className="flex justify-center mb-2 text-green-600"><ZapIcon /></div>
              <div className="text-sm text-gray-600">Uptime</div>
              <div className="font-semibold text-green-600">{formatPercentage(stats.system.uptime)}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 text-orange-600"><WarningIcon /></div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="font-semibold text-orange-600">{formatPercentage(stats.system.errorRate)}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 text-blue-600"><ClockIcon /></div>
              <div className="text-sm text-gray-600">Response Time</div>
              <div className="font-semibold text-blue-600">{stats.system.responseTime}ms</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 text-purple-600"><DatabaseIcon /></div>
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
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">New user registration</span>
            <span className="text-gray-400">2 minutes ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">Question posted in Pharmacology</span>
            <span className="text-gray-400">5 minutes ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">Content flagged for review</span>
            <span className="text-gray-400">12 minutes ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600">Resource uploaded</span>
            <span className="text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
