import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar";
import Footer from "../footer";


const ViewMoreLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ViewMoreLayout;
