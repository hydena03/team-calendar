// src/components/layout/TaskTable.jsx
import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const TaskTable = ({ tasks }) => {
  const [editingCell, setEditingCell] = useState({ taskId: null, field: null });
  const [editValue, setEditValue] = useState('');

  const getStatusStyle = (status) => {
    switch (status) {
      case '시작전':
        return 'bg-gray-100 text-gray-800';
      case '진행중':
        return 'bg-blue-100 text-blue-800';
      case '완료':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return '';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case '높음':
        return 'bg-red-100 text-red-800';
      case '중간':
        return 'bg-yellow-100 text-yellow-800';
      case '낮음':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  const calculateDday = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-Day';
    return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  const handleCellClick = (task, field) => {
    setEditingCell({ taskId: task.id, field });
    setEditValue(task[field]);
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleBlur = async (taskId, field) => {
    if (editingCell.taskId && editingCell.field) {
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
          [field]: editValue
        });
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
    setEditingCell({ taskId: null, field: null });
  };

  const handleKeyDown = (e, taskId, field) => {
    if (e.key === 'Enter') {
      handleBlur(taskId, field);
    } else if (e.key === 'Escape') {
      setEditingCell({ taskId: null, field: null });
    }
  };

  const renderCell = (task, field) => {
    const isEditing = editingCell.taskId === task.id && editingCell.field === field;

    if (isEditing) {
      if (field === 'priority') {
        return (
          <select
            value={editValue}
            onChange={handleChange}
            onBlur={() => handleBlur(task.id, field)}
            className="w-24 sm:w-32 px-2 py-1 border rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            <option value="높음">높음</option>
            <option value="중간">중간</option>
            <option value="낮음">낮음</option>
          </select>
        );
      }

      if (field === 'status') {
        return (
          <select
            value={editValue}
            onChange={handleChange}
            onBlur={() => handleBlur(task.id, field)}
            className="w-24 sm:w-32 px-2 py-1 border rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            <option value="시작전">시작전</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
          </select>
        );
      }

      if (field === 'dueDate') {
        return (
          <input
            type="date"
            value={editValue}
            onChange={handleChange}
            onBlur={() => handleBlur(task.id, field)}
            onKeyDown={(e) => handleKeyDown(e, task.id, field)}
            className="w-28 sm:w-40 px-2 py-1 border rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        );
      }

      return (
        <input
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={() => handleBlur(task.id, field)}
          onKeyDown={(e) => handleKeyDown(e, task.id, field)}
          className="w-full px-2 py-1 border rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      );
    }

    // 일반 셀 표시
    if (field === 'priority') {
      return (
        <div 
          onClick={() => handleCellClick(task, field)}
          className={`cursor-pointer rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-center text-xs sm:text-sm font-medium ${getPriorityStyle(task[field])}`}
        >
          {task[field]}
        </div>
      );
    }

    if (field === 'status') {
      return (
        <div 
          onClick={() => handleCellClick(task, field)}
          className={`cursor-pointer rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-center text-xs sm:text-sm font-medium ${getStatusStyle(task[field])}`}
        >
          {task[field]}
        </div>
      );
    }

    if (field === 'dueDate') {
      return (
        <div 
          onClick={() => handleCellClick(task, field)}
          className="cursor-pointer flex items-center gap-1 sm:gap-2"
        >
          <span className="text-xs sm:text-sm">{task[field]}</span>
          <span className={`text-xs ${
            task[field] && new Date(task[field]) < new Date() ? 'text-red-500' : 'text-blue-500'
          }`}>
            {calculateDday(task[field])}
          </span>
        </div>
      );
    }

    return (
      <div 
        onClick={() => handleCellClick(task, field)}
        className="cursor-pointer text-xs sm:text-sm hover:bg-gray-50 px-1 py-0.5 rounded"
      >
        {task[field]}
      </div>
    );
  };

  return (
    <div className="w-full -mx-4 sm:mx-0 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-2 sm:py-3.5 pl-2 sm:pl-4 pr-2 sm:pr-3 text-left text-xs font-semibold text-gray-900">
                    작업명
                  </th>
                  <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs font-semibold text-gray-900 w-24 sm:w-32">
                    우선순위
                  </th>
                  <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs font-semibold text-gray-900 w-24 sm:w-32">
                    상태
                  </th>
                  <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs font-semibold text-gray-900">
                    담당자
                  </th>
                  <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs font-semibold text-gray-900 w-28 sm:w-40">
                    마감일
                  </th>
                  <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs font-semibold text-gray-900">
                    요약
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-2 sm:py-4 pl-2 sm:pl-4 pr-2 sm:pr-3">
                      {renderCell(task, 'name')}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4">
                      {renderCell(task, 'priority')}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4">
                      {renderCell(task, 'status')}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4">
                      {renderCell(task, 'assignee')}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4">
                      {renderCell(task, 'dueDate')}
                    </td>
                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4">
                      {renderCell(task, 'summary')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;