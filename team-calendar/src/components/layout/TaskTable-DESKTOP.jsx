import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Firestore에서 실시간으로 데이터 가져오기
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '높음': return 'bg-red-100 text-red-800';
      case '중간': return 'bg-yellow-100 text-yellow-800';
      case '낮음': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">우선순위</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">작업명</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">상태</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">담당자</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">마감일</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">요약</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tasks.map((task) => (
          <tr key={task.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.name}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{task.status}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{task.assignee}</td>
            <td className="px-6 py-4 text-sm text-gray-900">
              <div className="flex items-center gap-2">
                <span>{task.dueDate}</span>
                {calculateDaysRemaining(task.dueDate)}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{task.summary}</td>
          </tr>
        ))}
      </tbody>
    </table>
</div>
  );
};

export default TaskTable;