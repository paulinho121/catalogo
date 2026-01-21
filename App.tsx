
import React, { useState } from 'react';
import { AppView } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ChatView } from './components/ChatView';
import { VoiceView } from './components/VoiceView';
import { AdminView } from './components/AdminView';
import { RegisterView } from './components/RegisterView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Dashboard setView={setCurrentView} />;
      case AppView.CHAT:
        return <ChatView />;
      case AppView.VOICE:
        return <VoiceView />;
      case AppView.ADMIN:
        return <AdminView />;
      case AppView.REGISTER:
        return <RegisterView />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
