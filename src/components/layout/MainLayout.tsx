
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => (
    <div>
        <Header />
        <main>
            <Outlet />
        </main>
    </div>
);

export default MainLayout;
