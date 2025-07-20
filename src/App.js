import './App.css';
import WebsiteTaskbar from './components/Taskbar';
import WebsiteDesktop from './components/Desktop';
import { GlobalStyle } from '@react95/core';

function App() {
  return (
    <div className="App">
      <div className='App-body'>
        <GlobalStyle />
        <WebsiteDesktop />
        <WebsiteTaskbar />
      </div>
    </div>
  );
}

export default App;
