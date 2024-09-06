import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginSignup = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const containerVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const transition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <motion.div 
        className="w-1/2 flex items-center justify-center bg-indigo-900"
        initial={false}
        animate={{ x: isSignIn ? '0%' : '100%' }}
        transition={transition}
      >
        <div className="w-full max-w-md p-8">
          <AnimatePresence initial={false} custom={isSignIn ? -1 : 1}>
            <motion.div
              key={isSignIn ? 'signin' : 'signup-prompt'}
              custom={isSignIn ? -1 : 1}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="w-full"
            >
              {isSignIn ? (
                <SignInForm />
              ) : (
                <div className="text-white text-center">
                  <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
                  <p className="mb-8 text-indigo-200">Already have an account? Sign in to continue your journey.</p>
                  <button
                    onClick={toggleForm}
                    className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-full hover:bg-indigo-100 transition duration-300"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div 
        className="w-1/2 flex items-center justify-center bg-purple-900"
        initial={false}
        animate={{ x: isSignIn ? '0%' : '-100%' }}
        transition={transition}
      >
        <div className="w-full max-w-md p-8">
          <AnimatePresence initial={false} custom={isSignIn ? 1 : -1}>
            <motion.div
              key={isSignIn ? 'signup-prompt' : 'signup'}
              custom={isSignIn ? 1 : -1}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="w-full"
            >
              {isSignIn ? (
                <div className="text-white text-center">
                  <h2 className="text-3xl font-bold mb-6">Join Us</h2>
                  <p className="mb-8 text-purple-200">Don't have an account? Sign up and start your adventure today.</p>
                  <button
                    onClick={toggleForm}
                    className="bg-white text-purple-900 font-bold py-3 px-6 rounded-full hover:bg-purple-100 transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <SignUpForm />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const SignInForm = () => (
  <form className="w-full">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h2>
    <div className="mb-6">
      <input
        className="w-full bg-indigo-800 text-white border-2 border-indigo-700 rounded-lg py-3 px-4 placeholder-indigo-400 focus:outline-none focus:border-indigo-500 transition duration-300"
        type="email"
        placeholder="Email"
      />
    </div>
    <div className="mb-6">
      <input
        className="w-full bg-indigo-800 text-white border-2 border-indigo-700 rounded-lg py-3 px-4 placeholder-indigo-400 focus:outline-none focus:border-indigo-500 transition duration-300"
        type="password"
        placeholder="Password"
      />
    </div>
    <div className="flex items-center justify-center">
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
        type="button"
      >
        Sign In
      </button>
    </div>
  </form>
);

const SignUpForm = () => (
  <form className="w-full">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
    <div className="mb-6">
      <input
        className="w-full bg-purple-800 text-white border-2 border-purple-700 rounded-lg py-3 px-4 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition duration-300"
        type="text"
        placeholder="Full Name"
      />
    </div>
    <div className="mb-6">
      <input
        className="w-full bg-purple-800 text-white border-2 border-purple-700 rounded-lg py-3 px-4 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition duration-300"
        type="email"
        placeholder="Email"
      />
    </div>
    <div className="mb-6">
      <input
        className="w-full bg-purple-800 text-white border-2 border-purple-700 rounded-lg py-3 px-4 placeholder-purple-400 focus:outline-none focus:border-purple-500 transition duration-300"
        type="password"
        placeholder="Password"
      />
    </div>
    <div className="flex items-center justify-center">
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
        type="button"
      >
        Sign Up
      </button>
    </div>
  </form>
);

export default LoginSignup;
