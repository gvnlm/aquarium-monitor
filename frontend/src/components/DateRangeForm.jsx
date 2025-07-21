import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../styles/DateRangeForm.css';

const DateRangeForm = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate = null,
}) => {
  return (
    <div className="date-range-form">
      <div className="date-form">
        <label htmlFor="start-date">From:</label>
        <DatePicker
          id="start-date"
          className="date-picker"
          selected={startDate}
          onChange={(date) => {
            if (date.getTime() !== startDate.getTime()) {
              onStartDateChange(date);
            }
          }}
          minDate={minStartDate}
          maxDate={endDate}
          showTimeSelect
          timeIntervals={15}
          dateFormat="d/MM/yy, h:mm aa"
          popperPlacement="top-start"
        />
      </div>

      <div className="date-form">
        <label htmlFor="end-date">To:</label>
        <DatePicker
          id="end-date"
          className="date-picker"
          selected={endDate}
          onChange={(date) => {
            if (date.getTime() !== endDate.getTime()) {
              onEndDateChange(date);
            }
          }}
          minDate={startDate}
          maxDate={new Date()}
          showTimeSelect
          timeIntervals={15}
          dateFormat="d/MM/yy, h:mm aa"
          popperPlacement="top-start"
        />
      </div>
    </div>
  );
};

export default DateRangeForm;
