import { Outlet } from "react-router-dom";
import Navbar from "../student/Navbar";

function Educator() {
  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
}

export default Educator;
