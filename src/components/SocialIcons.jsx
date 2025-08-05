// src/components/SocialIcons.jsx

import { motion } from 'framer-motion';
import {
  FaGithub,
  FaTwitter,
  FaTelegramPlane,
  FaLinkedin,
  FaWhatsapp
} from 'react-icons/fa';

const socials = [
  {
    name: 'GitHub',
    icon: <FaGithub />,
    url: 'https://github.com/your_username',
    color: 'text-gray-800 dark:text-white',
  },
  {
    name: 'Twitter',
    icon: <FaTwitter />,
    url: 'https://twitter.com/your_username',
    color: 'text-blue-400',
  },
  {
    name: 'Telegram',
    icon: <FaTelegramPlane />,
    url: 'https://t.me/your_username',
    color: 'text-sky-500',
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedin />,
    url: 'https://linkedin.com/in/your_username',
    color: 'text-blue-700 dark:text-blue-400',
  },
  {
    name: 'WhatsApp',
    icon: <FaWhatsapp />,
    url: 'https://wa.me/254712345678',
    color: 'text-green-500',
  },
];

export default function SocialIcons({ size = 'text-2xl', tooltip = true }) {
  return (
    <div className="flex justify-center gap-5 flex-wrap mt-4">
      {socials.map((social, index) => (
        <motion.a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative group rounded-full border border-gray-300 dark:border-gray-600 p-3 ${social.color} ${size} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
          whileHover={{ scale: 1.2, rotate: 5 }}
        >
          {social.icon}
          {tooltip && (
            <span className="absolute bottom-full mb-2 text-xs opacity-0 group-hover:opacity-100 transition bg-black text-white px-2 py-1 rounded shadow pointer-events-none z-10">
              {social.name}
            </span>
          )}
        </motion.a>
      ))}
    </div>
  );
}
