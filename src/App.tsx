
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Search } from './pages/Search';
import { Detail } from './pages/Detail';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative min-h-screen w-full overflow-x-hidden bg-bg text-text">
          <div className="aurora" />
          <div className="relative z-10">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse/:kind" element={<Browse />} />
                <Route path="/search" element={<Search />} />
                <Route path="/title/:type/:id" element={<Detail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>);

}