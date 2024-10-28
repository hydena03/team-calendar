import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="font-medium text-lg mb-2">{event.title}</div>
      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{event.date} {event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span>{event.attendees.join(', ')}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;