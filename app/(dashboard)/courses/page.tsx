'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: number;
  icon?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [difficulty, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (difficulty) params.append('difficulty', difficulty);
      params.append('page', page.toString());

      const response = await axios.get(`/api/courses?${params}`);
      setCourses(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-orange-100 text-orange-800',
    EXPERT: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Catalogue des cours</h1>
          <p className="text-gray-600 mt-2">Découvrez des cours adaptés à votre niveau</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex gap-4">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les niveaux</option>
            <option value="BEGINNER">Débutant</option>
            <option value="INTERMEDIATE">Intermédiaire</option>
            <option value="ADVANCED">Avancé</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{course.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}>
                      {course.difficulty === 'BEGINNER' && 'Débutant'}
                      {course.difficulty === 'INTERMEDIATE' && 'Intermédiaire'}
                      {course.difficulty === 'ADVANCED' && 'Avancé'}
                      {course.difficulty === 'EXPERT' && 'Expert'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.category}</span>
                    <span>⏱️ {course.estimatedDuration}h</span>
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 text-center transition-colors duration-200"
                  >
                    Consulter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
