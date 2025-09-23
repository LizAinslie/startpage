import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import "../styles/clock.scss";

const Clock: FC = () => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  const tick = useCallback(() => {
    setDate(new Date());
  }, []);

  // fixme: i hate javascriptfuck these `any`
  const timeOpts: any = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    second: "2-digit",
  };
  const timeString = useMemo(
    () => date.toLocaleTimeString("en-GB", timeOpts),
    [date],
  );

  const dateOpts: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateString = useMemo(
    () => date.toLocaleDateString("en-GB", dateOpts),
    [date],
  );

  return (
    <div className="clock">
      <span className="time_component">
        <FontAwesomeIcon icon={faCalendar} className="icon" />
        {dateString}
      </span>
      <div className="separator" />
      <span className="time_component">
        <FontAwesomeIcon icon={faClock} className="icon" />
        {timeString}
      </span>
    </div>
  );
};

export default Clock;
