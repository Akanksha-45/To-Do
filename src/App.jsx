import React, { useEffect, useState } from "react";
import Todo from "./components/ToDo";
import themeIcon from "./assets/icons8-theme-94.png";
import suggestionIcon from "./assets/icons8-suggestion-64.png";

const initialLists = [
  { id: "my-day", label: "My Day", icon: "wb_sunny" },
  { id: "important", label: "Important", icon: "star" },
  { id: "planned", label: "Planned", icon: "event" },
  { id: "assigned", label: "Assigned to me", icon: "person" },
  { id: "flagged", label: "Flagged email", icon: "flag" },
  { id: "tasks", label: "Tasks", icon: "check_circle" },
];

const themes = [
  {
    id: "teal-sky",
    label: "Teal sky",
    type: "gradient",
    bgClass: "from-sky-900 via-sky-700 to-sky-400",
  },
  {
    id: "purple-pink",
    label: "Purple glow",
    type: "gradient",
    bgClass: "from-purple-900 via-fuchsia-700 to-pink-500",
  },
  {
    id: "sunset",
    label: "Sunset",
    type: "gradient",
    bgClass: "from-orange-900 via-amber-700 to-rose-500",
  },
  {
    id: "forest",
    label: "Forest",
    type: "image",
    image:
      "url('https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&w=1600')",
  },
  {
    id: "mountain",
    label: "Mountains",
    type: "image",
    image:
      "url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600')",
  },
  {
    id: "beach",
    label: "Beach",
    type: "image",
    image:
      "url('https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1600')",
  },
  {
    id: "midnight-city",
    label: "Midnight city",
    type: "gradient",
    bgClass: "from-slate-950 via-slate-800 to-sky-700",
  },
  {
    id: "neon",
    label: "Neon cyber",
    type: "gradient",
    bgClass: "from-fuchsia-700 via-purple-700 to-sky-400",
  },
  {
    id: "pastel",
    label: "Soft pastel",
    type: "gradient",
    bgClass: "from-rose-200 via-sky-100 to-emerald-100",
  },
  {
    id: "night-street",
    label: "Night street",
    type: "image",
    image:
      "url('https://images.pexels.com/photos/220067/pexels-photo-220067.jpeg?auto=compress&cs=tinysrgb&w=1600')",
  },
];

const getWeekDays = (currentDate) => {
  const day = currentDate.getDay();
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - day);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push(d);
  }
  return days;
};

