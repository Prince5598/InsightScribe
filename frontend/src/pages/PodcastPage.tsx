import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Download, Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PodcastPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!state.fileName) {
      toast.error('Please upload a PDF file first');
      navigate('/upload');
      return;
    }
  }, [state.fileName, navigate]);

  const generatePodcast = async () => {
    if (!state.fileName) return;

    // First ensure summary exists
    if (!state.summary) {
      toast.loading('Generating summary first...');
      try {
        const summaryResponse = await axios.post('http://localhost:5000/summarize', {
          filename: state.fileName,
        });
        dispatch({ type: 'SET_SUMMARY', payload: summaryResponse.data.summary || summaryResponse.data });
      } catch (error) {
        toast.error('Failed to generate summary required for podcast');
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'podcast', loading: true } });

    try {
      const response = await axios.post('http://localhost:5000/generate_podcast', {
        filename: state.fileName,
      });

      const podcastPath = response.data.podcast_path || response.data.file_path;
      dispatch({ type: 'SET_PODCAST_PATH', payload: podcastPath });
      toast.success('Podcast generated successfully!');
    } catch (error) {
      console.error('Failed to generate podcast:', error);
      toast.error('Failed to generate podcast. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'podcast', loading: false } });
    }
  };

  const togglePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadPodcast = () => {
    if (state.podcastPath) {
      const downloadUrl = `http://localhost:5000/output/${state.podcastPath.split('/').pop()}`;
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
        <h1 className="text-4xl font-bold text-white mb-4">Podcast Generator</h1>
        <p className="text-gray-300 text-lg">
          Transform your research into an engaging audio podcast
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mic className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Audio Podcast</h2>
            </div>
            {state.loadingStates.podcast && (
              <LoadingSpinner size="sm" color="text-emerald-400" />
            )}
          </div>
        </div>

        <div className="p-8">
          {state.loadingStates.podcast ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <LoadingSpinner size="lg" color="text-emerald-400" />
              <h3 className="text-xl font-semibold text-white mb-2 mt-6">
                Generating Podcast...
              </h3>
              <p className="text-gray-300">
                Converting your research into an engaging audio experience. This may take a few minutes.
              </p>
            </motion.div>
          ) : state.podcastPath ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="bg-green-500/10 border border-green-400/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Volume2 className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Podcast Ready!
                </h3>
                <p className="text-gray-300 mb-8">
                  Your research paper has been converted into an engaging audio podcast.
                </p>
              </div>

              {/* Audio Player */}
              <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                <audio
                  ref={setAudioRef}
                  controls
                  className="w-full mb-4"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={`http://localhost:5000/${state.podcastPath}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>

                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlayPause}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full transition-colors duration-200"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadPodcast}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Podcast</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Mic className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                Generate Audio Podcast
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Create an engaging audio podcast from your research paper. Perfect for 
                sharing your findings in an accessible, audio format that can be enjoyed anywhere.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePodcast}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <Mic className="h-6 w-6" />
                <span>Generate Podcast</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {state.podcastPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-blue-500/10 border border-blue-400/30 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Complete Your Research Suite</h3>
          <p className="text-gray-300 mb-4">
            Explore other ways to present your research findings.
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
              onClick={() => navigate('/ppt')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Generate PPT
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PodcastPage;