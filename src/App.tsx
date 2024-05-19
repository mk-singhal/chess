import "./App.css";
import Referee from "./components/Refree/Refree";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div id="app">
      <Sidebar />
      <div className="main">
        <Referee />
      </div>
    </div>
  );
}

export default App;
