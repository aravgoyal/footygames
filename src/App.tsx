import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { TransferXI } from "./pages/TransferXI.tsx"
import { FootySidebar } from './Sidebar.tsx';
import { FiveASide } from './pages/FiveASide.tsx';
import { BlindRank } from './pages/BlindRank.tsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <div>
        <FootySidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transferxi" element={<TransferXI />} />
          <Route path="/fiveaside" element={<FiveASide />} />
          <Route path="/blindrank" element={<BlindRank />} />
        </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
