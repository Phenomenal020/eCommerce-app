import { BrowserRouter as Router } from "react-router-dom"
import Header from "./components/headers/Header";
import { DataProvider } from "./GlobalState";
import MainPage from "./pages/MainPage";

function App() {
  return (
    // <DataProvider>
      // <Router>
        <div className="App">
          <Header />
          <MainPage />
        </div>
      // </Router>
    // </DataProvider>

  );
}

export default App;