/**
 * Google Login Button Component
 */

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface LoginButtonProps {
  onSuccess?: () => void;
}

export const LoginButton = ({ onSuccess }: LoginButtonProps) => {
  const { login } = useAuth();

  const handleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      login(credentialResponse.credential);
      onSuccess?.();
    }
  };

  const handleError = () => {
    console.error('Login Failed');
    alert('Login failed. Please try again.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center"
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_blue"
        size="large"
        text="continue_with"
        shape="rectangular"
      />
    </motion.div>
  );
};

