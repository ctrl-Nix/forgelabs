import { supabase } from './supabase'

// ─── FREEMIUM CONFIGURATION ───────────────────────────────────
// These constants define the freemium business model.
// Change these numbers to adjust the economics of ForgeOS.
export const FREEMIUM_CONFIG = {
  FREE_CREDITS: 3,         // Free runs on OUR credits (total, lifetime)
  DAILY_BYOK_LIMIT: 50,    // Daily limit for users with their own key
  DAILY_FREE_LIMIT: 3,     // Daily limit for free-tier users (redundant safety net)
}

export type CreditStatus = {
  canProceed: boolean
  freeCreditsUsed: number
  freeCreditsTotal: number
  hasOwnKey: boolean
  usingServerCredits: boolean
  errorMessage?: string
}

/**
 * Determines whether a user can make an API call.
 * 
 * Priority Order (the "Freemium Funnel"):
 * 1. User has their OWN key → Always allow (up to daily BYOK limit)
 * 2. User has free credits remaining → Use server key
 * 3. User has exhausted free credits → Block with upgrade prompt
 * 
 * This ensures:
 * - New users get 3 free "wow" moments on YOUR dime
 * - After that, they either bring their own key (free) or hit a wall
 * - Your API bill stays predictable and capped
 */
export async function checkCredits(
  userId: string | undefined,
  userProvidedKey: string | null
): Promise<CreditStatus> {
  const hasOwnKey = !!userProvidedKey && userProvidedKey.length > 10

  // ─── PATH 1: User brought their own key ───
  if (hasOwnKey) {
    // Still enforce a daily limit to prevent abuse of our infrastructure
    if (userId) {
      const { count } = await supabase
        .from('tool_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (count !== null && count >= FREEMIUM_CONFIG.DAILY_BYOK_LIMIT) {
        return {
          canProceed: false,
          freeCreditsUsed: 0,
          freeCreditsTotal: FREEMIUM_CONFIG.FREE_CREDITS,
          hasOwnKey: true,
          usingServerCredits: false,
          errorMessage: `Daily infrastructure limit reached (${FREEMIUM_CONFIG.DAILY_BYOK_LIMIT}/day). Try again tomorrow.`
        }
      }
    }

    return {
      canProceed: true,
      freeCreditsUsed: 0,
      freeCreditsTotal: FREEMIUM_CONFIG.FREE_CREDITS,
      hasOwnKey: true,
      usingServerCredits: false,
    }
  }

  // ─── PATH 2: No user key — check free credits ───
  if (!userId) {
    return {
      canProceed: false,
      freeCreditsUsed: 0,
      freeCreditsTotal: FREEMIUM_CONFIG.FREE_CREDITS,
      hasOwnKey: false,
      usingServerCredits: false,
      errorMessage: 'Please sign in to use ForgeOS.'
    }
  }

  // Count ALL-TIME usage where user did NOT provide their own key
  // We track this with a flag in the tool_usage data
  const { count: totalServerRuns } = await supabase
    .from('tool_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('key_source', 'server')

  const used = totalServerRuns ?? 0

  if (used >= FREEMIUM_CONFIG.FREE_CREDITS) {
    return {
      canProceed: false,
      freeCreditsUsed: used,
      freeCreditsTotal: FREEMIUM_CONFIG.FREE_CREDITS,
      hasOwnKey: false,
      usingServerCredits: false,
      errorMessage: `You've used all ${FREEMIUM_CONFIG.FREE_CREDITS} free intelligence runs. Add your own API key in Settings to continue for free.`
    }
  }

  // User has free credits remaining
  return {
    canProceed: true,
    freeCreditsUsed: used,
    freeCreditsTotal: FREEMIUM_CONFIG.FREE_CREDITS,
    hasOwnKey: false,
    usingServerCredits: true,
  }
}
