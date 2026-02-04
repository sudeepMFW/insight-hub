
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black">
            <Sidebar />
            <div className="pl-64">
                <Header />
                <main className="container mx-auto p-6 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
