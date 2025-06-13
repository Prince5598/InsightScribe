import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, AlertCircle, BookOpen, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';

const SummaryPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.fileName) {
      toast.error('Please upload a PDF file first');
      navigate('/upload');
      return;
    }
  }, [state.fileName, navigate]);

  const generateSummary = async () => {
    if (!state.fileName) return;

    dispatch({ type: 'SET_LOADING', payload: { type: 'summary', loading: true } });

    try {
      const response = await axios.post('http://localhost:5000/summarize', {
        filename: state.fileName,
      });

      dispatch({ type: 'SET_SUMMARY', payload: response.data.summary || response.data });
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'summary', loading: false } });
    }
  };

  const copyToClipboard = () => {
    if (state.summary) {
      navigator.clipboard.writeText(state.summary);
      toast.success('Summary copied to clipboard!');
    }
  };

  // Function to format the summary text into structured sections
  const formatSummary = (text: string) => {
    // Split by common section indicators or double line breaks
    const sections = text.split(/\n\s*\n|\n(?=\d+\.|\*|\-|•)/);
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      if (!trimmedSection) return null;

      // Check if it's a numbered point or bullet point
      const isNumberedPoint = /^\d+\./.test(trimmedSection);
      const isBulletPoint = /^[\*\-•]/.test(trimmedSection);
      const isTitle = trimmedSection.length < 100 && !trimmedSection.includes('.');

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`${
            isTitle 
              ? 'mb-4' 
              : isNumberedPoint || isBulletPoint 
                ? 'mb-4 pl-4 border-l-2 border-blue-400/30' 
                : 'mb-6'
          }`}
        >
          {isTitle ? (
            <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>{trimmedSection}</span>
            </h3>
          ) : isNumberedPoint ? (
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-400/20">
              <p className="text-gray-200 leading-relaxed">{trimmedSection}</p>
            </div>
          ) : isBulletPoint ? (
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-400/20">
              <p className="text-gray-200 leading-relaxed">{trimmedSection}</p>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-gray-200 leading-relaxed">{trimmedSection}</p>
            </div>
          )}
        </motion.div>
      );
    }).filter(Boolean);
  };

  if (!state.fileName) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Research Summary</h1>
        <p className="text-gray-300 text-lg">
          AI-generated summary of your research paper
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Summary</h2>
              {state.summary && (
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  Ready
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {state.loadingStates.summary && (
                <LoadingSpinner size="sm" color="text-blue-400" />
              )}
              {state.summary && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Copy</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {state.loadingStates.summary ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <LoadingSpinner size="lg" color="text-blue-400" />
                <h3 className="text-xl font-semibold text-white mb-2 mt-6">
                  Analyzing Your Research Paper...
                </h3>
                <p className="text-gray-300">
                  Our AI is reading through your paper and extracting key insights.
                </p>
              </div>
              <SkeletonLoader />
            </div>
          ) : state.summary ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{state.summary.split(' ').length}</div>
                  <div className="text-sm text-gray-300">Words</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 text-center">
                  <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{state.summary.split('\n').filter(line => line.trim()).length}</div>
                  <div className="text-sm text-gray-300">Key Points</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4 text-center">
                  <Lightbulb className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{Math.ceil(state.summary.split(' ').length / 200)}</div>
                  <div className="text-sm text-gray-300">Min Read</div>
                </div>
              </div>

              {/* Formatted Summary Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Summary Content</h3>
                </div>
                
                <div className="space-y-4">
                  {formatSummary(state.summary)}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="h-16 w-16 text-blue-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Generate Summary
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Create an intelligent summary of your research paper that highlights 
                key findings, methodology, and conclusions in a concise, easy-to-read format.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateSummary}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <FileText className="h-6 w-6" />
                <span>Generate Summary</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {state.summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
          <p className="text-gray-300 mb-4">
            Transform your research into presentations or podcasts for wider impact.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/ppt')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Generate PPT
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/podcast')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Create Podcast
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SummaryPage;