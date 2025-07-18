
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";


const MainLayout = () => {
    const [headerVisible, setHeaderVisible] = useState(true);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {headerVisible && <Header />}
            <main>
                <Outlet context={{ setHeaderVisible }} />
            </main>
        </div>
    );
};

export default MainLayout;
