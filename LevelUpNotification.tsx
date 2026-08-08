import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LevelUpNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  levelName: string;
  levelColor: string;
  xpGained?: number;
  perks?: string[];
}

const levelIcons: Record<number, React.ReactNode> = {
  1: <Star className="h-12 w-12" />,
  2: <Sparkles className="h-12 w-12" />,
  3: <Zap className="h-12 w-12" />,
  4: <Trophy className="h-12 w-12" />,
  5: <Trophy className="h-12 w-12" />,
  6: <Trophy className="h-12 w-12" />,
  7: <Trophy className="h-12 w-12" />,
};

const levelColors: Record<string, string> = {
  gray: "from-gray-400 to-gray-600",
  green: "from-green-400 to-green-600",
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600",
  orange: "from-orange-400 to-orange-600",
  red: "from-red-400 to-red-600",
  gold: "from-yellow-400 to-amber-600",
};

// Confetti particle component
function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full"
      style={{ backgroundColor: color, left: `${x}%` }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: 400,
        opacity: 0,
        rotate: 720,
        x: (Math.random() - 0.5) * 200,
      }}
      transition={{
        duration: 2 + Math.random(),
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
}

export default function LevelUpNotification({
  isOpen,
  onClose,
  newLevel,
  levelName,
  levelColor,
  xpGained,
  perks = [],
}: LevelUpNotificationProps) {
  const [confetti, setConfetti] = useState<{ id: number; delay: number; x: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        x: Math.random() * 100,
      }));
      setConfetti(particles);

      // Play celebration sound (optional - browser may block autoplay)
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQUZf8LvuIVGCCOG0/K9hT8EHYrV8buFPgQei9byvYU+BB6L1vK9hT4EHovW8r2FPgQei9byvYU+BB6L1vK9hT4EHovW8r2FPgQei9byvYU+BB2K1fG8hD0DHYrV8byEPQMditXxvIQ9Ax2K1fG8hD0DHYrV8byEPQMditXxvIQ9Ax2K1fG8hD0DHYrV8byEPQMditXxvIQ9Ax2K1fG8hD0D");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {
        // Ignore audio errors
      }
    }
  }, [isOpen]);

  const gradientClass = levelColors[levelColor] || levelColors.gray;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((particle) => (
              <ConfettiParticle key={particle.id} delay={particle.delay} x={particle.x} />
            ))}
          </div>

          {/* Main notification card */}
          <motion.div
            className="relative bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 text-center overflow-hidden"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 blur-3xl`} />

            {/* Content */}
            <div className="relative z-10">
              {/* Level up text */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Parabéns!
                </span>
                <h2 className="text-3xl font-bold mt-1 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Level Up!
                </h2>
              </motion.div>

              {/* Level icon */}
              <motion.div
                className={`mx-auto my-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 10 }}
              >
                {levelIcons[newLevel] || <Trophy className="h-12 w-12" />}
              </motion.div>

              {/* Level info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-6xl font-bold text-foreground mb-2">
                  {newLevel}
                </div>
                <div className={`text-xl font-semibold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
                  {levelName}
                </div>
              </motion.div>

              {/* XP gained */}
              {xpGained && (
                <motion.div
                  className="mt-4 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-green-500 font-semibold">+{xpGained} XP</span> ganhos
                </motion.div>
              )}

              {/* Perks unlocked */}
              {perks.length > 0 && (
                <motion.div
                  className="mt-6 p-4 bg-muted/50 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    🎁 Novos benefícios desbloqueados:
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {perks.map((perk, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-yellow-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6"
              >
                <Button
                  onClick={onClose}
                  className={`bg-gradient-to-r ${gradientClass} text-white hover:opacity-90`}
                >
                  Continuar
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manage level up notifications
export function useLevelUpNotification() {
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    newLevel: number;
    levelName: string;
    levelColor: string;
    xpGained?: number;
    perks?: string[];
  }>({
    isOpen: false,
    newLevel: 1,
    levelName: "Iniciante",
    levelColor: "gray",
  });

  const showLevelUp = (data: {
    newLevel: number;
    levelName: string;
    levelColor: string;
    xpGained?: number;
    perks?: string[];
  }) => {
    setNotification({ ...data, isOpen: true });
  };

  const hideLevelUp = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    notification,
    showLevelUp,
    hideLevelUp,
  };
}
