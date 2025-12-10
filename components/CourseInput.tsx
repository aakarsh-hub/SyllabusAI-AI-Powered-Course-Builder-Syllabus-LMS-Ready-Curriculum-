import React, { useState } from 'react';
import { Upload, FileText, BookOpen, Loader2, Wand2 } from 'lucide-react';
import { generateCourse } from '../services/geminiService';
import { Course, GenerationStatus } from '../types';

interface CourseInputProps {
  onCourseGenerated: (course: Course) => void;
}

const CourseInput: React.FC<CourseInputProps> = ({ onCourseGenerated }) => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some course topics or syllabus content.");
      return;
    }
    
    setStatus('generating');
    setError(null);

    try {
      // In a real app, we might ask user for number of weeks. 
      // For this demo, we default to 4 for speed/reliability.
      const course = await generateCourse(inputText, 4);
      onCourseGenerated(course);
      setStatus('success');
    } catch (err) {
      setError("Failed to generate course. Please verify your API Key and try again.");
      setStatus('error');
    }
  };

  const handleSample = () => {
    setInputText(`Course: Introduction to Product Management
    
Description:
This course covers the fundamentals of digital product management. Students will learn how to identify user needs, build product roadmaps, and work with engineering teams.

Topics to cover:
1. Product Lifecycle & Strategy
2. User Research & Personas
3. Agile Methodologies & Scrum
4. Go-to-Market Strategy & Launch`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Syllabus<span className="text-primary-600">AI</span> Builder
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Transform raw text, syllabi, or learning objectives into a complete, LMS-ready course structure with AI.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Course Source Material
            </h2>
            <button 
              onClick={handleSample}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              Load Sample Data
            </button>
          </div>

          <textarea
            className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none text-slate-700 bg-slate-50 font-mono text-sm leading-relaxed"
            placeholder="Paste your syllabus, textbook chapter list, or rough topic ideas here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={status === 'generating'}
          />

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
             <div className="text-sm text-slate-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Generates 4 weeks of full content (Lectures, Slides, Quizzes)</span>
             </div>

             <button
              onClick={handleGenerate}
              disabled={status === 'generating' || !inputText.trim()}
              className={`
                group relative px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all
                flex items-center gap-3
                ${status === 'generating' 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-500/25 active:scale-95'}
              `}
             >
               {status === 'generating' ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Building Curriculum...
                 </>
               ) : (
                 <>
                   <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                   Generate Course Structure
                 </>
               )}
             </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseInput;