import React from 'react';

const TaskFilters = ({ onPriorityFilter, onSort }) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        onChange={(e) => onPriorityFilter(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="all">모든 우선순위</option>
        <option value="높음">높음</option>
        <option value="중간">중간</option>
        <option value="낮음">낮음</option>
      </select>

      <select
        onChange={(e) => onSort(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="dueDate">마감일순</option>
        <option value="priority">우선순위순</option>
        <option value="name">작업명순</option>
      </select>
    </div>
  );
};

export default TaskFilters;