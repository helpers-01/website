import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarComponentProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates: string[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedDate,
  onDateSelect,
  availableDates
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const isAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return availableDates.includes(dateString);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const available = isAvailable(day);
          const currentMonth = isCurrentMonth(day);
          const today = isToday(day);
          const selected = isSelected(day);
          const past = isPast(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => available && currentMonth && !past && onDateSelect(day)}
              disabled={!available || !currentMonth || past}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                ${!currentMonth ? 'text-gray-300' : ''}
                ${past ? 'text-gray-300 cursor-not-allowed' : ''}
                ${available && currentMonth && !past
                  ? 'hover:bg-purple-100 cursor-pointer'
                  : 'cursor-not-allowed'
                }
                ${selected ? 'bg-purple-600 text-white' : ''}
                ${today && !selected ? 'bg-purple-100 text-purple-600 font-semibold' : ''}
                ${available && currentMonth && !past && !selected
                  ? 'bg-purple-50 text-purple-600'
                  : ''
                }
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarComponent;