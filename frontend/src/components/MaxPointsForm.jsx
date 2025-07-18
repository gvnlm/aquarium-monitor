import { useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import '../styles/MaxPointsForm.css';

const MaxPointsForm = ({ maxNumOfReadings, onMaxNumOfReadingsChange }) => {
  const [input, setInput] = useState(maxNumOfReadings);

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = Number(input);
    if (num > 0) {
      onMaxNumOfReadingsChange(num);
    }
  };

  return (
    <form className="max-points-form" onSubmit={handleSubmit}>
      <label
        htmlFor="points"
        data-tooltip-id="points"
        data-tooltip-html="Max number of data points per chart.<br/>Excess data is aggregated."
      >
        Points:
      </label>
      <ReactTooltip id="points" />

      <input
        id="points"
        type="number"
        min="1"
        max="9999"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button type="submit">Set</button>
    </form>
  );
};

export default MaxPointsForm;
