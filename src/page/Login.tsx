import React, { useState } from 'react';
import axios from '../api/axios'; 
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../slices/authSlice';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // mendapatkan token
      const res = await axios.post('/auth/login', {
        username,
        password,
      });
      const token = res.data.data.access_token;
      
    
      const userRes = await axios.get(`/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data.data;
      console.log("User: ",user)

      // simpan token pada redux
      dispatch(setLogin({
        token,
        user,
      }));

      setMessage('Login success!');
      setShowModal(true);

    
      setTimeout(() => {
        setShowModal(false);
        navigate('/product');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Login failed.');
      setShowModal(true);
    }
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Notification</h3>
            <p className="py-4">{message}</p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
