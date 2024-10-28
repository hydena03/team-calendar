import React, { useState, useEffect } from 'react';  // useEffect 추가
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Header from './components/layout/Header';
import TaskTable from './components/layout/TaskTable';
import AddTaskButton from './components/layout/AddTaskButton';
import TaskFilters from './components/layout/TaskFilters';
import AuthComponent from './components/auth/AuthComponent';

function App() {
  const [user, loading] = useAuthState(auth);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      priority: '높음',
      name: '기획안 작성',
      status: '진행중',
      assignee: '김철수',
      dueDate: '2024-10-30',
      summary: '프로젝트 기획안 초안 작성'
    },
    {
      id: 2,
      priority: '중간',
      name: '디자인 시안',
      status: '시작',
      assignee: '이영희',
      dueDate: '2024-11-05',
      summary: '메인 페이지 디자인'
    },
    {
      id: 3,
      priority: '낮음',
      name: '코드 리뷰',
      status: '완료',
      assignee: '박지성',
      dueDate: '2024-10-28',
      summary: '로그인 기능 코드 리뷰'
    }
  ]);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // 상태 변경 처리
  // App.jsx에서 handleStatusChange 함수 수정
  // 이렇게 수정해주세요:
  const handleStatusChange = (taskId, field, value) => {
    // taskId: 수정할 태스크의 ID
    // field: 수정할 필드 (예: 'name', 'status', 'priority' 등)
    // value: 새로운 값
    console.log('Updating:', taskId, field, value); // 디버깅용 로그
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
    applyFiltersAndSort(updatedTasks);
  };  
  // 새 태스크 추가
  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      priority: '중간',
      name: '새 태스크',
      status: '시작',
      assignee: '',
      dueDate: new Date().toISOString().split('T')[0],
      summary: ''
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    applyFiltersAndSort(updatedTasks);
  };

  // 필터링과 정렬 적용
  const applyFiltersAndSort = (taskList) => {
    let filtered = taskList;
    
    // 우선순위 필터링
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { '높음': 1, '중간': 2, '낮음': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTasks(sorted);
  };

  // 필터 변경 처리
  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority);
    applyFiltersAndSort(tasks);
  };

  // 정렬 변경 처리
  const handleSort = (sortType) => {
    setSortBy(sortType);
    applyFiltersAndSort(tasks);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">태스크 목록</h2>
          <AddTaskButton onClick={handleAddTask} />
        </div>
        <TaskFilters 
          onPriorityFilter={handlePriorityFilter}
          onSort={handleSort}
        />
        <TaskTable 
          tasks={filteredTasks} 
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}

export default App;