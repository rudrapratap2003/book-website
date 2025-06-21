
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Choose = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0dfd9] text-orange-600">
      <div className="text-4xl mb-2">
        <i className="fas fa-shopping-cart"></i>
      </div>
      <h1 className="text-2xl font-semibold mb-10 tracking-wider">
        WHAT DO YOU WANT?
      </h1>
      <div className="flex space-x-10">
        <button
          onClick={() => navigate('/sell')}
          className="border-2 border-orange-500 px-6 py-3 text-sm tracking-widest hover:bg-orange-100 transition rounded-md"
        >
          WANT TO SELL
        </button>
        <button
          onClick={() => navigate('/buy')}
          className="border-2 border-orange-500 px-6 py-3 text-sm tracking-widest hover:bg-orange-100 transition rounded-md"
        >
          WANT TO BUY
        </button>
      </div>
    </div>
  );
};

export default Choose;
