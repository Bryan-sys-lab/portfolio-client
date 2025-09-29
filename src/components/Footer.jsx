
import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} Brian Mwirigi. All rights reserved.</p>
      <SocialIcons size="text-xl" tooltip={false} />
    </footer>
  );
}
