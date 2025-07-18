import { useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../styles/FilterForm.css';

const FilterForm = ({
  maxNumOfReadings,
  onMaxNumOfReadingsChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const [input, setInput] = useState(maxNumOfReadings);

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = Number(input);
    if (num > 0) {
      onMaxNumOfReadingsChange(num);
    }
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <button type="submit">Set</button>

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
        maxDate={new Date()}
        showTimeSelect
        timeIntervals={15}
        dateFormat="d/MM/yy, h:mm aa"
        popperPlacement="top-start"
      />

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

      <label htmlFor="points">Points:</label>
      <input
        id="points"
        type="number"
        min="1"
        max="9999"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </form>
  );
};

export default FilterForm;
