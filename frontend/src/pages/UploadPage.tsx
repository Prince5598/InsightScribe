import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UploadPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    dispatch({ type: 'SET_UPLOADING', payload: true });

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch({
        type: 'SET_UPLOADED_FILE',
        payload: { file: selectedFile, fileName: selectedFile.name },
      });

      toast.success('File uploaded successfully!');
      // Don't navigate automatically - let user choose what to do next
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Upload Research Paper</h1>
        <p className="text-gray-300 text-lg">
          Upload your PDF research paper to get started with AI-powered analysis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
      >
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-gray-400 hover:border-blue-400 hover:bg-blue-500/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drag & drop your PDF here
                </h3>
                <p className="text-gray-300 mb-6">or click to browse files</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse Files
                </button>
                <p className="text-sm text-gray-400 mt-4">
                  Supported format: PDF (max 10MB)
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 flex items-center space-x-4">
                  <FileText className="h-12 w-12 text-green-400" />
                  <div className="flex-1 text-left">
                    <h4 className="text-white font-medium">{selectedFile.name}</h4>
                    <p className="text-gray-300 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={removeFile}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={uploadFile}
                  disabled={state.isUploading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  {state.isUploading ? (
                    <>
                      <LoadingSpinner size="sm" color="text-white" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Upload File</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {state.fileName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-green-500/10 border border-green-400/30 rounded-xl p-6 text-center"
        >
          <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">File Uploaded Successfully!</h3>
          <p className="text-gray-300 mb-4">
            You can now generate summaries, presentations, or podcasts from your research paper.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/summary')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Generate Summary
            </button>
            <button
              onClick={() => navigate('/ppt')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Create PPT
            </button>
            <button
              onClick={() => navigate('/podcast')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Generate Podcast
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadPage;