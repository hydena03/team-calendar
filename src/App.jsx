// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import AuthComponent from "./components/auth/AuthComponent";
import TaskTable from "./components/layout/TaskTable";
import AddTaskButton from "./components/layout/AddTaskButton";
import TaskFilters from './components/layout/TaskFilters';
import TeamManagement from './components/team/TeamManagement';

function App() {
  const [user, loading, error] = useAuthState(auth);  // loading과 error 추가
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    sort: 'dueDate',
    search: '',
    assignee: 'all',
    assigneeList: []
  });

  // Firestore에서 데이터 가져오기
  useEffect(() => {
    if (!user || !selectedTeam) return;

    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      .filter(task => task.teamId === selectedTeam.id); // 선택된 팀의 태스크만 필터링
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
    if (filters.assignee && filters.assignee !== 'all') {
      result = result.filter(task => task.assignee === filters.assignee);
    }

    // 검색어 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task => 
        task.name?.toLowerCase().includes(searchLower) ||
        task.summary?.toLowerCase().includes(searchLower) ||
        task.assignee?.toLowerCase().includes(searchLower)
      );
    }

    // 정렬
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority': {
          const priorityOrder = { '높음': 0, '중간': 1, '낮음': 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });
    
    setFilteredTasks(result);
  }, [tasks, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (error) {
    return <div className="text-center p-4">Error: {error.message}</div>;
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!user) {
    return <AuthComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">절세나라 일정관리</h1>
            <div className="flex items-center gap-4">
              <AddTaskButton />
              <span className="hidden sm:inline">{user.email}</span>
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

      <main className="w-full px-4 sm:px-6 lg:px-8 mx-auto py-8">
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
