import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { Task, Subject } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  subjects: Subject[];
  onSelectTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onOpenAddTask: () => void;
  onOpenManageSubjects?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  subjects,
  onSelectTask,
  onToggleComplete,
  onOpenAddTask,
  onOpenManageSubjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'pending' | 'completed' | 'urgent'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeStatusTab === 'pending' && task.status === 'completed') return false;
    if (activeStatusTab === 'completed' && task.status !== 'completed') return false;
    if (activeStatusTab === 'urgent' && (task.priorityLevel !== 'critical' && task.priorityLevel !== 'high')) return false;

    if (selectedSubject !== 'all' && task.subject !== selectedSubject) return false;

    return true;
  });

  return (
    <div className="space-y-4 px-4 pt-3 pb-8">
      
      {/* 1. TOP HEADER & ADD BUTTON */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Daftar Tugas</h1>
          <p className="text-[11px] font-normal text-slate-500">
            {tasks.filter(t => t.status !== 'completed').length} tugas aktif dijadwalkan AI
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="bg-[#0062FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.2px]" />
          <span>Tambah</span>
        </button>
      </div>

      {/* 2. SEARCH BAR WITH PILL CONTAINER */}
      <div className="relative">
        <div className="bg-white rounded-full p-2 pl-4 shadow-[0_4px_16px_rgba(20,40,90,0.05)] border border-white flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, materi, atau mata pelajaran..."
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. STATUS FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'urgent', label: '⚡ Prioritas' },
          { id: 'pending', label: 'Dikerjakan' },
          { id: 'completed', label: 'Tuntas' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id as any)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              activeStatusTab === tab.id
                ? 'bg-[#0062FF] text-white shadow-sm shadow-blue-500/20'
                : 'bg-white/70 hover:bg-white text-slate-600 border border-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. SUBJECT CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
            selectedSubject === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white/60 hover:bg-white text-slate-600'
          }`}
        >
          Semua Mapel
        </button>
        {subjects.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubject(sub.name)}
            className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub.name
                ? 'bg-slate-900 text-white'
                : 'bg-white/60 hover:bg-white text-slate-600'
            }`}
          >
            {sub.name}
          </button>
        ))}
        {onOpenManageSubjects && (
          <button
            onClick={onOpenManageSubjects}
            className="text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer bg-blue-50 text-[#0062FF] hover:bg-blue-100 border border-blue-200/60 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3 h-3 stroke-[2.2px]" />
            <span>Atur Mapel</span>
          </button>
        )}
      </div>

      {/* 5. TASK LIST CARDS */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-2 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white">
            <div className="w-12 h-12 bg-blue-50 text-[#0062FF] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Semua Tugas Tuntas!</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Tidak ada tugas yang tertunda di filter ini. Waktunya istirahat atau cicil materi baru!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className={`bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(20,40,90,0.04)] border border-white hover:border-blue-100 transition-all cursor-pointer relative ${
                  isCompleted ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Quick completion toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className="mt-0.5 text-slate-300 hover:text-blue-600 cursor-pointer shrink-0 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5 group-hover:text-blue-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Tags row */}
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: task.subjectColor }}
                      >
                        {task.subject}
                      </span>

                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {task.taskType}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.priorityLevel === 'critical'
                          ? 'bg-rose-50 text-rose-700'
                          : task.priorityLevel === 'high'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priorityLevel === 'critical' ? '⚡ Sangat Tinggi' : task.priorityLevel === 'high' ? '🔥 Tinggi' : 'Sedang'}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h3 className={`text-xs font-bold text-slate-900 leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h3>

                    {/* AI reasoning snippet */}
                    {!isCompleted && task.aiReasoning && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#0062FF] bg-blue-50/70 px-2.5 py-1 rounded-xl">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{task.aiReasoning}</span>
                      </div>
                    )}

                    {/* Schedule allocation and deadline */}
                    <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-medium text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{task.deadlineFormatted}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                          isCompleted ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'
                        }`}>
                          {isCompleted ? '✓ Selesai' : '⏱️ Terjadwal'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 self-center shrink-0" />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
