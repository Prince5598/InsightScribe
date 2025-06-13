import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import SummaryPage from './pages/SummaryPage';
import PPTPage from './pages/PPTPage';
import PodcastPage from './pages/PodcastPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="ppt" element={<PPTPage />} />
            <Route path="podcast" element={<PodcastPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;