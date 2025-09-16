import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';

function App() {
return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/movies" element={<HomePage />}/>
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
