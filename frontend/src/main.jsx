import ReactDOM from 'react-dom/client';

import App from './App';

import 'normalize.css';
import './styles/main.css';

document.title = 'Aquarium Monitor';
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
