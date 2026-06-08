import React, { useState, useEffect } from 'react';
import { MOCK_TASKS } from '@/repos';
import { Check, Calendar, ExternalLink, Filter } from 'lucide-react';
import { ViewProps, Task } from '@/lib/types';

const Tasks: React.FC<ViewProps> = ({ onShowToast }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const initial: ReadonlyArray<Task> = MOCK_TASKS;
    if (typeof window === 'undefined') return [...initial];
    const localTasks = window.localStorage.getItem('aspace_tasks');
    if (!localTasks) return [...initial];

    try {
      return JSON.parse(localTasks) as Task[];
    } catch {
      return [...initial];
    }
  });
  // Save to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('aspace_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === id) {
            const newState = !t.completed;
            if (newState) onShowToast("✅ Task completed!", "success");
            return { ...t, completed: newState };
        }
        return t;
    }));
  };

  const handleAddTask = () => {
    const newTitle = prompt("Enter quick task title:");
    if (newTitle) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTitle,
        project: 'Quick Task',
        deadline: 'Aujourd\'hui',
        completed: false
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      onShowToast("✨ Task added successfully!", "success");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-emerald-950 font-serif">My Day</h1>
                <p className="text-stone-500 mt-1">Focus on execution. No noise.</p>
            </div>
            <button className="flex items-center space-x-2 text-sm text-stone-500 hover:text-emerald-700 bg-white border border-stone-200 hover:border-emerald-200 px-4 py-2 rounded-full shadow-sm transition-all">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
            </button>
        </div>

        <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden shadow-soft">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-stone-100 bg-stone-50 text-xs font-bold text-stone-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">Done</div>
                <div className="col-span-5">Task Name</div>
                <div className="col-span-3">Project</div>
                <div className="col-span-3 text-right">Action</div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-stone-50">
                {tasks.map((task) => (
                    <div key={task.id} className={`grid grid-cols-12 gap-4 p-4 items-center group transition-colors ${task.completed ? 'bg-stone-50/50' : 'hover:bg-emerald-50/30'}`}>
                        
                        {/* Checkbox */}
                        <div className="col-span-1 flex justify-center">
                            <button 
                                onClick={() => toggleTask(task.id)}
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                    task.completed 
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                                        : 'border-stone-300 hover:border-emerald-400 bg-white'
                                }`}
                            >
                                {task.completed && <Check className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Task Name */}
                        <div className="col-span-5">
                            <p className={`text-sm font-medium ${task.completed ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-800'}`}>
                                {task.title}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-stone-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span className={task.deadline === "Aujourd'hui" ? "text-amber-600 font-bold" : ""}>{task.deadline}</span>
                            </div>
                        </div>

                        {/* Project */}
                        <div className="col-span-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
                                {task.project}
                            </span>
                        </div>

                        {/* Action */}
                        <div className="col-span-3 flex justify-end">
                            {task.sopLink ? (
                                <button className="flex items-center px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                                    <ExternalLink className="w-3 h-3 mr-1.5" />
                                    Open SOP
                                </button>
                            ) : (
                                <span className="text-xs text-stone-300 italic">No SOP linked</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Empty State / Add Task Placeholder */}
             <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
                <button 
                    onClick={handleAddTask}
                    className="text-sm text-stone-400 hover:text-emerald-600 transition-colors py-2 w-full border border-dashed border-stone-200 rounded-xl hover:border-emerald-300 hover:bg-white"
                >
                    + Add quick task
                </button>
            </div>
        </div>
    </div>
  );
};

export default Tasks;
