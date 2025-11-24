import React, { useState, useEffect } from "react";

const AddForm = ({ onAdd, quickText, onQuickUsed }) => {
  const [text, setText] = useState("");

 
  useEffect(() => {
    if (quickText && quickText.trim() !== "") {
      setText(quickText);
     
      if (onQuickUsed) onQuickUsed();
    }
  }, [quickText, onQuickUsed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 bg-slate-900/90 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 shadow-md"
    >
      <button
        type="submit"
        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-slate-500 flex items-center justify-center text-slate-400 text-base sm:text-lg hover:border-emerald-400 hover:text-emerald-300 transition"
      >
        +
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Try typing 'Pay utilities bill by Friday 6pm'"
        className="flex-1 bg-transparent outline-none text-xs sm:text-sm placeholder:text-slate-500"
      />
    </form>
  );
};

export default AddForm;
