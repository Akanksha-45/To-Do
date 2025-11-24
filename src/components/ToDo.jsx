import React, { useState } from "react";
import AddForm from "./AddForm";

const initialTasks = [
  {
    id: 1,
    text: "Finish React Microsoft To Do clone",
    done: false,
    important: true,
    listId: "my-day",
  },
  {
    id: 2,
    text: "Study biosensors quiz",
    done: false,
    important: false,
    listId: "tasks",
  },
];

const Todo = ({ activeListId, sortBy, quickTaskText, onQuickTaskUsed }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (text) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        done: false,
        important: false,
        listId: activeListId || "my-day",
      },
    ]);
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const toggleImportant = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const visibleTasks = tasks.filter((t) => {
    if (activeListId === "important") return t.important;
    if (activeListId === "my-day") return t.listId === "my-day";
    if (activeListId === "tasks") return true;
    if (activeListId === "flagged") return false;
    return t.listId === activeListId;
  });

  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (sortBy === "important") {
      if (a.important === b.important) return 0;
      return a.important ? -1 : 1;
    }
    if (sortBy === "done") {
      if (a.done === b.done) return 0;
      return a.done ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="bg-slate-950/80 rounded-2xl border border-slate-800/60 px-3 sm:px-4 md:px-6 py-4 sm:py-5 backdrop-blur shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm font-medium text-slate-200">
          Tasks ({sortedTasks.length})
        </p>
      </div>

      <div className="space-y-1 max-h-52 sm:max-h-64 overflow-y-auto pr-1">
        {sortedTasks.length === 0 && (
          <p className="text-[11px] sm:text-xs text-slate-400 italic">
            No tasks yet in this list — add your first one below.
          </p>
        )}

        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-2 rounded-md
                       hover:bg-slate-900/90 hover:translate-x-1 hover:shadow-sm
                       transition-all duration-200 ease-out"
          >
            <button
              onClick={() => toggleDone(task.id)}
              className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border flex items-center justify-center
                ${
                  task.done
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-500 hover:border-emerald-400"
                } transition`}
            >
              {task.done && (
                <span className="material-symbols-outlined text-[10px] sm:text-xs text-slate-950">
                  check
                </span>
              )}
            </button>

            <div className="flex-1">
              <p
                className={`text-xs sm:text-sm ${
                  task.done ? "line-through text-slate-500" : "text-slate-100"
                }`}
              >
                {task.text}
              </p>
            </div>

            <button
              onClick={() => toggleImportant(task.id)}
              className="p-1 rounded-full hover:bg-slate-800 transition"
            >
              <span
                className={`material-symbols-outlined text-sm ${
                  task.important
                    ? "text-yellow-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                star
              </span>
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-500 hover:text-red-400 transition"
            >
              <span className="material-symbols-outlined text-xs sm:text-sm">
                delete
              </span>
            </button>
          </div>
        ))}
      </div>

     
      <AddForm
        onAdd={addTask}
        quickText={quickTaskText}
        onQuickUsed={onQuickTaskUsed}
      />
    </div>
  );
};

export default Todo;
