import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/10 rounded-lg p-4 space-y-3"
        >
          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;