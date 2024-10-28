import React, { useState } from 'react';


const TaskTable = ({ tasks, onStatusChange }) => {
  const statusOptions = ['시작', '진행중', '완료'];
  const priorityOptions = ['높음', '중간', '낮음'];  // 추가
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 우선순위에 따른 배지 스타일 함수
  const getPriorityBadgeStyle = (priority) => {
    const styles = {
      '높음': 'bg-red-100 text-red-800',
      '중간': 'bg-yellow-100 text-yellow-800',
      '낮음': 'bg-green-100 text-green-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  // ... (기존 calculateDaysRemaining 함수와 다른 함수들은 그대로 유지)

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 한국 시간대로 변환
    const due = new Date(dueDate + 'T00:00:00+09:00');
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return <span className="text-red-500">D+{Math.abs(diffDays)}</span>;
    } else if (diffDays === 0) {
        return <span className="text-orange-500">D-Day</span>;
    } else {
        return <span className="text-blue-500">D-{diffDays}</span>;
    }
};

  // 셀 클릭 시 편집 모드로 전환
  const handleCellClick = (taskId, field, value) => {
    setEditingCell({ taskId, field });
    setEditValue(value);
  };

  // 편집 완료 시 처리
  // TaskTable.jsx에서 handleEditComplete 함수를 다음과 같이 수정
  const handleEditComplete = (taskId, field) => {
    // 실제로 데이터를 업데이트하도록 수정
    onStatusChange(taskId, field, editValue);  
    setEditingCell(null);
    setEditValue('');
  };

  // 편집 가능한 셀 렌더링
  const renderEditableCell = (task, field, value) => {
    const isEditing = editingCell?.taskId === task.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <input
          type={field === 'dueDate' ? 'date' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleEditComplete(task.id, field)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleEditComplete(task.id, field);
            }
          }}
          className="w-full px-2 py-1 border rounded"
          autoFocus
        />
      );
    }

    return (
      <div 
        onClick={() => handleCellClick(task.id, field, value)}
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
      >
        {value}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-sm rounded-lg">
        {/* ... thead 부분은 그대로 ... */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">우선순위</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업명</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">요약</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={task.priority}
                  onChange={(e) => onStatusChange(task.id, 'priority', e.target.value)}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${getPriorityBadgeStyle(task.priority)}`}
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </td>
              {/* ... 나머지 셀들은 그대로 ... */}
              <td className="px-6 py-4">
                {renderEditableCell(task, 'name', task.name)}
              </td>
              <td className="px-6 py-4">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                {renderEditableCell(task, 'assignee', task.assignee)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {renderEditableCell(task, 'dueDate', task.dueDate)}
                  {calculateDaysRemaining(task.dueDate)}
                </div>
              </td>
              <td className="px-6 py-4">
                {renderEditableCell(task, 'summary', task.summary)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;