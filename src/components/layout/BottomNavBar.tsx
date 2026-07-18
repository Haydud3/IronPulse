"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/history", label: "History", icon: History },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 border-t border-white/10 bg-background/80 backdrop-blur-lg md:hidden">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 text-xs transition-colors duration-200">
              <item.icon className={cn("h-7 w-7", isActive ? "text-primary" : "text-muted-foreground/80")} />
              <span className={cn("font-medium", isActive ? "text-primary" : "text-muted-foreground/80")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
