
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => (
    <div>
        <Header />
        <main className="pt-24">
            <Outlet />
        </main>
    </div>
);

export default MainLayout;
