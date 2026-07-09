import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar";
import Footer from "../footer";


const ViewMoreLayout = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ViewMoreLayout;
