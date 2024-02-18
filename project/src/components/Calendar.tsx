import { format, addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "react-feather";
import { Modal } from "./Modal";

import type { EventType } from "./Event";

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function Calendar() {
  const [events, setEventData] = useState<EventType[]>([]);
  const [eventLoader, setEventStatus] = useState<string | null>(null);

  const getData = () => {
    setEventStatus("⭐");

    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((result) => {
        setEventData(result);
        setEventStatus(null);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getData();
  }, []);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const getDaysInMonth = (currentDate: Date) => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysToShift = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < daysToShift; i++) {
      days.unshift(null);
    }

    return days;
  };

  const [daysInMonth, setDaysInMonth] = useState<(number | null)[]>(
    getDaysInMonth(new Date())
  );

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
  }, [currentDate]);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth() &&
      day === today.getDate()
    );
  };

  return (
    <>
      <main>
        <section className="calendar">
          <header className="calendarHeader">
            {eventLoader !== null && <p className="loading">{eventLoader}</p>}
            <button
              onClick={() => {
                setCurrentDate(subMonths(currentDate, 1));
                setDaysInMonth(getDaysInMonth(currentDate));
              }}
            >
              <ChevronsLeft className="chevron" />
            </button>

            <button className="clickable">
              <h1>{format(currentDate, "MMMM yyyy")}</h1>
            </button>

            <button
              onClick={() => {
                setCurrentDate(addMonths(currentDate, 1));
                setDaysInMonth(getDaysInMonth(currentDate));
              }}
            >
              <ChevronsRight className="chevron" />
            </button>
          </header>
          <div className="weekdays">
            {weekdays.map((weekday) => (
              <div key={weekday} className="weekday">
                <h2>
                  {weekday[0].toUpperCase() + weekday.slice(1, 3).toLowerCase()}
                </h2>
              </div>
            ))}
          </div>
          <div className="days">
            {daysInMonth.map((day, index) => (
              <div
                key={index}
                tabIndex={day !== null ? 0 : -1}
                className={day !== null ? (isToday(day) ? "today" : "day") : ""}
                style={
                  events.filter(
                    (event) =>
                      format(event.date, "dd MMMM yyyy") ===
                      format(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day as number
                        ),
                        "dd MMMM yyy"
                      )
                  ).length > 0
                    ? {
                        borderRadius: "100%",
                        outlineOffset: "-10px",
                        outline: "4px solid #00DBDE",
                      }
                    : {}
                }
                onClick={() => {
                  setSelectedDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day as number
                    )
                  );
                  setModalIsOpen(!modalIsOpen);
                }}
              >
                {day !== null && (
                  <div className="dayContent">{day !== null && day}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Modal
        events={events}
        date={selectedDate}
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
      />
    </>
  );
}
