import React from 'react';
import { Filter } from 'lucide-react'; // 필터 아이콘

const TaskFilters = ({ onFilterChange, filters }) => {
  const handleChange = (field, value) => {
    console.log('Filter changing:', { field, value, currentFilters: filters }); // 디버깅
    onFilterChange(field, value);
  };
  
  return (
    <div className="mb-6 p-4 grid grid-cols-1 md:grid-cols-5 gap-4 bg-white rounded-lg shadow">
      {/* 우선순위 필터 */}
      <div className="relative">
        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 우선순위</option>
          <option value="높음">높음</option>
          <option value="중간">중간</option>
          <option value="낮음">낮음</option>
        </select>
      </div>

        {/* 상태 필터 */}
      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 상태</option>
          <option value="시작전">시작전</option>
          <option value="진행중">진행중</option>
          <option value="완료">완료</option>
        </select>
      </div>

        {/* 정렬 */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
          <option value="name">작업명순</option>
        </select>
      </div>

        {/* 검색 */}
      <div className="relative">
        <input
          type="text"
          placeholder="검색..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

        {/* 담당자 필터 */}
      <div className="relative">
        <select
          value={filters.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
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