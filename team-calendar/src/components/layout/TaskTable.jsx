// src/components/layout/TaskTable.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore 함수 추가
import { db } from '../../firebase'; // Firebase db 추가
import { Trash2 } from 'lucide-react'; // 삭제 아이콘 추가

const TaskTable = () => {
  const [tasks, setTasks] = useState([]); // 태스크 목록 상태
  const [editingCell, setEditingCell] = useState(null); // 수정 중인 셀 상태
  const [editValue, setEditValue] = useState(''); // 수정 중인 값

  // Firestore에서 실시간으로 데이터 가져오기
  useEffect(() => {
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

  // 셀 클릭 시 편집 모드로 전환
  const handleCellClick = (taskId, field, value) => {
    setEditingCell({ taskId, field });
    setEditValue(value);
  };

  // 편집 완료 시 처리
  const handleEditComplete = async (taskId, field) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { [field]: editValue }); // Firestore 문서 업데이트
      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      console.error("Error updating task: ", error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 수정 가능한 셀 렌더링
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



  // 삭제 함수 추가
  const handleDelete = async (taskId) => {
    if (window.confirm('정말 이 태스크를 삭제하시겠습니까?')) { // 삭제 확인
      try {
        await deleteDoc(doc(db, 'tasks', taskId)); // Firestore에서 문서 삭제
      } catch (error) {
        console.error("Error deleting task: ", error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 우선순위에 따른 배지 스타일
  const getPriorityColor = (priority) => {
    switch (priority) {
      case '높음': return 'bg-red-100 text-red-800 border border-red-200';
      case '중간': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case '낮음': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
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
        <tbody className="bg-white divide-y divide-gray-200">
        {tasks.map((task) => {
          console.log('Task details:', {
            id: task.id,
            priority: task.priority,
            status: task.status,
            name: task.name,
            assignee: task.assignee
          });
            return (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={task.priority}
                    onChange={(e) => handleEditComplete(task.id, 'priority', e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)}`}
                  >
                    {['높음', '중간', '낮음'].map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  {renderEditableCell(task, 'name', task.name)}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleEditComplete(task.id, 'status', e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {['시작전', '진행중', '완료'].map(status => ( 
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
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;