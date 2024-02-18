import { format } from "date-fns";
import { PenTool, Trash2 } from "react-feather";
import { useState } from "react";

export interface EventType {
  id: number;
  date: Date;
  title: string;
  description?: string;
}

interface EventProps {
  currentEvent: EventType;
}

export function Event({ currentEvent }: EventProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const deleteEvent = (eventId: string | number) => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
        console.log("Event deleted successfully");
        // Handle deletion success, such as updating UI
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        // Handle deletion error, such as showing an error message
      });
  };

  return (
    <div
      className="eventWrapper"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="eventData">
        <span className="eventHeader">
          <span className="eventTime">
            {format(currentEvent.date, "HH:mm")}
          </span>
          {currentEvent.title}
        </span>
        <span className="eventDescription">
          {currentEvent.description && currentEvent.description}
        </span>
      </div>

      {showOptions && (
        <div className="eventOptions">
          <Trash2
            onClick={() => deleteEvent(currentEvent.id)}
            className="clickable"
            size={18}
          />
          <PenTool className="clickable" size={18} />
        </div>
      )}
    </div>
  );
}
