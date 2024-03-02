import LoginPage from './page/LoginPage/LoginPage';
import SignupPage from './page/SignupPage/SignupPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatMessenger from './page/Chat/Chat';
import { SocketProvider } from './useSocket/useSocket';
function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="App">
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat/room_id/:room_id" element={<ChatMessenger />} />
            <Route path="/chat/:user_id" element={<ChatMessenger />} />
          </Routes>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
