import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ServicesList from './components/ServicesList';
import ReportsPlaceholder from './components/ReportsPlaceholder';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-brown-50 to-orange-50">
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientList />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="reports" element={<ReportsPlaceholder />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;