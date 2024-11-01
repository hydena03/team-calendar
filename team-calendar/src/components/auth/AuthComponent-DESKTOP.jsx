import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">
        {isLogin ? '로그인' : '회원가입'}
      </h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-black">이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 text-black">비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin ? '회원가입하기' : '로그인하기'}
      </button>
    </div>
  );
};

export default AuthComponent;