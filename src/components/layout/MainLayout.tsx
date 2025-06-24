
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import { useTheme } from '@/contexts/ThemeContext';

const MainLayout = () => {
    const [headerVisible, setHeaderVisible] = useState(true);
    const { currentTheme } = useTheme();

    return (
        <div className={`min-h-screen ${currentTheme.colors.background} ${currentTheme.colors.text}`}>
            {headerVisible && <Header />}
            <main>
                <Outlet context={{ setHeaderVisible }} />
            </main>
        </div>
    );
};

export default MainLayout;
