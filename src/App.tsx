import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.tsx";
import { TransferXI } from "./components/TransferXI.tsx"
import { FiveASide } from './components/FiveASide.tsx';
import { BlindRank } from './components/BlindRank.tsx';
import { WhoScored } from './components/GuessTheGoal.tsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transferxi" element={<TransferXI />} />
          <Route path="/fiveaside" element={<FiveASide />} />
          <Route path="/blindrank" element={<BlindRank />} />
          <Route path="/whoscored" element={<WhoScored />} />
        </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
