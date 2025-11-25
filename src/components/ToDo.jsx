import React, { useState, useMemo, useRef } from "react";

const Todo = ({ activeListId, sortBy, quickTaskText, setQuickTaskText }) => {
  const [tasks, setTasks] = useState([]);
  const [taskDate, setTaskDate] = useState("");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      listId: activeListId,
      text: quickTaskText.trim(),
      dueDate: taskDate || null,
      completed: false,
      createdAt: Date.now(),
      important: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setQuickTaskText("");
    setTaskDate("");
  };

  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleToggleImportant = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, important: !t.important } : t
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFilesChosen = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    console.log("Selected files:", files);

    event.target.value = "";
  };

  const currentTasks = useMemo(() => {
    let listTasks = tasks.filter((t) => t.listId === activeListId);

    if (sortBy === "important") {
      listTasks = [...listTasks].sort((a, b) => {
        if (a.important === b.important) return 0;
        return a.important ? -1 : 1;
      });
    } else if (sortBy === "done") {
      listTasks = [...listTasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    } else {
      listTasks = [...listTasks].sort((a, b) => a.createdAt - b.createdAt);
    }

    return listTasks;
  }, [tasks, activeListId, sortBy]);

  return (
    <div className="bg-slate-900/95 border border-slate-700 rounded-2xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-xl">
  
     <form
  onSubmit={handleAddTask}
  className="flex flex-wrap gap-2 items-center mb-4"
>
 
  <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1.5 relative flex-1 min-w-[200px]">
   
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsAddMenuOpen((p) => !p);
        }}
        className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-slate-700 transition-all"
        title="Add"
      >
        <span className="material-symbols-outlined text-lg text-slate-200">
          add
        </span>
      </button>

      {isAddMenuOpen && (
        <div
          className="absolute left-0 top-9 z-30 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-xs text-slate-100 py-1"
          onMouseLeave={() => setIsAddMenuOpen(false)}
        >
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800"
            onClick={() => {
              setIsAddMenuOpen(false);
              if (fileInputRef.current) fileInputRef.current.click();
            }}
          >
            <span className="material-symbols-outlined text-sm">
              photo_library
            </span>
            <span>Photos &amp; videos</span>
          </button>
        </div>
      )}
    </div>

    <input
      type="text"
      placeholder="Try typing your task…"
      className="flex-1 bg-transparent outline-none text-sm sm:text-base text-slate-50 placeholder:text-slate-400"
      value={quickTaskText}
      onChange={(e) => setQuickTaskText(e.target.value)}
    />
  </div>

 
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex flex-col gap-0.5 text-[10px] text-slate-400">
        <span>Due date</span>
        <div className="relative w-36">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-300 pointer-events-none">
            calendar_today
          </span>
          <input
            type="date"
            className="bg-white/5 border border-white/6 rounded-lg pl-9 pr-2 h-8 text-[11px] text-slate-100 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent w-full bg-clip-padding backdrop-blur-sm"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            aria-label="Due date"
          />
        </div>
      </div>

    <button
      type="submit"
      className="h-8 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 transition-colors"
    >
      <span className="material-symbols-outlined text-sm">done</span>
      Add
    </button>
  </div>
</form>


    
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFilesChosen}
      />

   
      {currentTasks.length === 0 ? (
        <p className="text-xs sm:text-sm text-slate-300 italic">
          No tasks yet. Add something to get started ✨
        </p>
      ) : (
        <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {currentTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start gap-2 sm:gap-3 bg-slate-900/80 rounded-xl px-3 py-2 border border-slate-700/70"
            >
              <button
                onClick={() => handleToggleComplete(task.id)}
                className="mt-0.5 h-5 w-5 rounded-full border border-slate-500 flex items-center justify-center text-xs text-slate-200"
              >
                {task.completed && (
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm sm:text-base break-words ${
                    task.completed
                      ? "line-through text-slate-500"
                      : "text-slate-50"
                  }`}
                >
                  {task.text}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-300">
                  {task.dueDate && (
                    <span className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/6 border border-white/6 backdrop-blur-sm text-slate-100">
                      <span className="material-symbols-outlined text-[14px] text-sky-300">
                        calendar_today
                      </span>
                      <span className="text-[11px]">
                        {new Date(task.dueDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleImportant(task.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                      task.important
                        ? "border-amber-400 text-amber-300 bg-amber-900/30"
                        : "border-slate-600 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      star
                    </span>
                    <span>{task.important ? "Important" : "Mark important"}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="mt-0.5 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-300"
              >
                <span className="material-symbols-outlined text-base">
                  delete
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Todo;
