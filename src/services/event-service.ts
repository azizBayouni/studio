
import { events, type Event } from '@/lib/data';

export function addEvent(newEventData: Omit<Event, 'id' | 'status'>): void {
    const newId = 'e' + (Math.max(0, ...events.map(e => parseInt(e.id.substring(1)))) + 1).toString();
    const newEvent: Event = {
        ...newEventData,
        id: newId,
        status: 'active',
    };
    events.push(newEvent);
}

export function updateEvent(updatedEvent: Event): void {
  const index = events.findIndex((e) => e.id === updatedEvent.id);
  if (index !== -1) {
    events[index] = updatedEvent;
  } else {
    console.error(`Event with id ${updatedEvent.id} not found.`);
  }
}

export function deleteEvent(eventId: string): void {
    const index = events.findIndex((e) => e.id === eventId);
    if (index !== -1) {
        events.splice(index, 1);
    } else {
        console.error(`Event with id ${eventId} not found.`);
    }
}
