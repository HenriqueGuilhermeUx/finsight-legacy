import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

const STORAGE_KEY = "finsight_analysis_count";
const REGISTERED_EMAIL_KEY = "finsight_registered_email";
const FREE_LIMIT = 3;

interface AnalysisLimitState {
  count: number;
  limit: number;
  remaining: number;
  isLimitReached: boolean;
  isUnlimited: boolean;
}

export function useAnalysisLimit() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<AnalysisLimitState>({
    count: 0,
    limit: FREE_LIMIT,
    remaining: FREE_LIMIT,
    isLimitReached: false,
    isUnlimited: false,
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Load count from localStorage on mount
  useEffect(() => {
    if (authLoading) return;

    // If user is logged in or has registered email, they have unlimited access
    const registeredEmail = localStorage.getItem(REGISTERED_EMAIL_KEY);
    if (user || registeredEmail) {
      setState({
        count: 0,
        limit: Infinity,
        remaining: Infinity,
        isLimitReached: false,
        isUnlimited: true,
      });
      return;
    }

    // For anonymous users, load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const count = stored ? parseInt(stored, 10) : 0;
    const remaining = Math.max(0, FREE_LIMIT - count);
    
    setState({
      count,
      limit: FREE_LIMIT,
      remaining,
      isLimitReached: count >= FREE_LIMIT,
      isUnlimited: false,
    });
  }, [user, authLoading]);

  // Increment analysis count
  const incrementCount = useCallback(() => {
    const registeredEmail = localStorage.getItem(REGISTERED_EMAIL_KEY);
    if (user || registeredEmail) return true; // Logged in or registered users always can analyze

    const stored = localStorage.getItem(STORAGE_KEY);
    const currentCount = stored ? parseInt(stored, 10) : 0;
    
    if (currentCount >= FREE_LIMIT) {
      setShowRegisterModal(true);
      return false;
    }

    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    
    const remaining = Math.max(0, FREE_LIMIT - newCount);
    const isLimitReached = newCount >= FREE_LIMIT;
    
    setState({
      count: newCount,
      limit: FREE_LIMIT,
      remaining,
      isLimitReached,
      isUnlimited: false,
    });

    // Show modal after reaching limit
    if (isLimitReached) {
      setShowRegisterModal(true);
    }

    return true;
  }, [user]);

  // Check if can analyze without incrementing
  const canAnalyze = useCallback(() => {
    const registeredEmail = localStorage.getItem(REGISTERED_EMAIL_KEY);
    if (user || registeredEmail) return true;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const currentCount = stored ? parseInt(stored, 10) : 0;
    
    if (currentCount >= FREE_LIMIT) {
      setShowRegisterModal(true);
      return false;
    }
    
    return true;
  }, [user]);

  // Reset count (for testing or admin purposes)
  const resetCount = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      count: 0,
      limit: FREE_LIMIT,
      remaining: FREE_LIMIT,
      isLimitReached: false,
      isUnlimited: !!user,
    });
  }, [user]);

  return {
    ...state,
    incrementCount,
    canAnalyze,
    resetCount,
    showRegisterModal,
    setShowRegisterModal,
  };
}
