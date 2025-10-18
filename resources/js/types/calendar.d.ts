declare module '@fullcalendar/react' {
  import { ComponentType } from 'react';
  import { CalendarOptions } from '@fullcalendar/core';
  
  export interface EventApi {
    title: string;
    start: Date | string;
    end?: Date | string;
    allDay?: boolean;
    id?: string | number;
    [key: string]: any;
  }

  export interface DateClickArg {
    date: Date;
    dateStr: string;
    allDay: boolean;
    dayEl: HTMLElement;
    jsEvent: MouseEvent;
    view: any;
  }

  export interface EventClickArg {
    event: EventApi;
    el: HTMLElement;
    jsEvent: MouseEvent;
    view: any;
  }

  const FullCalendar: ComponentType<CalendarOptions>;
  export default FullCalendar;
}
