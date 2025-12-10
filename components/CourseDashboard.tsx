import React, { useState } from 'react';
import { 
  Book, 
  Presentation, 
  ClipboardCheck, 
  GraduationCap, 
  FileText, 
  Download, 
  ChevronRight, 
  Layout, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { Course, WeeklyModule, Assignment, Slide, QuizQuestion, RubricCriteria, AssignmentDifficulty } from '../types';

interface CourseDashboardProps {
  course: Course;
  onReset: () => void;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ course, onReset }) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'lecture' | 'slides' | 'assessments' | 'resources'>('overview');

  const currentModule = course.modules[activeWeekIndex];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-5 border-b border-slate-100">
          <button onClick={onReset} className="flex items-center text-slate-500 hover:text-primary-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Generator
          </button>
          <h2 className="font-bold text-lg text-slate-900 leading-tight">{course.title}</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded mt-2 inline-block">
            {course.level} • {course.totalWeeks} Weeks
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {course.modules.map((mod, idx) => (
            <button
              key={idx}
              onClick={() => setActiveWeekIndex(idx)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-all ${
                idx === activeWeekIndex 
                  ? 'bg-primary-50 text-primary-900 ring-1 ring-primary-200 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                 idx === activeWeekIndex ? 'bg-primary-200 text-primary-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {mod.weekNumber}
              </div>
              <div>
                <div className="text-sm font-medium line-clamp-2">{mod.title}</div>
                <div className="text-xs opacity-70 mt-1">{mod.deliveryMode}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200">
           <button 
             onClick={() => alert("Simulating export to LMS package (SCORM/Common Cartridge)...")}
             className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
           >
             <Download className="w-4 h-4" /> Export Course Pack
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Week {currentModule.weekNumber}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="truncate max-w-md">{currentModule.title}</span>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { id: 'overview', icon: Layout, label: 'Blueprint' },
              { id: 'lecture', icon: Book, label: 'Lecture' },
              { id: 'slides', icon: Presentation, label: 'Slides' },
              { id: 'assessments', icon: ClipboardCheck, label: 'Assessments' },
              { id: 'resources', icon: GraduationCap, label: 'Resources' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-primary-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="max-w-5xl mx-auto">
            
            {activeTab === 'overview' && <OverviewView module={currentModule} />}
            {activeTab === 'lecture' && <LectureView module={currentModule} />}
            {activeTab === 'slides' && <SlidesView slides={currentModule.slides} />}
            {activeTab === 'assessments' && <AssessmentsView module={currentModule} />}
            {activeTab === 'resources' && <ResourcesView module={currentModule} />}

          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Components for Tabs ---

const OverviewView = ({ module }: { module: WeeklyModule }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Weekly Focus</h3>
      <p className="text-slate-700 leading-relaxed text-lg">{module.focus}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Learning Objectives
        </h4>
        <ul className="space-y-3">
          {module.learningObjectives.map((obj, i) => (
            <li key={i} className="flex gap-3 text-slate-700">
              <span className="text-primary-500 font-bold">•</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Book className="w-4 h-4" /> Key Concepts
        </h4>
        <div className="flex flex-wrap gap-2">
          {module.keyConcepts.map((concept, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LectureView = ({ module }: { module: WeeklyModule }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Lecture Notes</h3>
        <div className="prose prose-slate max-w-none">
           <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
             {module.lectureSummary}
           </p>
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h4 className="font-bold text-slate-900 mb-4">Structure Outline</h4>
         <ul className="space-y-2">
           {module.lectureOutline.map((item, i) => (
             <li key={i} className="flex gap-2 text-sm text-slate-600">
               <span className="font-mono text-slate-300">{(i+1).toString().padStart(2, '0')}</span>
               {item}
             </li>
           ))}
         </ul>
      </div>
      <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 shadow-sm">
         <h4 className="font-bold text-amber-900 mb-4">Discussion Prompts</h4>
         <ul className="space-y-4">
           {module.discussionPrompts.map((prompt, i) => (
             <li key={i} className="text-amber-800 text-sm italic font-medium">
               "{prompt}"
             </li>
           ))}
         </ul>
      </div>
    </div>
  </div>
);

const SlidesView = ({ slides }: { slides: Slide[] }) => (
  <div className="grid grid-cols-1 gap-8">
    {slides.map((slide, idx) => (
      <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-auto md:h-80">
        {/* Slide Preview */}
        <div className="flex-1 bg-slate-900 p-8 flex flex-col justify-center relative group">
          <div className="absolute top-4 right-4 bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
            Slide {idx + 1}
          </div>
          <h2 className="text-2xl text-white font-bold mb-6">{slide.title}</h2>
          <ul className="space-y-3">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="text-slate-300 flex gap-2">
                <span className="text-primary-500">•</span> {bullet}
              </li>
            ))}
          </ul>
          {/* Visual Hint Overlay */}
          <div className="mt-8 p-3 bg-slate-800/50 rounded border border-slate-700 border-dashed text-slate-400 text-sm flex items-center gap-2">
             <Layout className="w-4 h-4" />
             <span className="italic">Visual Suggestion: {slide.visualHint}</span>
          </div>
        </div>

        {/* Speaker Notes */}
        <div className="w-full md:w-80 bg-slate-50 p-6 border-l border-slate-200 overflow-y-auto">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Speaker Notes</h4>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {slide.speakerNotes}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const QuizCard: React.FC<{ question: QuizQuestion; index: number }> = ({ question, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex gap-4">
        <span className="font-mono text-slate-300 text-xl font-bold">Q{index + 1}</span>
        <div className="flex-1">
          <p className="font-medium text-slate-800 text-lg mb-4">{question.question}</p>
          <div className="space-y-2 mb-4">
            {question.options.map((opt, i) => (
              <div key={i} className="p-3 border border-slate-100 rounded hover:bg-slate-50 text-slate-600">
                {opt}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-primary-600 text-sm font-medium hover:underline"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          
          {showAnswer && (
            <div className="mt-3 p-3 bg-green-50 text-green-800 rounded border border-green-100 text-sm animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">Correct:</span> {question.correctAnswer}
              <div className="mt-1 text-green-700">{question.explanation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const AssessmentsView = ({ module }: { module: WeeklyModule }) => (
  <div className="space-y-8">
    {/* Assignments */}
    <section>
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary-600" /> Assignments
      </h3>
      <div className="grid gap-6">
        {module.assignments.map((assign, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <h4 className="text-lg font-bold text-slate-800">{assign.title}</h4>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold 
                     ${assign.difficulty === AssignmentDifficulty.Beginner ? 'bg-green-100 text-green-700' : 
                       assign.difficulty === AssignmentDifficulty.Intermediate ? 'bg-yellow-100 text-yellow-700' : 
                       'bg-red-100 text-red-700'}`}>
                     {assign.difficulty}
                   </span>
                </div>
                <p className="text-slate-600">{assign.description}</p>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm bg-slate-50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {assign.estimatedHours} hrs
              </div>
            </div>
            
            {/* Rubric Accordion-ish */}
            <div className="bg-slate-50 p-6">
              <h5 className="text-sm font-bold text-slate-900 mb-4">Grading Rubric</h5>
              <div className="space-y-4">
                {assign.rubric.map((crit, idx) => (
                  <div key={idx} className="bg-white p-4 rounded border border-slate-200">
                     <div className="flex justify-between mb-2">
                       <span className="font-semibold text-slate-800">{crit.criteriaName}</span>
                       <span className="text-slate-500 text-sm font-medium">{crit.weight}% Weight</span>
                     </div>
                     <p className="text-sm text-slate-500 mb-3">{crit.description}</p>
                     <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="bg-green-50 p-2 rounded text-green-900">
                          <span className="block font-bold mb-1">Excellent</span>
                          {crit.bands.excellent}
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-blue-900">
                          <span className="block font-bold mb-1">Good</span>
                          {crit.bands.good}
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-yellow-900">
                          <span className="block font-bold mb-1">Fair</span>
                          {crit.bands.fair}
                        </div>
                        <div className="bg-red-50 p-2 rounded text-red-900">
                          <span className="block font-bold mb-1">Poor</span>
                          {crit.bands.poor}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Quiz */}
    <section>
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ClipboardCheck className="w-5 h-5 text-primary-600" /> Knowledge Check
      </h3>
      <div className="grid gap-4">
        {module.quiz.map((q, i) => (
          <QuizCard key={i} question={q} index={i} />
        ))}
      </div>
    </section>
  </div>
);

const ResourcesView = ({ module }: { module: WeeklyModule }) => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-xl font-bold text-slate-900 mb-6">Reading List & Materials</h3>
    <div className="divide-y divide-slate-100">
      {module.readings.map((resource, i) => (
        <div key={i} className="py-4 first:pt-0 flex gap-4 items-start">
           <div className={`p-2 rounded-lg shrink-0 ${
             resource.type === 'Video' ? 'bg-red-100 text-red-600' :
             resource.type === 'Paper' ? 'bg-blue-100 text-blue-600' :
             'bg-slate-100 text-slate-600'
           }`}>
             <BookOpen className="w-5 h-5" />
           </div>
           <div>
             <h4 className="font-bold text-slate-800">{resource.title}</h4>
             <p className="text-sm text-slate-500 mb-2">by {resource.author} • {resource.type}</p>
             <p className="text-slate-600 text-sm bg-slate-50 p-2 rounded">{resource.relevance}</p>
           </div>
        </div>
      ))}
    </div>
  </div>
);

export default CourseDashboard;