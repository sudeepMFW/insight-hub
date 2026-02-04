
import { Home, BarChart2, Video, Settings, LogOut } from "lucide-react";

export function Sidebar() {
    const menuItems = [
        { icon: Home, label: "Home", href: "#" },
        { icon: BarChart2, label: "Analytics", href: "#" },
        { icon: Video, label: "Studio", href: "#" },
        { icon: Settings, label: "Settings", href: "#" },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/20 bg-white/80 backdrop-blur-xl transition-transform dark:bg-black/80">
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center gap-2">
                    <img src="https://mediafirewall.ai/images/logo.png" alt="Logo" className="h-8 w-8" />
                    <span className="text-lg font-bold text-primary">MediaFirewall</span>
                </div>
            </div>

            <div className="px-3 py-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-primary/20"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="absolute bottom-4 left-0 w-full px-3">
                <button className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-200 dark:hover:bg-red-900/20">
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
