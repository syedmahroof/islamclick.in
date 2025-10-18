import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Calendar', href: '/calendar' },
];

export default function CalendarPage() {
  const [events] = useState([
    // Sample events - in a real app, these would come from your API
    { title: 'Team Meeting', start: new Date(), end: new Date(new Date().setHours(new Date().getHours() + 1)) },
    { title: 'Lunch with Client', start: new Date(new Date().setDate(new Date().getDate() + 1)), end: new Date(new Date().setDate(new Date().getDate() + 1)) },
  ]);

  const handleDateClick = (arg: any) => {
    // Handle date click (e.g., to add a new event)
    console.log('Date clicked:', arg.dateStr);
  };

  const handleEventClick = (arg: any) => {
    // Handle event click (e.g., to view or edit an event)
    console.log('Event clicked:', arg.event.title);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Calendar" />
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height="70vh"
            events={events}
            nowIndicator={true}
            editable={true}
            selectable={true}
            selectMirror={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
        </div>
      </div>
    </AppLayout>
  );
}
