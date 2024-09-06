import { useState } from 'react';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;