const App = () => {
  const [lists, setLists] = useState(initialLists);
  const [selectedListId, setSelectedListId] = useState("my-day");
  const [pinnedListIds, setPinnedListIds] = useState([]);

  const [now, setNow] = useState(new Date());
  const [hideSidebar, setHideSidebar] = useState(false);

  const [activeThemeId, setActiveThemeId] = useState("teal-sky");
  const [sortBy, setSortBy] = useState("my-order");

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSidebarMoreOpen, setIsSidebarMoreOpen] = useState(false);

  const [accountPanel, setAccountPanel] = useState(null);

 
  const [quickTaskText, setQuickTaskText] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayString = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeString = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const weekDays = getWeekDays(now);
  const activeTheme = themes.find((t) => t.id === activeThemeId) || themes[0];

  const selectedList =
    lists.find((l) => l.id === selectedListId) || initialLists[0];

  
  const handleSuggestionClick = (text) => {
    setQuickTaskText(text);
    setIsSuggestionsOpen(false);
  };

  const handlePrintList = () => {
    setIsSidebarMoreOpen(false);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handleEmailList = () => {
    setIsSidebarMoreOpen(false);

    const subject = encodeURIComponent(
      `${selectedList?.label || "Tasks"} list`
    );

    const body = encodeURIComponent(
      `Here is my "${selectedList?.label || "Tasks"}" list from the To Do app.`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePinToStart = () => {
    setIsSidebarMoreOpen(false);

    if (!selectedList) return;

    const isPinned = pinnedListIds.includes(selectedList.id);

    if (isPinned) {
      setPinnedListIds((prev) => prev.filter((id) => id !== selectedList.id));
    } else {
      const ok = window.confirm(
        `Pin "${selectedList.label}" to Start / favourites?`
      );
      if (ok) {
        setPinnedListIds((prev) => [...prev, selectedList.id]);
      }
    }
  };


  const handleDeleteCurrentList = () => {
    setIsSidebarMoreOpen(false);
    if (!selectedList) return;

 
    const isDefault = initialLists.some((l) => l.id === selectedList.id);
    if (isDefault) {
      alert("Ye default list hai, ise delete nahi kar sakte 🙂");
      return;
    }

    const ok = window.confirm(
      `Are you sure you want to delete the list "${selectedList.label}"?`
    );
    if (!ok) return;

    setLists((prev) => prev.filter((l) => l.id !== selectedList.id));
    setPinnedListIds((prev) => prev.filter((id) => id !== selectedList.id));

    if (selectedListId === selectedList.id) {
      const fallback =
        initialLists.find((l) => l.id === "my-day") || initialLists[0];
      setSelectedListId(fallback.id);
    }
  };

  const handleAddList = () => {
    const name = window.prompt("Enter new list name:");
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setLists((prev) => [...prev, { id, label: name, icon: "list" }]);
    setSelectedListId(id);
  };

  const cycleTheme = () => {
    const idx = themes.findIndex((t) => t.id === activeThemeId);
    const next = themes[(idx + 1) % themes.length];
    setActiveThemeId(next.id);
  };

  const closeAllMenus = () => {
    setIsAccountMenuOpen(false);
    setIsSuggestionsOpen(false);
    setIsThemeMenuOpen(false);
    setIsSidebarMoreOpen(false);
  };

  const closePanel = () => {
    setAccountPanel(null);
  };

  const getPanelInfo = () => {
    if (accountPanel === "settings") {
      return {
        title: "Settings",
        subtitle:
          "Change general app preferences like notifications, theme and keyboard behavior.",
      };
    }
    if (accountPanel === "accounts") {
      return {
        title: "Manage accounts",
        subtitle:
          "View and manage the Outlook / Microsoft accounts connected to this To Do app.",
      };
    }
    if (accountPanel === "theme") {
      return {
        title: "Theme & appearance",
        subtitle:
          "Pick a background image or color theme. You can also change theme using the three-dots menu on the toolbar.",
      };
    }
    return { title: "", subtitle: "" };
  };

  const panelInfo = getPanelInfo();

  return (
    <>
      <div
        className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col md:flex-row font-body"
        onClick={closeAllMenus}
      >
        
        {!hideSidebar && (
          <aside className="relative w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
          
            <div
              className="flex items-center gap-3 px-4 py-3 sm:py-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/40"
              onClick={(e) => {
                e.stopPropagation();
                setIsSuggestionsOpen(false);
                setIsThemeMenuOpen(false);
                setIsSidebarMoreOpen(false);
                setIsAccountMenuOpen((prev) => !prev);
              }}
              aria-haspopup="true"
              aria-expanded={isAccountMenuOpen}
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  Akanksha Singh
                </p>
              </div>
            </div>

            {isAccountMenuOpen && (
              <div
                className="absolute left-4 top-16 bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-56 text-sm z-30"
                role="menu"
                aria-label="Account menu"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-slate-800"
                  role="menuitem"
                  onClick={() => {
                    setAccountPanel("settings");
                    setIsAccountMenuOpen(false);
                  }}
                >
                  Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-slate-800"
                  role="menuitem"
                  onClick={() => {
                    setAccountPanel("accounts");
                    setIsAccountMenuOpen(false);
                  }}
                >
                  Manage accounts
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-slate-800"
                  role="menuitem"
                  onClick={() => {
                    setAccountPanel("theme");
                    setIsAccountMenuOpen(false);
                  }}
                >
                  Theme &amp; appearance
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-red-300 hover:bg-slate-800/80"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            )}

           
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2 bg-slate-800 rounded-md px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-300">
                <span className="material-symbols-outlined text-sm sm:text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none w-full placeholder:text-slate-500"
                />
              </div>
            </div>

          
            <nav className="px-2 flex-1 overflow-y-auto">
              {lists.map((item) => {
                const isActive = item.id === selectedListId;
                const isPinned = pinnedListIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    title={item.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeAllMenus();
                      setSelectedListId(item.id);
                    }}
                    className={`
                      group relative
                      w-full flex items-center gap-2
                      px-1.5 sm:px-3 py-2.5
                      rounded-lg sm:text-sm text-[13px] mb-0.5
                      transition-all duration-200 ease-out transform
                      ${
                        isActive
                          ? "bg-slate-800/90 text-slate-50 shadow-md scale-[1.02]"
                          : "text-slate-300 hover:bg-slate-900/80 hover:text-white hover:shadow-md hover:scale-[1.03] hover:-translate-x-1"
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2
                        h-7 w-1 rounded-r-full
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                            : "bg-transparent group-hover:bg-sky-500 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                        }
                      `}
                    />

                    <span
                      className={`
                        material-symbols-outlined text-base
                        transition-colors duration-200
                        ${
                          isActive
                            ? "text-sky-300"
                            : "text-slate-400 group-hover:text-sky-300"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span className="truncate">{item.label}</span>

                    {isPinned && (
                      <span className="material-symbols-outlined text-xs ml-auto text-sky-300">
                        push_pin
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            
            <div className="border-t border-slate-800 px-4 py-2 sm:py-3 flex items-center justify-between text-xs sm:text-sm text-slate-300 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeAllMenus();
                  handleAddList();
                }}
                className="flex items-center gap-2 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm sm:text-base -mt-0.5">
                  add
                </span>
                <span>New list</span>
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSidebarMoreOpen((p) => !p);
                    setIsThemeMenuOpen(false);
                    setIsSuggestionsOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-800 transition"
                  aria-haspopup="true"
                  aria-expanded={isSidebarMoreOpen}
                  title="List options"
                >
                  <span className="material-symbols-outlined text-lg">
                    more_horiz
                  </span>
                </button>

                {isSidebarMoreOpen && (
                  <div
                    className="absolute right-0 bottom-9 w-56 max-w-[90vw] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-xs z-30 py-1"
                    role="menu"
                    aria-label="List options"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handlePrintList}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800"
                    >
                      <span className="material-symbols-outlined text-sm">
                        print
                      </span>
                      <span>Print list</span>
                    </button>

                    <button
                      onClick={handleEmailList}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800"
                    >
                      <span className="material-symbols-outlined text-sm">
                        mail
                      </span>
                      <span>Email list</span>
                    </button>

                    <button
                      onClick={handlePinToStart}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800"
                    >
                      <span className="material-symbols-outlined text-sm">
                        push_pin
                      </span>
                      <span>
                        {pinnedListIds.includes(selectedListId)
                          ? "Unpin from Start"
                          : "Pin to Start"}
                      </span>
                    </button>

                  
                    <button
                      onClick={handleDeleteCurrentList}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-red-300"
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                      <span>Delete list</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

       
        <main className="flex-1 flex flex-col">
         
          <header className="relative h-12 sm:h-14 px-3 sm:px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur z-20">
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm text-slate-300">
                <span className="material-symbols-outlined text-sm mr-1">
                  schedule
                </span>
                <span className="hidden sm:inline">{todayString}</span>
                <span className="font-mono">{timeString}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 text-slate-300">
             
              <button
                title="Next theme"
                onClick={(e) => {
                  e.stopPropagation();
                  closeAllMenus();
                  cycleTheme();
                }}
                className="p-1 sm:p-1.5 rounded-full transition-all duration-200 ease-out hover:scale-105"
              >
                <img
                  src={themeIcon}
                  alt="Theme"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                />
              </button>

              <div className="relative">
                <button
                  title="Suggestions"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSuggestionsOpen((p) => !p);
                    setIsThemeMenuOpen(false);
                    setIsSidebarMoreOpen(false);
                  }}
                  className="p-1 sm:p-1.5 rounded-full transition-all duration-200 ease-out hover:scale-105"
                  aria-haspopup="true"
                  aria-expanded={isSuggestionsOpen}
                >
                  <img
                    src={suggestionIcon}
                    alt="Suggestions"
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                  />
                </button>
                {isSuggestionsOpen && (
                  <div
                    className="absolute right-0 mt-2 sm:mt-3 w-72 sm:w-80 md:w-96 max-w-[90vw] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-sm z-30 p-2"
                    role="menu"
                    aria-label="Suggestions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-2 border-b border-slate-700 font-medium text-slate-100">
                      Suggestions
                    </div>

                    <button
                      className="w-full text-left px-4 py-2.5 mt-1 hover:bg-slate-800/80 rounded-lg"
                      role="menuitem"
                      onClick={() =>
                        handleSuggestionClick("Review your important tasks")
                      }
                    >
                      Review your important tasks
                    </button>

                    <button
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800/80 rounded-lg"
                      role="menuitem"
                      onClick={() =>
                        handleSuggestionClick("Plan tomorrow's work")
                      }
                    >
                      Plan tomorrow&apos;s work
                    </button>

                    <button
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800/80 rounded-lg"
                      role="menuitem"
                      onClick={() =>
                        handleSuggestionClick("Add a reminder for study")
                      }
                    >
                      Add a reminder for study
                    </button>
                  </div>
                )}
              </div>

             
              <div className="relative">
                <button
                  title="More"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsThemeMenuOpen((p) => !p);
                    setIsSuggestionsOpen(false);
                    setIsSidebarMoreOpen(false);
                  }}
                  className="p-1 sm:p-1.5 rounded-full transition-all duration-200 ease-out hover:scale-105"
                  aria-haspopup="true"
                  aria-expanded={isThemeMenuOpen}
                >
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    more_horiz
                  </span>
                </button>

                {isThemeMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 sm:mt-3 w-80 md:w-96 max-w-[90vw] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-sm z-30 p-3 sm:p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-3">
  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold uppercase text-slate-400 mb-1">
    <span className="material-symbols-outlined text-[10px] sm:text-xs">
      swap_vert
    </span>
    <span>Sort by</span>
  </div>

  <div className="flex flex-wrap gap-2">
    {[
      { id: "my-order", label: "My order" },
    ].map((opt) => (
      <button
        key={opt.id}
        onClick={() => setSortBy(opt.id)}
        className={`px-2 py-1 rounded-md border text-[11px] sm:text-xs ${
          sortBy === opt.id
            ? "border-sky-400 text-sky-300 bg-sky-900/40"
            : "border-slate-600 text-slate-200 hover:bg-slate-800"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
</div>


                    <div className="mt-2">
                      <p className="text-[11px] sm:text-xs font-semibold uppercase text-slate-400 mb-2">
                        Theme
                      </p>
                      <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {themes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setActiveThemeId(theme.id)}
                            className={`
                              h-9 sm:h-10 w-12 sm:w-14 rounded-lg border-2 overflow-hidden
                              transition-all duration-200
                              ${
                                activeThemeId === theme.id
                                  ? "border-sky-300 shadow-md scale-105"
                                  : "border-slate-700 hover:border-sky-300 hover:shadow-md"
                              }
                            `}
                            style={
                              theme.type === "image"
                                ? {
                                    backgroundImage: theme.image,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }
                                : {}
                            }
                          >
                            {theme.type === "gradient" && (
                              <span
                                className={`block h-full w-full bg-gradient-to-b ${theme.bgClass}`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

             
              <button
                title={hideSidebar ? "Show sidebar" : "Hide sidebar"}
                onClick={(e) => {
                  e.stopPropagation();
                  closeAllMenus();
                  setHideSidebar((p) => !p);
                }}
                className="p-1 sm:p-1.5 rounded-full transition-all duration-200 ease-out hover:scale-105"
              >
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                  {hideSidebar ? "close_fullscreen" : "open_in_full"}
                </span>
              </button>
            </div>
          </header>

       
          <div className="flex-1 relative overflow-hidden">
            <div
              className={`absolute inset-0 ${
                activeTheme.type === "gradient"
                  ? `bg-gradient-to-b ${activeTheme.bgClass}`
                  : "bg-cover bg-center"
              }`}
              style={
                activeTheme.type === "image"
                  ? { backgroundImage: activeTheme.image }
                  : {}
              }
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative h-full flex flex-col">
              <div className="px-4 sm:px-6 md:px-10 pt-6 sm:pt-8">
                <h1
                  className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight"
                  title={`${selectedList.label} list`}
                >
                  {selectedList.label}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-200">
                  {todayString}
                </p>

              
                <div className="mt-6 sm:mt-8">
                  <div className="flex gap-3 overflow-x-auto pb-3">
                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg backdrop-blur-sm">
                      {weekDays.map((d) => {
                        const isToday = d.toDateString() === now.toDateString();
                        return (
                          <button
                            key={d.toISOString()}
                            title={d.toLocaleDateString("en-IN")}
                            onClick={() => {
                              
                            }}
                            className={`flex flex-col items-center justify-center w-14 sm:w-16 py-2 rounded-xl transition-transform duration-200 ease-out transform focus:outline-none
                              ${
                                isToday
                                  ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-[0_12px_30px_rgba(99,102,241,0.12)]"
                                  : "bg-slate-800/40 text-slate-200 hover:bg-slate-800/70 hover:scale-105"
                              }
                            `}
                          >
                            <span className="text-[10px] sm:text-[11px] uppercase font-medium tracking-wide opacity-90">
                              {d.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                            <span className="mt-1 text-lg sm:text-xl font-semibold leading-none">
                              {d.getDate()}
                            </span>
                            <span className="mt-0.5 text-[10px] text-slate-400">
                              {d.toLocaleDateString("en-IN", { month: "short" })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="flex-1 flex flex-col items-stretch sm:items-start justify-end pb-6 sm:pb-8 md:pb-10 px-3 sm:px-6 md:px-10"
                onClick={(e) => e.stopPropagation()}
              >
              

                {selectedListId === "flagged" && (
                  <p className="mb-3 sm:mb-4 text-[11px] sm:text-sm text-rose-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg sm:text-xl text-rose-300">
                      flag
                    </span>
                    Messages you flag will show up as tasks here.
                  </p>
                )}

                {selectedListId === "assigned" && (
                  <p className="mb-3 sm:mb-4 text-[11px] sm:text-sm text-emerald-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg sm:text-xl text-emerald-300">
                      person
                    </span>
                    Tasks assigned to you will show here.
                  </p>
                )}

                <div className="w-full max-w-3xl">
                  <Todo
                    activeListId={selectedListId}
                    sortBy={sortBy}
                    quickTaskText={quickTaskText}
                    setQuickTaskText={setQuickTaskText}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {accountPanel && (
        <div
          className="fixed inset-0 z-40 flex items-stretch justify-end bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-label={panelInfo.title}
          onClick={closePanel}
        >
          <div
            className="h-full w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-semibold font-heading">
                  {panelInfo.title}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 font-body">
                  {panelInfo.subtitle}
                </p>
              </div>
              <button
                onClick={closePanel}
                className="p-2 rounded-full hover:bg-slate-800"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 text-sm space-y-4 font-body">
              {accountPanel === "settings" && (
                <>
                  <div>
                    <p className="font-medium mb-1">General</p>
                    <label className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300">
                      <input
                        type="checkbox"
                        className="accent-sky-500"
                        defaultChecked
                      />
                      Enable notifications for due tasks
                    </label>
                    <label className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300 mt-1">
                      <input type="checkbox" className="accent-sky-500" />
                      Show completed tasks at the bottom
                    </label>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Appearance</p>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      To quickly change theme, use the picture icon or
                      three-dots menu on the toolbar.
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setActiveThemeId(theme.id)}
                        className={`rounded-lg border-2 text-left text-[11px] sm:text-xs p-1
                          ${
                            activeThemeId === theme.id
                              ? "border-sky-400"
                              : "border-transparent"
                          }`}
                      >
                        <div
                          className="h-10 w-full rounded-md mb-1 bg-cover bg-center bg-no-repeat"
                          style={
                            theme.type === "image"
                              ? { backgroundImage: theme.image }
                              : {}
                          }
                        >
                          {theme.type === "gradient" && (
                            <span
                              className={`block h-full w-full rounded-md bg-gradient-to-b ${theme.bgClass}`}
                            />
                          )}
                        </div>
                        <span>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-2">
                    Tip: you can also open the theme picker from the
                    three-dots ("More") menu in the top-right corner.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
