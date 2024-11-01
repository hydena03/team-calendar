// src/components/team/TeamManagement.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  // 팀 목록 가져오기
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'teams'),
      where('members', 'array-contains', auth.currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamsData);
    });

    return () => unsubscribe();
  }, []);

  // 팀 생성
  const createTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      await addDoc(collection(db, 'teams'), {
        name: newTeamName,
        owner: auth.currentUser.email,
        members: [auth.currentUser.email],
        createdAt: new Date()
      });
      setNewTeamName('');
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">팀 생성</h2>
        <form onSubmit={createTeam} className="flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="팀 이름 입력"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            팀 생성
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">내 팀 목록</h2>
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedTeam(team)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{team.name}</h3>
                  <p className="text-sm text-gray-500">
                    생성자: {team.owner}
                  </p>
                  <p className="text-sm text-gray-500">
                    멤버 수: {team.members.length}명
                  </p>
                </div>
                {team.owner === auth.currentUser?.email && (
                  <button
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    관리
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;