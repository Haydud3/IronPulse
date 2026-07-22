"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Dumbbell, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home, activeColor: "text-electric-crimson" },
  { href: "/workout", label: "Workout", icon: Dumbbell, activeColor: "text-neon-green" },
  { href: "/exercises", label: "Exercises", icon: Library, activeColor: "text-bright-yellow" },
  { href: "/history", label: "History", icon: History, activeColor: "text-bright-cyan" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 border-t border-white/10 bg-black/60 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 text-xs transition-colors duration-200">
              <item.icon className={cn("h-8 w-8", isActive ? item.activeColor : "text-muted-foreground/80")} />
              <span className={cn("font-medium", isActive ? item.activeColor : "text-muted-foreground/80")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
