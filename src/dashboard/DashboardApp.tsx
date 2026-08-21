import { useState } from 'react';
import './print.css';
import { AuthProvider, useAuth } from './lib/auth';
import { LangProvider } from './lib/i18n';
import { Login } from './components/screens/Login';
import { Shell } from './components/layout/Shell';
import { AdminOverview } from './components/screens/AdminOverview';
import { TraineeRegister } from './components/screens/TraineeRegister';
import { TraineeDetail } from './components/screens/TraineeDetail';
import { SkillMatrix } from './components/screens/SkillMatrix';
import { ApprovalQueue } from './components/screens/ApprovalQueue';
import { ReportsCentre } from './components/screens/ReportsCentre';
import { AuditTrail } from './components/screens/AuditTrail';
import { StationMaster } from './components/screens/StationMaster';

export type ScreenId = 'overview' | 'trainees' | 'trainee-detail' | 'stations' | 'matrix' | 'approvals' | 'reports' | 'audit';

export interface Nav {
  screen: ScreenId;
  params?: Record<string, string>;
  go: (screen: ScreenId, params?: Record<string, string>) => void;
}

function Router() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<ScreenId>('overview');
  const [params, setParams] = useState<Record<string, string>>({});

  if (!user) return <Login />;

  const go = (s: ScreenId, p?: Record<string, string>) => {
    setScreen(s);
    setParams(p ?? {});
    window.scrollTo(0, 0);
  };
  const nav: Nav = { screen, params, go };

  return (
    <Shell nav={nav}>
      {screen === 'overview' && <AdminOverview nav={nav} />}
      {screen === 'trainees' && <TraineeRegister nav={nav} />}
      {screen === 'trainee-detail' && <TraineeDetail nav={nav} traineeId={params.id} />}
      {screen === 'stations' && <StationMaster nav={nav} />}
      {screen === 'matrix' && <SkillMatrix nav={nav} />}
      {screen === 'approvals' && <ApprovalQueue nav={nav} />}
      {screen === 'reports' && <ReportsCentre nav={nav} />}
      {screen === 'audit' && <AuditTrail nav={nav} />}
    </Shell>
  );
}

export default function DashboardApp() {
  return (
    <LangProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </LangProvider>
  );
}
