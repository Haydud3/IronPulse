"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import LoginButton from "@/components/auth/LoginButton";
import Link from "next/link";
import { ArrowRight, BarChart2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Success isn't always about greatness. It's about consistency.",
  "The body achieves what the mind believes.",
  "Push yourself, because no one else is going to do it for you.",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Home() {
  const { user } = useAuth();
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            IronPulse
          </h1>
          <p className="text-lg text-muted-foreground mb-8">Your personal fitness companion.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LoginButton />
        </motion.div>
      </main>
    );
  }

  return (
    <motion.div 
      className="p-4 sm:p-6 md:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome back, {user.displayName?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">Ready to crush your goals today?</p>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Link href="/workout" className="block group">
          <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div 
              className="absolute inset-0 bg-black/20"
              style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            ></div>
            <div className="relative flex flex-col justify-between p-6 h-60 md:h-72 text-white">
              <div>
                <p className="font-semibold text-lg">Today's Workout</p>
                <h2 className="text-4xl md:text-5xl font-bold mt-2 text-shadow">Chest & Triceps</h2>
                <p className="mt-2 text-white/80">5 Exercises</p>
              </div>
              <div className="flex items-center justify-end font-semibold text-lg">
                Start Workout <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <GlassCard href="/history">
            <CardIcon icon={<BarChart2 />} />
            <h3 className="text-xl font-semibold mb-2">Workout History</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Last:</span> Yesterday</p>
              <p><span className="font-medium text-foreground">Streak:</span> 5 days 🔥</p>
              <p><span className="font-medium text-foreground">Trend:</span> ↗️ Up</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard>
            <CardIcon icon={<Zap />} className="bg-yellow-500/10 text-yellow-400"/>
            <h3 className="text-xl font-semibold mb-2">Daily Motivation</h3>
            <p className="text-sm italic text-muted-foreground">"{quote}"</p>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

const GlassCard = ({ children, href, className }: { children: React.ReactNode, href?: string, className?: string }) => {
  const content = (
    <div className={`
      p-6 rounded-2xl h-full transition-all duration-300 
      bg-white/5 border border-white/10
      hover:border-white/20 hover:bg-white/10
      shadow-lg
      ${className}
    `}>
      {children}
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }
  return content;
};

const CardIcon = ({ icon, className }: { icon: React.ReactNode, className?: string }) => (
  <div className={`
    p-2 mb-4 rounded-lg w-min
    bg-primary/10 text-primary
    ${className}
  `}>
    {icon}
  </div>
);
