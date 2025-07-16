import { useState } from 'react';

function MaxNumOfReadingsForm({ maxNumOfReadings, setMaxNumOfReadings }) {
  const [input, setInput] = useState(maxNumOfReadings);

  const handleSubmit = (e) => {
    e.preventDefault();

    const num = Number(input);
    if (num > 0) {
      setMaxNumOfReadings(num);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="max-num-of-readings">Maximum number of data points displayed: </label>
      <input
        id="max-num-of-readings"
        type="number"
        min="1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Set</button>
    </form>
  );
}

export default MaxNumOfReadingsForm;
