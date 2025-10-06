import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

// Custom hook for continuous typewriter effect
const useTypewriter = (text, speed = 100, deleteSpeed = 50, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout;

    const type = () => {
      if (!isDeleting) {
        // Typing phase
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
          timeout = setTimeout(type, speed);
        } else {
          // Finished typing, start deleting after pause
          timeout = setTimeout(() => {
            setIsDeleting(true);
            type();
          }, pauseTime);
        }
      } else {
        // Deleting phase
        if (i > 0) {
          setDisplayText(text.slice(0, i - 1));
          i--;
          timeout = setTimeout(type, deleteSpeed);
        } else {
          // Finished deleting, start typing again after pause
          timeout = setTimeout(() => {
            setIsDeleting(false);
            type();
          }, pauseTime);
        }
      }
    };

    // Start the animation
    timeout = setTimeout(type, speed);

    return () => clearTimeout(timeout);
  }, [text, speed, deleteSpeed, pauseTime, isDeleting]);

  return { displayText, isDeleting };
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function About() {
  const [abouts, setAbouts] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [cardPositions, setCardPositions] = useState({});
  const cardRefs = useRef({});

  // Continuous typewriter effect for "About Me"
  const { displayText, isDeleting } = useTypewriter("About Me", 200, 80, 1000);

  useEffect(() => {
    fetch(`${API_BASE}/api/About`)
      .then(res => res.json())
      .then(setAbouts);
  }, []);

  const renderIcon = (iconName) => {
    if (!iconName) return null;
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" /> : null;
  };

  // Group abouts by category
  const categories = {};
  abouts.forEach(about => {
    if (!categories[about.category]) {
      categories[about.category] = [];
    }
    categories[about.category].push(about);
  });

  // Separate skills for top display
  const skills = categories['Skills'] || [];
  const otherCategories = Object.keys(categories).filter(cat => cat !== 'Skills');

  const categoryCards = otherCategories.map(category => {
    const categoryItems = categories[category];
    const mainCard = categoryItems.find(item => item.title === category) || categoryItems[0];
    const subCards = categoryItems.filter(item => item.title !== category);

    return {
      category,
      mainCard,
      subCards
    };
  });

  return (
    <section
      id="about"
      className="bg-gray-50 dark:bg-gray-900 px-6 py-16"
    >
      <div className="max-w-4xl mx-auto text-center space-y-10">
        {/* Heading with Continuous Typewriter Effect */}
        <motion.div
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span>{displayText}</span>
          <span className={`animate-pulse text-indigo-600 dark:text-indigo-400 ${isDeleting ? 'opacity-75' : ''}`}>|</span>
        </motion.div>

        {/* Dynamic Skills Display */}
        {skills.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                {renderIcon(skill.icon)}
                <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-center">
                  {skill.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
                  {skill.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Category Cards */}
        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {categoryCards.map((catData, index) => (
              <motion.div
                key={catData.category}
                ref={(el) => (cardRefs.current[catData.category] = el)}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition text-left cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                onClick={() => {
                  if (expandedCategory === catData.category) {
                    setExpandedCategory(null);
                  } else {
                    // Calculate position of clicked card
                    const cardElement = cardRefs.current[catData.category];
                    if (cardElement) {
                      const rect = cardElement.getBoundingClientRect();
                      const containerRect = cardElement.closest('.relative').getBoundingClientRect();
                      setCardPositions({
                        [catData.category]: {
                          top: rect.bottom - containerRect.top,
                          left: rect.left - containerRect.left,
                          width: rect.width
                        }
                      });
                    }
                    setExpandedCategory(catData.category);
                  }
                }}
              >
                {renderIcon(catData.mainCard.icon)}
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {catData.category}
                </h3>
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: catData.mainCard.content }}
                />
                <div className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  Click to {expandedCategory === catData.category ? 'collapse' : 'expand'}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Expanded Content - Overlay positioned below clicked card */}
          <AnimatePresence>
            {expandedCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50"
                onClick={() => setExpandedCategory(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {expandedCategory}
                    </h3>
                    <button
                      onClick={() => setExpandedCategory(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryCards
                      .find(cat => cat.category === expandedCategory)
                      ?.subCards.map((subCard, subIndex) => (
                        <motion.div
                          key={subCard.id}
                          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition text-left"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: subIndex * 0.1, duration: 0.3 }}
                        >
                          {renderIcon(subCard.icon)}
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                            {subCard.title}
                          </h4>
                          <div
                            className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                            dangerouslySetInnerHTML={{ __html: subCard.content }}
                          />
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}