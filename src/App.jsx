import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';  // db 추가
import { collection, onSnapshot } from 'firebase/firestore';
import AuthComponent from './components/auth/AuthComponent';
import TaskTable from './components/layout/TaskTable';
import AddTaskButton from './components/layout/AddTaskButton';
import TaskFilters from './components/layout/TaskFilters';

// 브라우저 콘솔에서 에러 확인을 위한 코드
console.log('App component loaded');
console.log('Auth state:', auth);


function App() {
  const [user, loading] = useAuthState(auth);
  console.log('User:', user);
  console.log('Loading:', loading);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    sort: 'dueDate',
    search: '',
    assignee: 'all',
    assigneeList: []
  });

  // Firestore에서 태스크 데이터 가져오기
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);

      // 담당자 목록 업데이트
      const assignees = [...new Set(tasksData.map(task => task.assignee))];
      setFilters(prev => ({ ...prev, assigneeList: assignees }));
    });

    return () => unsubscribe();
  }, [user]);

  // 필터링 및 정렬 적용
  useEffect(() => {
    let result = [...tasks];

    // 우선순위 필터
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    // 상태 필터
    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }

    // 담당자 필터
    if (filters.assignee !== 'all') {
      result = result.filter(task => task.assignee === filters.assignee);
    }

    // 검색어 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task => 
        task.name.toLowerCase().includes(searchLower) ||
        task.summary.toLowerCase().includes(searchLower) ||
        task.assignee.toLowerCase().includes(searchLower)
      );
    }

    // 정렬
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority': {
          const priorityOrder = { '높음': 1, '중간': 2, '낮음': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user) {
    return <AuthComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">팀 일정 관리</h1>
            <div className="flex items-center gap-4">
              <AddTaskButton />
              <span>{user.email}</span>
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
        <TaskFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <TaskTable tasks={filteredTasks} />
      </main>
    </div>
  );
}

export default App;