import React from 'react';
import { Filter } from 'lucide-react'; // 필터 아이콘

const TaskFilters = ({ onFilterChange, filters }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-gray-500" />
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 우선순위</option>
          <option value="높음">높음</option>
          <option value="중간">중간</option>
          <option value="낮음">낮음</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 상태</option>
          <option value="시작전">시작전</option>
          <option value="진행중">진행중</option>
          <option value="완료">완료</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
          <option value="name">작업명순</option>
        </select>

        <input
          type="text"
          placeholder="태스크 검색..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filters.assignee}
          onChange={(e) => onFilterChange('assignee', e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 담당자</option>
          {filters.assigneeList.map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;