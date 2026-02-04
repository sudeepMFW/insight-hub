

import { Header } from "./Header";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
            style={{
                backgroundImage: 'url("https://t3.ftcdn.net/jpg/18/44/94/34/240_F_1844943486_VaAfaMuIZq22GhhefgBpjHhUyZOINXna.jpg")'
            }}
        >
            <div className="absolute inset-0 bg-white/50 dark:bg-black/60 backdrop-blur-[2px]" />
            <div className="relative z-10">
                <div className="w-full">
                    <Header />
                    <main className="container mx-auto p-6 animate-fade-in">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
