import React from 'react';
import { Calendar } from 'lucide-react';

const Header = () => {
  return (
    <header className="p-4 bg-white shadow">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        <h1 className="text-xl font-bold">팀 일정관리</h1>
      </div>
    </header>
  );
};

export default Header;