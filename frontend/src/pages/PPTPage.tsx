import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Download, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PPTPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.fileName) {
      toast.error('Please upload a PDF file first');
      navigate('/upload');
      return;
    }
  }, [state.fileName, navigate]);

  const generatePPT = async () => {
    if (!state.fileName) return;

    dispatch({ type: 'SET_LOADING', payload: { type: 'ppt', loading: true } });

    try {
      const response = await axios.post(
        'http://localhost:5000/generate_ppt',
        { filename: state.fileName },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const pptPath = response.data.ppt_path || response.data.file_path;
      dispatch({ type: 'SET_PPT_PATH', payload: pptPath });
      toast.success('PowerPoint presentation generated successfully!');
    } catch (error) {
      console.error('Failed to generate PPT:', error);
      toast.error('Failed to generate PowerPoint. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'ppt', loading: false } });
    }
  };

  const downloadPPT = () => {
    if (state.pptPath) {
      const downloadUrl = `http://localhost:5000/download/${state.pptPath}`;
      window.open(downloadUrl, '_blank');
    }
  };

  if (!state.fileName) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">PowerPoint Generator</h1>
        <p className="text-gray-300 text-lg">
          Generate professional presentations from your research paper
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">PowerPoint Presentation</h2>
            </div>
            {state.loadingStates.ppt && (
              <LoadingSpinner size="sm" color="text-purple-400" />
            )}
          </div>
        </div>

        <div className="p-8">
          {state.loadingStates.ppt ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <LoadingSpinner size="lg" color="text-purple-400" />
              <h3 className="text-xl font-semibold text-white mb-2 mt-6">
                Generating Presentation...
              </h3>
              <p className="text-gray-300">
                This may take a few minutes. Please wait while we create your PowerPoint presentation.
              </p>
            </motion.div>
          ) : state.pptPath ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="bg-green-500/10 border border-green-400/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FileSpreadsheet className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Presentation Ready!
              </h3>
              <p className="text-gray-300 mb-8">
                Your PowerPoint presentation has been generated successfully.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPPT}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <Download className="h-6 w-6" />
                <span>Download PowerPoint</span>
                <ExternalLink className="h-5 w-5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileSpreadsheet className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Generate PowerPoint Presentation
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Transform your research paper into a professional PowerPoint presentation 
                with key findings, methodology, and conclusions beautifully formatted.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePPT}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <FileSpreadsheet className="h-6 w-6" />
                <span>Generate Presentation</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {state.pptPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
          <p className="text-gray-300 mb-4">
            You can also generate a podcast or revisit the summary of your research paper.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/summary')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              View Summary
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/podcast')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Generate Podcast
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PPTPage;