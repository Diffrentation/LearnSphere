// import { Routes, Route } from "react-router-dom";
// import Home from "./components/pages/student/Home";
import PageRoutes from "./PageRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
    <PageRoutes/>
    <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  );
}

export default App;
