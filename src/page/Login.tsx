import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://ample-curiosity-production-21b0.up.railway.app/auth/login', {
        username,
        password,
      });
      console.log('token', res.data.data.access_token);
      localStorage.setItem('token', res.data.data.access_token);
      setMessage('Login success!');
      navigate('/product');
    } catch (err) {
      console.error(err);
      setMessage('Login failed.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4">{message}</p>
    </div>
  );
};

export default Login;
