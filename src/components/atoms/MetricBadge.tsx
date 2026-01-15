/**
 * Atomic Design - Atoms
 * Smallest UI building blocks
 */

// MetricBadge - displays a single metric with label and value
export interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

export function MetricBadge({ label, value, unit = '', color = 'blue', size = 'md' }: MetricBadgeProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-900 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    red: 'bg-red-100 text-red-900 border-red-300',
    blue: 'bg-blue-100 text-blue-900 border-blue-300',
    gray: 'bg-gray-100 text-gray-900 border-gray-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <div className={`rounded-lg border ${colorClasses[color]} ${sizeClasses[size]} font-medium`}>
      <div className="text-opacity-75">{label}</div>
      <div className="text-lg font-bold">
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
    </div>
  );
}

// StatusIcon - PASS/FAIL indicator
export interface StatusIconProps {
  status: 'pass' | 'fail' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function StatusIcon({ status, size = 'md', label }: StatusIconProps) {
  const sizeMap = { sm: '16px', md: '24px', lg: '32px' };
  const statusConfig = {
    pass: { color: '#10b981', icon: '✓', bg: 'bg-green-50', text: 'text-green-600' },
    fail: { color: '#ef4444', icon: '✕', bg: 'bg-red-50', text: 'text-red-600' },
    warning: { color: '#f59e0b', icon: '⚠', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    neutral: { color: '#6b7280', icon: '−', bg: 'bg-gray-50', text: 'text-gray-600' },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${config.bg} ${config.text} px-3 py-2 rounded-lg`}>
      <span style={{ fontSize: sizeMap[size] }}>{config.icon}</span>
      {label && <span className="font-semibold">{label}</span>}
    </div>
  );
}

// AlarmBadge - displays forensic alarm
export interface AlarmBadgeProps {
  alarmName: string;
  isTriggered: boolean;
  description?: string;
}

export function AlarmBadge({ alarmName, isTriggered, description }: AlarmBadgeProps) {
  return (
    <div className={`px-3 py-2 rounded-lg border-2 ${isTriggered ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
      <div className="font-semibold text-sm">{alarmName}</div>
      {description && <div className="text-xs text-gray-600 mt-1">{description}</div>}
    </div>
  );
}

// ProgressBar - visual representation of score (0-100)
export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'green' | 'yellow' | 'red' | 'blue';
}

export function ProgressBar({ value, max = 100, label, color = 'blue' }: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      {label && <div className="text-sm font-semibold mb-1">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${colorClasses[color]}`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="text-xs text-gray-600 mt-1">{percentage.toFixed(0)}%</div>
    </div>
  );
}
