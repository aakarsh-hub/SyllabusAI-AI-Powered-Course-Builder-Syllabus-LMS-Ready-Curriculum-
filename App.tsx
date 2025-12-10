import React, { useState } from 'react';
import CourseInput from './components/CourseInput';
import CourseDashboard from './components/CourseDashboard';
import { Course } from './types';

const App: React.FC = () => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {!currentCourse ? (
        <CourseInput onCourseGenerated={setCurrentCourse} />
      ) : (
        <CourseDashboard 
          course={currentCourse} 
          onReset={() => setCurrentCourse(null)} 
        />
      )}
    </div>
  );
};

export default App;