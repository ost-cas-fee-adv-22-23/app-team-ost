import { motion } from 'framer-motion';
import { LayoutProps } from './types/page-with-layout';

const Motion: LayoutProps = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: 'easeIn',
      }}
    >
      {children}
    </motion.div>
  );
};

export default Motion;
