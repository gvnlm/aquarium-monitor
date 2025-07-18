import { useState } from 'react';

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
      <label htmlFor="points">Points:</label>
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
