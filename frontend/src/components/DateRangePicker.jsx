import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../styles/DateRangePicker.css';

const DateTimeRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="date-range-picker">
      <label htmlFor="start-date">From:</label>
      <DatePicker
        id="start-date-time"
        selected={startDate}
        onChange={(date) => onStartDateChange(date)}
        maxDate={new Date()}
        showTimeSelect
        timeIntervals={15}
        dateFormat="Pp"
        popperPlacement="top-start"
      />

      <label htmlFor="end-date">To:</label>
      <DatePicker
        id="end-date-time"
        selected={endDate}
        onChange={(date) => onEndDateChange(date)}
        minDate={startDate}
        maxDate={new Date()}
        showTimeSelect
        timeIntervals={15}
        dateFormat="Pp"
        popperPlacement="top-start"
      />
    </div>
  );
};

export default DateTimeRangePicker;
