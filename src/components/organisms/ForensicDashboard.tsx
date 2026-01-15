/**
 * Forensic Dashboard Organism
 * Displays all 10-point alarms with detailed metrics
 */

import { AlarmBadge } from '@/components/atoms/MetricBadge';

export interface ForensicAlarmDetails {
  flag: boolean;
  ratio: number;
  threshold: number;
  explanation: string;
}

export interface ForensicDashboardProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalAlarms: number;
  details: Record<string, ForensicAlarmDetails>;
}

export function ForensicDashboard({ riskLevel, totalAlarms, details }: ForensicDashboardProps) {
  const riskColors = {
    LOW: 'bg-green-50 border-green-200 text-green-900',
    MEDIUM: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    HIGH: 'bg-orange-50 border-orange-200 text-orange-900',
    CRITICAL: 'bg-red-50 border-red-200 text-red-900',
  };

  const alarmLabels: Record<string, string> = {
    paperProfitTrap: 'Paper Profit Trap',
    intangibleBloat: 'Intangible Asset Bloat',
    payableDaysAlarm: 'Extreme Payable Days',
    assetTurnoverTrend: 'Asset Efficiency Decline',
    gaapGap: 'GAAP vs Non-GAAP Gap',
    revenueTrend: 'Revenue Declining',
    marginCompression: 'Margin Compression',
    cashFlowDivergence: 'Cash Flow Divergence',
    accountsReceivableTrend: 'A/R Growing Faster Than Revenue',
    debtMaturity: 'Debt Maturity Crisis',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3">Forensic Analysis</h3>

        <div className={`px-4 py-3 rounded-lg border-2 ${riskColors[riskLevel]}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Risk Level: {riskLevel}</p>
              <p className="text-sm opacity-75">
                {totalAlarms} forensic alarm{totalAlarms !== 1 ? 's' : ''} detected
              </p>
            </div>
            <div className="text-3xl font-bold">{totalAlarms}/10</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(alarmLabels).map(([key, label]) => {
          const alarm = details[key];
          if (!alarm) return null;

          return (
            <div key={key} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{label}</h4>
                <div className={`px-2 py-1 rounded text-xs font-bold ${alarm.flag ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>
                  {alarm.flag ? '🚩 ALARM' : '✓ PASS'}
                </div>
              </div>

              <p className="text-xs text-gray-700 mb-2">{alarm.explanation}</p>

              <div className="text-xs text-gray-600 bg-white p-2 rounded">
                <div>Value: {alarm.ratio.toFixed(2)}</div>
                <div>Threshold: {alarm.threshold.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-sm text-blue-900 mb-2">About These Alarms</h4>
        <p className="text-sm text-blue-800">
          These 10 metrics detect signs of financial manipulation, accounting fraud, and liquidity distress. Higher alarm counts indicate higher risk of
          financial deterioration or hidden problems.
        </p>
      </div>
    </div>
  );
}
