import { useState } from 'react';
import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    // TODO: Implement login logic
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white rounded shadow-md"
      >
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <AuthForm onSubmit={handleSubmit} isLoading={isLoading} />
      </motion.div>
    </div>
  );
};

export default LoginPage;