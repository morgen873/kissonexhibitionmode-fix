
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";

const MainLayout = () => {
    const [headerVisible, setHeaderVisible] = useState(true);

    return (
        <div>
            {headerVisible && <Header />}
            <main>
                <Outlet context={{ setHeaderVisible }} />
            </main>
        </div>
    );
};

export default MainLayout;
