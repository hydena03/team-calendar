import React from 'react';
import { Plus } from 'lucide-react';

const AddTaskButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <Plus size={20} />
      새 태스크
    </button>
  );
};

export default AddTaskButton;