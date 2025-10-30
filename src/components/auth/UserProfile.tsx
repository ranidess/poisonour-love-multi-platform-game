/**
 * User Profile Component
 * Shows logged-in user info and logout option
 */

import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  onLogout?: () => void;
}

export const UserProfile = ({ onLogout }: UserProfileProps) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border-2 border-white/30"
    >
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-game text-sm font-bold truncate">
          {user.name}
        </p>
        <p className="text-white/70 font-game text-xs truncate">
          {user.email}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="text-white/80 hover:text-white font-game text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-all"
      >
        Logout
      </button>
    </motion.div>
  );
};

