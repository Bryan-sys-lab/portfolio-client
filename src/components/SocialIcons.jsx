// src/components/SocialIcons.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaGithub,
  FaTwitter,
  FaTelegramPlane,
  FaLinkedin,
  FaWhatsapp,
  FaGlobe
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const iconMap = {
  FaGithub: FaGithub,
  FaTwitter: FaTwitter,
  FaTelegramPlane: FaTelegramPlane,
  FaLinkedin: FaLinkedin,
  FaWhatsapp: FaWhatsapp,
  FaGlobe: FaGlobe,
};

const colorMap = {
  FaGithub: 'text-gray-800 dark:text-white',
  FaTwitter: 'text-blue-400',
  FaTelegramPlane: 'text-sky-500',
  FaLinkedin: 'text-blue-700 dark:text-blue-400',
  FaWhatsapp: 'text-green-500',
  FaGlobe: 'text-gray-600 dark:text-gray-400',
};

export default function SocialIcons({ size = 'text-2xl', tooltip = true }) {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/Social`)
      .then(res => res.json())
      .then(data => setSocials(data));
  }, []);

  return (
    <div className="flex justify-center gap-5 flex-wrap mt-4">
      {socials.map((social, index) => {
        const IconComponent = iconMap[social.icon] || FaGlobe;
        const color = colorMap[social.icon] || 'text-gray-600 dark:text-gray-400';
        return (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group rounded-full border border-gray-300 dark:border-gray-600 p-3 ${color} ${size} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <IconComponent />
            {tooltip && (
              <span className="absolute bottom-full mb-2 text-xs opacity-0 group-hover:opacity-100 transition bg-black text-white px-2 py-1 rounded shadow pointer-events-none z-10">
                {social.name}
              </span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}
