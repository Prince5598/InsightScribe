import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, FileSpreadsheet, Mic, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Research Papers',
      description: 'Easily upload PDF research papers with our drag-and-drop interface',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/30',
    },
    {
      icon: FileText,
      title: 'Generate Summaries',
      description: 'Get concise, intelligent summaries of complex research papers',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-400/30',
    },
    {
      icon: FileSpreadsheet,
      title: 'Create Presentations',
      description: 'Generate professional PowerPoint presentations from your research',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-400/30',
    },
    {
      icon: Mic,
      title: 'Generate Podcasts',
      description: 'Transform research into engaging audio podcast episodes',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-400/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Research Paper
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {' '}Assistant
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Transform your research papers into summaries, presentations, and podcasts with the power of AI
        </p>
        <Link to="/upload">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`${feature.bgColor} ${feature.borderColor} border backdrop-blur-lg rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300`}
            >
              <Icon className={`h-12 w-12 ${feature.color} mx-auto mb-4`} />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-400 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Upload Paper</h3>
            <p className="text-gray-300 text-sm">Upload your research paper in PDF format</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Choose Tool</h3>
            <p className="text-gray-300 text-sm">Select summary, PPT, or podcast generation</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-400 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Get Results</h3>
            <p className="text-gray-300 text-sm">Download or view your generated content</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;