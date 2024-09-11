import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
