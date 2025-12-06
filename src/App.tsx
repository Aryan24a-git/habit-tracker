import { useState } from 'react';
import { InstallPWA } from './components/InstallPWA';
import { HabitProvider } from './context/HabitContext';
import { Layout, Dashboard, Analytics } from './components';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'analytics'>('dashboard');

  return (
    <HabitProvider>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'habits' && <Dashboard />} {/* Reusing Dashboard for Habits tab for now */}
        {activeTab === 'analytics' && <Analytics />}
      </Layout>
      <InstallPWA />
    </HabitProvider>
  );
}

export default App;
