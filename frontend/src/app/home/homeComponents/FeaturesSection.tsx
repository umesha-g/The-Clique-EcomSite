import { motion } from "framer-motion";
import React from "react";

const features = [
  {
    title: "Getting started",
    description:
      "All you need from A to Z to getting started are available such that you worry less and work smarter",
    icon: "⭐",
  },
  {
    title: "Pricing plan",
    description:
      "We have several plans that are best suited for you and your team to enable you to find the perfect opportunity",
    icon: "🪐",
  },
  {
    title: "Trust",
    description:
      "Trust will help us foster a positive and productive environment that delivers value to our users and customers",
    icon: "💡",
  },
  {
    title: "Collaboration",
    description:
      "Collaboration is the process of working together to complete a task or achieve a goal",
    icon: "👥",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Or choose a category to quickly find the help you need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
