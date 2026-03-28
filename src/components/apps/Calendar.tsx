import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from "date-fns";

interface Event {
  id: string;
  title: string;
  time: string;
  color: string;
}

const MOCK_EVENTS: Record<string, Event[]> = {
  "2026-03-14": [
    { id: "e1", title: "MacOS Project Review", time: "10:00 AM", color: "bg-blue-500" },
    { id: "e2", title: "Lunch with Team", time: "12:30 PM", color: "bg-green-500" },
  ],
  "2026-03-15": [
    { id: "e3", title: "Yoga Class", time: "08:00 AM", color: "bg-purple-500" },
  ],
  "2026-03-18": [
    { id: "e4", title: "Weekly Sync", time: "09:00 AM", color: "bg-blue-500" },
  ],
};

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 14)); // March 2026
  const [selectedDay, setSelectedDay] = useState(new Date(2026, 2, 14));

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8 px-2">
      <div className="text-2xl font-bold tracking-tight text-white/90">
        {format(currentMonth, "MMMM yyyy")}
      </div>
      <div className="flex items-center space-x-2 bg-white/5 rounded-md p-1 border border-white/5">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <span className="i-material-symbols:chevron-left text-2xl opacity-60 hover:opacity-100" />
        </button>
        <button 
          onClick={() => setCurrentMonth(new Date(2026, 2, 14))}
          className="px-2 text-[12px] font-bold opacity-60 hover:opacity-100 uppercase"
        >
          Today
        </button>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <span className="i-material-symbols:chevron-right text-2xl opacity-60 hover:opacity-100" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-white/5">
        {days.map((d, i) => (
          <div key={i} className="text-center py-2 text-[11px] font-bold text-white/30 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const clonedDay = day;
        const dateKey = format(clonedDay, "yyyy-MM-dd");
        const hasEvents = MOCK_EVENTS[dateKey];
        const isSelected = isSameDay(clonedDay, selectedDay);
        const isCurrentMonth = isSameMonth(clonedDay, monthStart);
        const isToday = isSameDay(clonedDay, new Date(2026, 2, 14));

        days.push(
          <div
            key={clonedDay.toString()}
            className={`relative flex flex-col items-center h-16 pt-2 border-r border-b border-white/5 transition-all duration-150 cursor-default group ${
              !isCurrentMonth ? "opacity-20" : "hover:bg-white/5"
            } ${isSelected ? "bg-red-500/10" : ""}`}
            onClick={() => setSelectedDay(clonedDay)}
          >
            <span className={`size-7 flex items-center justify-center text-[14px] rounded-full sm:text-base ${
              isToday ? "bg-red-500 text-white font-bold shadow-lg" : isSelected ? "text-red-400 font-bold" : "text-white/80"
            }`}>
              {format(clonedDay, "d")}
            </span>
            {hasEvents && (
              <div className="flex space-x-0.5 mt-1.5 align-middle">
                 {hasEvents.slice(0, 3).map(e => (
                   <div key={e.id} className={`size-1.5 rounded-full ${e.color}`} />
                 ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border-l border-t border-white/5">{rows}</div>;
  };

  return (
    <div className="flex h-full bg-[#1e1e1f] text-white overflow-hidden font-sans">
       {/* Sidebar / Schedule */}
       <div className="w-64 bg-white/2 backdrop-blur-3xl border-r border-black/30 flex flex-col py-6 shrink-0">
          <div className="px-6 mb-8">
             <div className="text-[11px] font-bold opacity-30 uppercase tracking-widest mb-1">Calendar</div>
             <div className="text-3xl font-bold text-red-500">{format(selectedDay, "d")}</div>
             <div className="text-xl font-medium opacity-60">{format(selectedDay, "EEEE")}</div>
          </div>
          
          <div className="px-6 flex-1 overflow-y-auto no-scrollbar">
             <div className="text-[11px] font-bold opacity-30 uppercase tracking-widest mb-4">Upcoming</div>
             <div className="space-y-4">
                {MOCK_EVENTS[format(selectedDay, "yyyy-MM-dd")] ? (
                  MOCK_EVENTS[format(selectedDay, "yyyy-MM-dd")].map(event => (
                    <div key={event.id} className="flex space-x-3 group translate-y-0 hover:-translate-y-0.5 transition-transform duration-200">
                       <div className={`w-1 self-stretch rounded-full ${event.color} opacity-80`} />
                       <div className="flex flex-col py-0.5">
                          <span className="text-[13.5px] font-bold text-white/90 group-hover:text-white transition-colors">{event.title}</span>
                          <span className="text-[11px] opacity-40 font-medium uppercase tracking-tight">{event.time}</span>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[13px] opacity-20 italic">No events today</div>
                )}
             </div>
          </div>
       </div>

       {/* Main Grid */}
       <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar shadow-inner">
          {renderHeader()}
          <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden shadow-2xl ring-1 ring-white/5">
            {renderDays()}
            {renderCells()}
          </div>
       </div>
    </div>
  );
}
