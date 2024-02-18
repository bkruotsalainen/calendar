import { format } from "date-fns";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Calendar, Plus } from "react-feather";

import { Event, type EventType } from "./Event";

import "../style/modal.css";

interface ModalProps {
  events: EventType[];
  date: Date;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export function Modal({ events, date, isOpen, setIsOpen }: ModalProps) {
  const [showSelector, setShowSelector] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const eventData = Object.fromEntries(formData.entries());

    // Handle time
    const timeString = eventData.date as string;
    const [hoursString, minutesString] = timeString.split(":");
    const hours = parseInt(hoursString, 10);
    const minutes = parseInt(minutesString, 10);

    const eventDate = new Date(date);
    eventDate.setHours(hours);
    eventDate.setMinutes(minutes);

    const eventTimeMilliseconds = eventDate.getTime();

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...eventData, date: eventTimeMilliseconds }),
    })
      .then((response) => response.json())
      .then((result) => {
        // Handle the result if needed
        console.log("Data posted successfully:", result);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  return (
    <>
      {isOpen && (
        <div
          className="modalWrapper"
          onMouseDown={() => {
            setIsOpen(!isOpen);
            setShowSelector(false);
          }}
        >
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>{format(date, "d MMMM")}</h2>
              <button
                className="plus"
                onClick={() => setShowSelector(!showSelector)}
              >
                {!showSelector ? <Plus /> : <Calendar />}
              </button>
            </div>

            <div className="modalContent">
              {showSelector ? (
                <form className="eventForm" onSubmit={(e) => handleSubmit(e)}>
                  <h3>Add new event</h3>
                  <input
                    type="time"
                    name="date"
                    placeholder="00:00"
                    autoFocus
                    required
                  />
                  <input
                    type="text"
                    name="title"
                    minLength={2}
                    placeholder="Event name"
                    required
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Event description (optional)"
                  />
                  <button type="submit">Ready</button>
                </form>
              ) : (
                events
                  .filter(
                    (event) =>
                      format(event.date, "dd MMMM yyyy") ===
                      format(date, "dd MMMM yyy")
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((event) => <Event key={event.id} currentEvent={event} />)
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
