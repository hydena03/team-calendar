import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import AuthComponent from './components/auth/AuthComponent';
import TaskTable from './components/layout/TaskTable';

function App() {
  const [user, loading] = useAuthState(auth);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    priority: '중간',
    status: '시작',
    assignee: '',
    dueDate: '',
    summary: ''
  });

  const handleAddTask = () => {
    setShowTaskForm(!showTaskForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), newTask);
      setShowTaskForm(false); // 폼 닫기
      setNewTask({ name: '', priority: '중간', status: '시작', assignee: '', dueDate: '', summary: '' }); // 폼 초기화
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user) {
    return <AuthComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">팀 일정 관리</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user.email}</span>
              <button 
                onClick={() => auth.signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">작업 목록</h2>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            태스크 추가
          </button>
        </div>
        
        {showTaskForm && (
          <div className="mb-4 p-4 bg-white shadow-md rounded">
            <h3 className="text-lg font-semibold mb-2">새로운 태스크 추가</h3>
            <form onSubmit={handleSubmitTask} className="space-y-2">
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                placeholder="작업명"
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="높음">높음</option>
                <option value="중간">중간</option>
                <option value="낮음">낮음</option>
              </select>
              <input
                type="text"
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                placeholder="상태"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="assignee"
                value={newTask.assignee}
                onChange={handleInputChange}
                placeholder="담당자"
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <textarea
                name="summary"
                value={newTask.summary}
                onChange={handleInputChange}
                placeholder="요약"
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                추가
              </button>
            </form>
          </div>
        )}

        <TaskTable />
      </main>
    </div>
  );
}

export default App;
