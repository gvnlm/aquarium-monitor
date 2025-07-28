import { useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import '../styles/MaxPointsForm.css';

const MIN_MAX_NUM_OF_READINGS = 1;
const MAX_MAX_NUM_OF_READINGS = 9999;

const MaxPointsForm = ({ maxNumOfReadings, onMaxNumOfReadingsChange }) => {
  const [input, setInput] = useState(maxNumOfReadings);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const submitForm = () => {
    const num = Number(input);

    if (num >= MIN_MAX_NUM_OF_READINGS && num <= MAX_MAX_NUM_OF_READINGS) {
      onMaxNumOfReadingsChange(num);
    } else {
      setInput(maxNumOfReadings);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitForm();
      e.target.blur();
    }
  };

  return (
    <div className="max-points-form">
      <label
        htmlFor="points"
        data-tooltip-id="points-tooltip"
        data-tooltip-html="Max number of data points per chart.<br/>Excess data is aggregated."
      >
        Points:
      </label>
      <ReactTooltip id="points-tooltip" className="react-tooltip" />

      <input
        id="points"
        type="number"
        min={MIN_MAX_NUM_OF_READINGS}
        max={MAX_MAX_NUM_OF_READINGS}
        value={input}
        onChange={handleInputChange}
        onBlur={submitForm}
        onKeyDown={handleInputKeyDown}
      />
    </div>
  );
};

export default MaxPointsForm;
