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
      <span>Show up to</span>

      <input
        type="number"
        min="1"
        max="9999"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <span>aggregated data points from</span>

      <DatePicker
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

      <span>to</span>

      <DatePicker
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

      <button type="submit">Set</button>
    </form>
  );
};

export default FilterForm;
