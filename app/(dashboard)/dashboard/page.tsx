'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CourseProgress {
  id: string;
  courseId: string;
  progressPercentage: number;
  completedModules: number;
  totalModules: number;
}

interface UserData {
  user: {
    id: string;
    name: string;
    level: number;
    totalXP: number;
  };
  progress: CourseProgress[];
  metrics: any;
  achievements: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserProgress();
    }
  }, [session]);

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/progress');
      setUserData(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Erreur lors du chargement des données</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue, {userData.user.name}! 👋
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Niveau</p>
            <p className="text-4xl font-bold text-indigo-600">{userData.user.level}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Points XP</p>
            <p className="text-4xl font-bold text-indigo-600">{userData.user.totalXP}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Cours en cours</p>
            <p className="text-4xl font-bold text-indigo-600">{userData.progress.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Achievements</p>
            <p className="text-4xl font-bold text-indigo-600">{userData.achievements.length}</p>
          </div>
        </div>

        {/* Progress Chart */}
        {userData.progress.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Progression des cours</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={userData.progress.map((p, i) => ({
                  name: `Cours ${i + 1}`,
                  progression: Math.round(p.progressPercentage),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progression" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Courses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mes cours</h2>
          {userData.progress.length === 0 ? (
            <p className="text-gray-600">Aucun cours commencé. Parcourez le catalogue!</p>
          ) : (
            <div className="space-y-4">
              {userData.progress.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Cours {course.courseId}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <p className="ml-4 text-sm text-gray-600">{Math.round(course.progressPercentage)}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
