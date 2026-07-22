"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import LoginButton from "@/components/auth/LoginButton";
import Link from "next/link";
import { ArrowRight, BarChart2, Zap, Dumbbell, Flame } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import Social from "@/components/ui/Social";
import Photo from "@/components/ui/photo";
import Stats from "@/components/ui/Stats";

const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Success isn't always about greatness. It's about consistency.",
  "The body achieves what the mind believes.",
  "Push yourself, because no one else is going to do it for you.",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
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
      <section className="h-full">
        <div className="container mx-auto h-full">
          <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
            <div className="text-center xl:text-left order-2 xl:order-none">
              <span className="text-xl">Fitness App</span>
              <h1 className="text-5xl font-bold tracking-tight">
                Welcome to <span className="text-primary">IronPulse</span>
              </h1>
              <p className="max-w-[500px] my-6 text-muted-foreground">
                Track your workouts, see your progress, and get motivated.
              </p>
              <div className="flex flex-col xl:flex-row items-center gap-8">
                <LoginButton />
                <div className="mb-8 xl:mb-0">
                  <Social
                    containerStyles="flex gap-6"
                    iconStyles="w-9 h-9 border border-primary rounded-full flex justify-center items-center text-primary text-base hover:bg-primary hover:text-white hover:transition-all duration-500"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 xl:order-none mb-8 xl:mb-0">
              <Photo
                src="https://picsum.photos/498/498"
                alt="logo"
              />
            </div>
          </div>
        </div>
        <Stats />
      </section>
    );
  }

  return (
    <motion.div 
      className="p-4 sm:p-6 md:p-2 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold tracking-tight">
            {user.displayName?.split(" ")[0]}!
          </h1>
        </div>
        <Avatar>
          <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </motion.header>

      <motion.div variants={itemVariants}>
        <Link href="/workout" className="block group">
          <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-gray-900 to-black border border-white/10">
            <div className="p-6">
              <p className="font-semibold text-neon-green">Today's Workout</p>
              <h2 className="text-3xl font-bold mt-2 text-white">Full Body Strength</h2>
              <p className="mt-1 text-white/70">5 Exercises • 45 min • 350 kcal</p>
              <div className="flex items-center justify-end font-semibold text-lg mt-4 text-neon-green">
                Start Workout <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <GlassCard href="/history">
            <CardIcon icon={<BarChart2 className="text-bright-cyan"/>} />
            <h3 className="text-lg font-semibold mb-1">Workout History</h3>
            <p className="text-sm text-muted-foreground">View your progress</p>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard>
            <CardIcon icon={<Flame className="text-electric-crimson"/>} />
            <h3 className="text-lg font-semibold mb-1">5-day Streak</h3>
            <p className="text-sm text-muted-foreground">Keep the fire going!</p>
          </GlassCard>
        </motion.div>
      </div>

       <motion.div variants={itemVariants}>
          <GlassCard>
            <CardIcon icon={<Zap className="text-yellow-400"/>} />
            <h3 className="text-lg font-semibold mb-1">Daily Motivation</h3>
            <p className="text-sm italic text-muted-foreground">"{quote}"</p>
          </GlassCard>
        </motion.div>
    </motion.div>
  );
}

const GlassCard = ({ children, href, className }: { children: React.ReactNode, href?: string, className?: string }) => {
  const content = (
    <div className={cn(`
      p-4 rounded-2xl h-full transition-all duration-300 
      bg-zinc-900/50 border border-white/10
      hover:border-white/20 hover:bg-zinc-900
      shadow-lg
    `, className)}>
      {children}
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }
  return content;
};

const CardIcon = ({ icon, className }: { icon: React.ReactNode, className?: string }) => (
  <div className={cn(`
    p-2 mb-3 rounded-lg w-min
    bg-white/5
  `, className)}>
    {icon}
  </div>
);
