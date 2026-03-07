import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GroupsPage } from './pages/GroupsPage';
import { GroupDetailPage } from './pages/GroupDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
