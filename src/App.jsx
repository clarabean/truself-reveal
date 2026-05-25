import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TrendingUp, Trophy, Sparkle, Wallet, Zap, HelpCircle, Users, Heart,
  Sparkles, Flame, Coins, Bookmark, Calendar, ArrowRight,
  BookOpen, Lock, Download, Clipboard, Trash2, X, RefreshCw
} from 'lucide-react';

// --- BULLETPROOF SAFE LOCAL STORAGE UTILITY LAYER FOR SAFARI COMPATIBILITY ---
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage item fetch blocked by WebKit sandbox policies:", e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage item save blocked by WebKit sandbox policies:", e);
    }
  }
};

// --- GLOBAL UTILITY STREAK HELPER FUNCTIONS ---
const getLocalDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

const computeStreak = (history) => {
  if (!Array.isArray(history)) return 0;
  
  const todayStr = getLocalDateString(0);
  const yesterdayStr = getLocalDateString(1);
  
  if (!history.includes(todayStr) && !history.includes(yesterdayStr)) {
    return 0; 
  }
  
  let streak = 0;
  let offset = history.includes(todayStr) ? 0 : 1;
  
  while (true) {
    const dStr = getLocalDateString(offset);
    if (history.includes(dStr)) {
      streak++;
      offset++;
    } else {
      break;
    }
  }
  return streak;
};

// --- DYNAMIC INTUITION FOCUS PHRASE MATRIX ---
const FOCUS_PHRASES = {
  "Creation/Choice": [
    "Vision & Bold Drafts",
    "Intuitive Alignment",
    "Unconventional Initiative",
    "Authentic Choice"
  ],
  "Advancement": [
    "High-Impact Velocity",
    "Momentum Over Friction",
    "Strategic Spacing",
    "Decisiveness Today"
  ],
  "Achievement": [
    "Personal Excellence",
    "Beyond Past Wins",
    "Legacy Priorities",
    "Calm Mastery"
  ],
  "Resource Gaining": [
    "Asset Leverage Focus",
    "Flowing Abundance",
    "Calm Capital Power",
    "Focal Spacing Allocation"
  ],
  "Vitality": [
    "Metabolic Stamina",
    "Protective Recovery",
    "Peak Physiological Baseline",
    "Sensory Regeneration"
  ],
  "Dreams/Passions": [
    "Authentic Spark Flow",
    "Expansive Horizons",
    "Passion Over Performance",
    "Quiet Playground Focus"
  ],
  "People": [
    "Respectful Boundaries",
    "Loyal Authority",
    "Growth Alliances",
    "Clear Agreements"
  ],
  "Connection": [
    "Raw Unfiltered Presence",
    "Deep Soul Communion",
    "Compelling Vulnerability",
    "Uncompromised Truth"
  ]
};

// --- THE HARMONIC 56 INTERNAL MARKS DATASET (TruSelf Executive Coaching Edition) ---
const DOMAINS = {
  CREATION_CHOICE: { 
    title: "Creation/Choice", color: "#6366F1", glow: "shadow-indigo-500/10", badge: "🔮 ALIGNMENT INSIGHT", icon: <Sparkle className="w-4 h-4" />, 
    questions: [
      {
        id: "cc_1",
        rarity: "Rare",
        insight: "You possess an exceptional, latent capacity to see patterns and pathways where others only see blank walls. Your vision is highly potent, yet you are currently waiting for external confirmation of what your intuition has already validated.",
        inquest: "What is one creative direction you have kept quiet that deserves to be given absolute voice and action today?",
        courage: "Write a 3-sentence summary of your most unconventional idea, and text or email it to a peer, client, or alignment partner right now."
      },
      {
        id: "cc_2",
        rarity: "Common",
        insight: "Your highly analytical mind is one of your greatest assets. Currently, you might be seeking absolute clarity through research and planning, which is natural, yet the highest learning now lies in real-world application.",
        inquest: "What is one concept you can simplify and release today to experience the power of immediate momentum?",
        courage: "Close your research tabs. Draft the absolute simplest MVP version of this concept on a single piece of paper, and share it before your day ends."
      },
      {
        id: "cc_3",
        rarity: "Common",
        insight: "You carry a rare, magnetic depth. People feel safer, calmer, and more inspired simply entering your orbit when you show up authentically. You don't need to perform; your raw presence is the contribution.",
        inquest: "Where in your world today can you allow your natural, effortless energy to lead the room?",
        courage: "In your next conversation or meeting, do not prepare what to say. Sit back, listen entirely, and let your raw presence command the space."
      },
      {
        id: "cc_4",
        rarity: "Common",
        insight: "You carry a quiet readiness to lead. Sometimes, we wait for an external permission slip or perfect consensus before stepping forward, forgetting that your initiative is what others are waiting for.",
        inquest: "What is a decision you can make today that honors your personal authority rather than waiting for consensus?",
        courage: "Identify the one action step you've been delaying because you're waiting for consensus, and execute it now without asking for permission."
      },
      {
        id: "cc_5",
        rarity: "Common",
        insight: "Your inner voice is remarkably sharp right now, humming with pure creative potential. The only block is the static of other people's opinions that you've allowed to crowd your quiet center.",
        inquest: "If you carved out thirty minutes of absolute silence today, what is the first truth your spirit would whisper?",
        courage: "Put all devices on 'Do Not Disturb' for 30 minutes, go for a walk outside, and write down the very first insight that enters your quiet mind."
      },
      {
        id: "cc_6",
        rarity: "Rare",
        insight: "You have a natural appreciation for order and elegance. However, occasionally we default to safe, comfortable colors when our true vision is demanding a bolder, more experimental canvas.",
        inquest: "Where can you invite a little more bold, creative experimentation into your work or lifestyle today?",
        courage: "Intentionally break this minor self-imposed rule today. Write a draft with typos, dress boldly, or pitch an incomplete concept just to break the spell."
      },
      {
        id: "cc_7",
        rarity: "Legendary",
        insight: "You have completely outgrown the small container of your current lifestyle. Your restlessness isn't a crisis of failure; it is your immense capacity screaming for a larger, stadium-scale challenge.",
        inquest: "If you stopped playing small to make others comfortable, what is the most authentic, massive choice you would make before this day ends?",
        courage: "Draw a hard line under one major compromise you have been tolerating. Explicitly say 'No' to a request or standard that does not match your true caliber."
      }
    ] 
  },
  ADVANCEMENT: { 
    title: "Advancement", color: "#3B82F6", glow: "shadow-blue-500/10", badge: "⚠️ ALIGNMENT INSIGHT", icon: <TrendingUp className="w-4 h-4" />, 
    questions: [
      {
        id: "adv_1",
        rarity: "Common",
        insight: "Your work ethic is remarkable, and you are capable of high velocity. Currently, you may be directing your vast energy into multiple small tasks, which can feel draining without yielding the big breakthroughs you deserve.",
        inquest: "Which high-impact priority, if given your full focus, would make the small tasks redundant or easier?",
        courage: "Block out the first 90 minutes of your morning tomorrow. Shut down all communication channels, and spend that time exclusively on the high-stakes task."
      },
      {
        id: "adv_2",
        rarity: "Common",
        insight: "You are a naturally gifted builder with an incredible capacity for deep execution. When you dial into your focus state, you are an absolute force of nature. The only thing missing is a target worthy of your power.",
        inquest: "What is one high-impact plan you can design today that matches the true scale of your execution power?",
        courage: "Define your single most critical milestone for this quarter, write it in big letters on a note, and stick it directly behind your screen."
      },
      {
        id: "adv_3",
        rarity: "Common",
        insight: "Your standard of excellence is admirable. Remember that standards are meant to guide your creation, not act as a barrier to completing your valuable drafts.",
        inquest: "What project is ready to be shared with the world in its current state to unlock the next level of feedback?",
        courage: "Publish, share, or submit your current 70%-complete draft. Force yourself to get real-world feedback on raw, messy progress."
      },
      {
        id: "adv_4",
        rarity: "Rare",
        insight: "You have built a profound foundation of resilience. Every past trial has forged a highly adaptive, powerful mind capable of navigating any storm with total resourcefulness.",
        inquest: "If you trusted your capacity to handle any outcome, what courageous leap would you execute right now?",
        courage: "Make an irreversible public or financial commitment to your leap—buy the ticket, sign the contract, or announce your launch date today."
      },
      {
        id: "adv_5",
        rarity: "Rare",
        insight: "Your momentum is built on your daily rhythms. Currently, a small environmental or routine adjustment could release a massive amount of cognitive space.",
        inquest: "What is one simple habit adjustment you can make today to protect your peak focus?",
        courage: "Eliminate the choice of backsliding tonight. Install a hard app-blocker, set an automated bedtime, or clear your space of your primary vice immediately."
      },
      {
        id: "adv_6",
        rarity: "Common",
        insight: "Your future self is looking back at you with immense pride and gratitude. You are quietly and patiently laying down the hard, unglamorous bricks of a magnificent empire.",
        inquest: "What is one silent, hidden victory from this past week that you haven't fully celebrated yet?",
        courage: "Book a restorative, non-work-related experience for yourself this weekend to intentionally reward your hard work and recharge your vessel."
      },
      {
        id: "adv_7",
        rarity: "Legendary",
        insight: "The friction you are feeling is a positive indicator—it is your evolving capacity signaling that you are ready to transition to a more strategic, higher-leverage style of execution.",
        inquest: "What is one compromise you can phase out today to make room for your next level of mastery?",
        courage: "Explicitly refuse one offer, client, or routine task that is 'good enough' to create empty, strategic space for the legendary opportunities."
      }
    ] 
  },
  ACHIEVEMENT: { 
    title: "Achievement", color: "#D97706", glow: "shadow-amber-500/10", badge: "🏆 VICTORY ALIGNMENT", icon: <Trophy className="w-4 h-4" />, 
    questions: [
      { 
        id: "ach_1", 
        rarity: "Common", 
        insight: "You have a natural drive for achievement. Ensure that the goals you are striving for are authentic to your true mission, rather than default targets inherited from external systems.", 
        inquest: "What does genuine fulfillment look like for you in this current season of life?",
        courage: "Write down your personal, raw definition of success on a card. Prune three goals from your current list that belong to other people's expectations."
      },
      { 
        id: "ach_2", 
        rarity: "Common", 
        insight: "You have built an honorable track record. The invitation now is to step beyond the safety of past victories and embrace the creative stretch of your next growth plateau.", 
        inquest: "What is one new domain or skill where you are excited to embrace the learning curve of a beginner today?",
        courage: "Identify one skill or environment where you are currently a complete beginner, and spend 45 minutes practicing or researching it today."
      },
      { 
        id: "ach_3", 
        rarity: "Common", 
        insight: "You are designed for grand, legacy-scale impact. Take a moment to step back from daily micro-metrics to ensure you are allocating energy to your most expansive long-term vision.", 
        inquest: "If you focused exclusively on your highest-leverage work today, what would change?",
        courage: "Decline one low-leverage opportunity or small client today to intentionally force open creative space for a high-value pursuit."
      },
      { 
        id: "ach_4", 
        rarity: "Rare", 
        insight: "A past setback has made you play smaller than your stature. You have mistakenly internalized a temporary stumble as a permanent limit.", 
        inquest: "What was a recent 'loss' that actually taught you the exact strategic lesson you need to win now?",
        courage: "Write a detailed post-mortem of that failure. Extract 3 core golden rules, and implement one of them in your current main project today."
      },
      { 
        id: "ach_5", 
        rarity: "Rare", 
        insight: "Your focal power is immense. Protect it by staying aligned with your unique path, rather than letting peripheral noise or comparison divert your attention.", 
        inquest: "What is one simple boundary you can set today to protect your unique creative focus?",
        courage: "Unfollow, mute, or disconnect from 3 competitive accounts that trigger subtle insecurities or comparison metrics on your device today."
      },
      { 
        id: "ach_6", 
        rarity: "Common", 
        insight: "Your natural authority is preparing you for a major position of leadership. The people in your ecosystem are quietly waiting for you to step into that command.", 
        inquest: "What grand legacy is your daily work actually building for the next generation?",
        courage: "Spend the next hour creating a modular system, asset, or framework that can outlast your daily manual presence."
      },
      { 
        id: "ach_7", 
        rarity: "Legendary", 
        insight: "You have a powerful vision. Sometimes we set distant timelines out of caution, but your current capacity is fully ready to accelerate this process.", 
        inquest: "If you brought your 1-year milestone forward to the next 30 days, what bold first step would you take today?",
        courage: "Set your target launch or delivery date to exactly 30 days from now, and announce it publicly to your team or network."
      }
    ] 
  },
  RESOURCE_GAINING: { 
    title: "Resource Gaining", color: "#10B981", glow: "shadow-emerald-500/10", badge: "💰 ALIGNMENT INSIGHT", icon: <Wallet className="w-4 h-4" />, 
    questions: [
      { 
        id: "res_1", 
        rarity: "Common", 
        insight: "You have a natural gift for spotting opportunities and pulling in resources. Currently, the best leverage is to focus on energy-generating assets rather than over-analyzing minor operational leaks.", 
        inquest: "Where is the absolute highest return on investment for your time and energy today?",
        courage: "Audit your bank statements. Cancel 3 recurring subscriptions or fees that you have not actively utilized in the last 30 days."
      },
      { 
        id: "res_2", 
        rarity: "Common", 
        insight: "True alignment comes from establishing clear, calm financial systems that empower you to take calculated risks with complete peace of mind.", 
        inquest: "How stable is your current financial foundation, rated honestly on a scale of 1-10?",
        courage: "Transfer a specific, small sum of capital into a high-yield savings or investment account today as a physical seed of abundance."
      },
      { 
        id: "res_3", 
        rarity: "Common", 
        insight: "You enjoy optimizing your systems and environments. It is worth checking if your current tools are truly accelerating your workflow or quietly fragmenting your attention.", 
        inquest: "Which simple, distraction-free workflow element can you rely on today to build deep focus?",
        courage: "Uninstall all non-essential productivity apps from your main device, and work out of a single physical notebook for the rest of the day."
      },
      { 
        id: "res_4", 
        rarity: "Rare", 
        insight: "You are neglecting to purchase or invest in the exact foundational assets that would instantly unlock your next phase of velocity and speed.", 
        inquest: "What is one material or environmental investment that would immediately double your productivity?",
        courage: "Purchase, upgrade, or authorize the procurement of that exact tool or environment enhancer right now without hesitation."
      },
      { 
        id: "res_5", 
        rarity: "Rare", 
        insight: "Your mind holds wealth-generating wisdom, but you are hoarding your ideas instead of letting them circulate, creating a stagnant pool of potential.", 
        inquest: "What is your relationship with 'abundance' vs 'scarcity' right now?",
        courage: "Package one of your highest-value proprietary frameworks, templates, or resources, and share it with your network for free today."
      },
      { 
        id: "res_6", 
        rarity: "Common", 
        insight: "You are waiting for the perfect pile of resources to arrive before you take your big leap, ignoring the universal law that resources follow movement.", 
        inquest: "What high-income skill would be the most valuable asset for your future self to possess?",
        courage: "Book a masterclass, acquire a specialized textbook, or schedule a training session for that skill today."
      },
      { 
        id: "res_7", 
        rarity: "Legendary", 
        insight: "You are spending capital on temporary comforts while starving the singular, highest-yielding asset that generates everything: your own consciousness.", 
        inquest: "What is the absolute best, highest-leverage investment you can make in yourself this week?",
        courage: "Dedicate an explicit budget of capital (or 10 hours of focused time) to a personal development program or mastermind workspace."
      }
    ] 
  },
  VITALITY: { 
    title: "Vitality", color: "#EF4444", glow: "shadow-red-500/10", badge: "⚡ ALIGNMENT INSIGHT", icon: <Zap className="w-4 h-4" />, 
    questions: [
      { 
        id: "vit_1", 
        rarity: "Common", 
        insight: "You have an incredible engine of vitality. To operate at your absolute ceiling, design clear physical check-ins that protect your stamina before you enter highly demanding build periods.", 
        inquest: "What is the primary physical signal your body is using to request rest or recovery today?",
        courage: "Book a physical assessment, clean massage, or comprehensive health check today to address this bottleneck immediately."
      },
      { 
        id: "vit_2", 
        rarity: "Common", 
        insight: "Your daily energy is a precious currency. Establish a protective filter to ensure you are entering environments that feed your momentum rather than absorbing ambient friction.", 
        inquest: "What is the single highest-yield daily ritual that protects your baseline peace?",
        courage: "Put a hard 'Do Not Disturb' lock on your communication channels starting at 7:00 PM tonight. Protect your recovery."
      },
      { 
        id: "vit_3", 
        rarity: "Common", 
        insight: "You carry a rare, magnetic glow when you are operating in peak alignment. Lately, you have settled for a diluted, safe version of your physical health.", 
        inquest: "When was the last time you felt truly, vibrantly, and unapologetically alive in your own skin?",
        courage: "Put on your training gear and engage in 30 minutes of high-intensity functional movement or running right now to reset your biological baseline."
      },
      { 
        id: "vit_4", 
        rarity: "Rare", 
        insight: "Your physical processing space is cluttered. Your external environment is a direct, living mirror of your current internal static.", 
        inquest: "How is your immediate physical workspace currently affecting your mental clarity?",
        courage: "Spend 20 minutes cleaning and clearing your desk right now until only your computer, note pad, and a glass of water remain."
      },
      { 
        id: "vit_5", 
        rarity: "Rare", 
        insight: "You are relying on chemical stimulants instead of designing a high-vibrancy lifestyle that naturally generates power.", 
        inquest: "What is one daily ritual that consistently restores your physical and psychological power?",
        courage: "Commit to going tomorrow without caffeine, processed sugar, or artificial stimulants—relying solely on deep rest and hydration."
      },
      { 
        id: "vit_6", 
        rarity: "Common", 
        insight: "You are running your physical engine in the red zone, pretending that burnout is a badge of honor to prove your worth to the world.", 
        inquest: "If your health was a professional project, would it currently be rated 'on track' or 'failing'?",
        courage: "Block out an entire afternoon this weekend to do absolutely nothing productive—guilt-free and screen-free."
      },
      { 
        id: "vit_7", 
        rarity: "Legendary", 
        insight: "You are carrying old energetic and emotional toxic loops that cloud your spiritual signal, heavily stalling your execution speed.", 
        inquest: "What is the one thing you can stop doing today to instantly double your vital power?",
        courage: "Purge one highly addictive app, chemical habit, or toxic content channel from your phone and immediate environment right now."
      }
    ] 
  },
  DREAMS_PASSIONS: { 
    title: "Dreams/Passions", color: "#F59E0B", glow: "shadow-yellow-500/10", badge: "🔥 ALIGNMENT INSIGHT", icon: <HelpCircle className="w-4 h-4" />, 
    questions: [
      { 
        id: "dr_1", 
        rarity: "Common", 
        insight: "You have a grand inner spark. Ensure you are giving your most authentic visions a safe, protected container to mature, rather than exposing them to early, ungrounded feedback.", 
        inquest: "What exciting dream did you set aside simply because the first steps felt uncertain?",
        courage: "Secure the domain, register the draft, or design the raw concept document for this dream before you go to sleep tonight."
      },
      { 
        id: "dr_2", 
        rarity: "Common", 
        insight: "You are spending all your days on duty, ignoring the exact creative activities that naturally bend time around your focus.", 
        inquest: "What activity makes you lose track of time entirely when you engage with it?",
        courage: "Schedule a non-negotiable block of 2 hours on your calendar this week dedicated solely to this flow activity."
      },
      { 
        id: "dr_3", 
        rarity: "Common", 
        insight: "You are waiting for a mentor or a savior to show you your purpose, forgetting that purpose is actively forged, not passively found.", 
        inquest: "What is one grand contribution you want to be remembered for when your time is up?",
        courage: "Draft your grand, lifelong mission statement in 2 bold sentences, print it, and place it directly on your workspace wall."
      },
      { 
        id: "dr_4", 
        rarity: "Rare", 
        insight: "You have let survival needs completely overwrite your creative playground, leaving you dry, intellectual, and uninspired.", 
        inquest: "If money were completely out of the equation, how would you spend your Tuesday morning?",
        courage: "Commit to spending the first 60 minutes of your upcoming Tuesday morning executing exactly that activity."
      },
      { 
        id: "dr_5", 
        rarity: "Rare", 
        insight: "You are suppressing your excitement to match the lukewarm temperature of the safe rooms you currently occupy.", 
        inquest: "What currently makes your heart race with pure, unadulterated excitement?",
        courage: "Reach out to one high-energy teammate or partner, and pitch a joint initiative based around this exact excitement."
      },
      { 
        id: "dr_6", 
        rarity: "Common", 
        insight: "You have a vivid imagination and strong aspirations. Sometimes, looking at other people's achievements can trigger a healthy reminder of what we are capable of building ourselves.", 
        inquest: "What is one inspiration you've witnessed recently that you want to start building in your own unique way?",
        courage: "Send a brief message of genuine appreciation to that exact person, telling them their journey inspires you, and request a quick 10-minute coffee call."
      },
      { 
        id: "dr_7", 
        rarity: "Legendary", 
        insight: "You are choosing safety because you are terrified of the sheer, massive magnitude of your wild, authentic ambitions.", 
        inquest: "What is the most daring, high-stakes choice you have ever thought about making?",
        courage: "Take one irreversible, physical step toward that choice today—tell a mentor, draft the resignation, or book the flight."
      }
    ] 
  },
  PEOPLE: { 
    title: "People", color: "#EC4899", glow: "shadow-pink-500/10", badge: "👥 ALIGNMENT INSIGHT", icon: <Users className="w-4 h-4" />, 
    questions: [
      { 
        id: "pe_1", 
        rarity: "Common", 
        insight: "Your loyalty to others is a deep and beautiful quality. As you grow, it is natural to seek out relationships that not only celebrate where you have been, but actively call you forward into your next horizon.", 
        inquest: "Who in your network consistently expands your vision, and how can you connect with them this week?",
        courage: "Intentionally mute, distance yourself from, or decline invitations from one long-term acquaintance who drains your focus baseline."
      },
      { 
        id: "pe_2", 
        rarity: "Common", 
        insight: "Your kindness is a powerful gift, but it requires clear, respectful boundaries. True alignment is built on transparent agreements rather than silent accommodations.", 
        inquest: "What is a gentle but firm boundary you need to communicate to a collaborator today?",
        courage: "Send an incredibly polite, clear, and un-apologetic message establishing this boundary, without explaining or softening the impact."
      },
      { 
        id: "pe_3", 
        rarity: "Common", 
        insight: "You are carrying old resentments like hot coals, expecting the other person to burn while you damage your own progress and focus.", 
        inquest: "Who are you holding a grudge against, and what is that grudge costing your focus?",
        courage: "Write a raw, unfiltered letter of forgiveness to this person. Burn or delete it. This is for your release, not their approval."
      },
      { 
        id: "pe_4", 
        rarity: "Rare", 
        insight: "You are isolated, trying to carry a kingdom-scale vision entirely on your own fragile shoulders to avoid relying on others.", 
        inquest: "Who in your immediate network is currently challenging you to grow to your absolute limit?",
        courage: "Reach out to this exact person and ask: 'What is my greatest operational blindspot that I am currently avoiding?'"
      },
      { 
        id: "pe_5", 
        rarity: "Rare", 
        insight: "You are hiding your thoughts from the people who care about you, creating an island of isolation under the guise of strength.", 
        inquest: "What is one thing you have been meaning to say to someone close to you but haven't?",
        courage: "Call or schedule a meet with them today. Speak your absolute raw truth with love, without wrapping it in diplomacy."
      },
      { 
        id: "pe_6", 
        rarity: "Common", 
        insight: "You are hoarding your magic, refusing to be the generous leader your community desperately needs.", 
        inquest: "Who is the most generous person you know? How can you emulate them today?",
        courage: "Spend 25 minutes writing a detailed, unsolicited recommendation or public reference of appreciation for a peer or teammate."
      },
      { 
        id: "pe_7", 
        rarity: "Legendary", 
        insight: "True leadership involves the courage to look at ourselves clearly. Inviting honest perspective from those we trust is a powerful way to accelerate our growth.", 
        inquest: "What is an area of your leadership or workflow where you would value constructive, growth-oriented feedback?",
        courage: "Text your closest friend this exact question right now, with the absolute promise that you will only listen and say 'Thank you.'"
      }
    ] 
  },
  CONNECTION: { 
    title: "Connection", color: "#14B8A6", glow: "shadow-teal-500/10", badge: "❤️ RAW TRUTH", icon: <Heart className="w-4 h-4" />, 
    questions: [
      { 
        id: "co_1", 
        rarity: "Common", 
        insight: "You have a rare, beautiful soul depth. However, you are confusing your public broadcast armor with authentic presence. People see your shield, not you.", 
        inquest: "How can you develop deeper, unfiltered presence in your interactions today?",
        courage: "Go through your next 3 major conversations without checking your phone, interrupting, or planning your reply."
      },
      { 
        id: "co_2", 
        rarity: "Common", 
        insight: "You are surrounded by noise, but completely starved of genuine, quiet, soul-level communion.", 
        inquest: "Who do you need to have a deep, completely honest conversation with right now?",
        courage: "Call them right now and say: 'I was thinking about you, let's skip the small talk—how are you actually doing?'"
      },
      { 
        id: "co_3", 
        rarity: "Common", 
        insight: "You are presenting a carefully edited version of yourself, verified that your raw, unfiltered truth is highly compelling and worthy of deep respect.", 
        inquest: "When do you feel most seen and understood by the world?",
        courage: "Share an unedited, raw realization or current struggle with your community or network—let them see your messy draft progress."
      },
      { 
        id: "co_4", 
        rarity: "Rare", 
        insight: "You are actively blocking intimacy, using business, humor, or hyper-independence as a defense mechanism to stay safe.", 
        inquest: "How do you currently block intimacy or deep connection when people get close?",
        courage: "Admit one vulnerability, weakness, or struggle to someone close to you today, and explicitly ask for their support."
      },
      { 
        id: "co_5", 
        rarity: "Rare", 
        insight: "You are lonely in crowded rooms because you refuse to lower your drawbridge and let anyone in.", 
        inquest: "Where in your life are you lonely, even when people are around?",
        courage: "Secure a seat at a curated physical mastermind, meetup, or physical workspace today where professional posturing is banned."
      },
      { 
        id: "co_6", 
        rarity: "Common", 
        insight: "You are waiting for others to be vulnerable first, trapped in an emotional standoff of safety.", 
        inquest: "What would happen if you were 10% more vulnerable today?",
        courage: "Share an honest fear or mistake you made in a recent project with your key collaborator or partner today."
      },
      { 
        id: "co_7", 
        rarity: "Legendary", 
        insight: "Your public avatar is thriving, but your private self is neglected, starved of true spiritual alignment.", 
        inquest: "What is the main difference between your public self and your private self?",
        courage: "Dedicate 60 minutes tonight to a completely private alignment ritual—meditation, writing, or resting—with no screens and no intent to share it."
      }
    ] 
  }
};

const ALL_QUESTIONS = Object.values(DOMAINS).flatMap(d => d.questions.map(q => ({ 
  ...q, 
  domainTitle: d.title, 
  domainColor: d.color, 
  domainGlow: d.glow,
  badge: d.badge, 
  icon: d.icon 
})));

// --- HIGH-FIDELITY VECTOR COMPONENT FOR THE PREMIUM "DIVER" MASCOT ---
function DiverMascot({ size = 80, className = "" }) {
  return (
    <svg 
      viewBox="0 0 100 120" 
      width={size} 
      height={size * 1.2} 
      className={`select-none pointer-events-none drop-shadow-2xl ${className}`}
    >
      <defs>
        {/* Soft glow backlighting */}
        <radialGradient id="diverGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2c303b" />
          <stop offset="50%" stopColor="#1e222b" />
          <stop offset="100%" stopColor="#12141a" />
        </linearGradient>
        <linearGradient id="chromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5f6775" />
          <stop offset="35%" stopColor="#a1abbc" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#7a8596" />
          <stop offset="100%" stopColor="#2d333f" />
        </linearGradient>
        <linearGradient id="visorGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="30%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
        <filter id="neonSpiralGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="50" cy="55" r="45" fill="url(#diverGlow)" />
      <rect x="36" y="62" width="28" height="34" rx="8" fill="#1e222b" stroke="#0b0d10" strokeWidth="2.5" />
      <rect x="42" y="55" width="16" height="7" rx="1.5" fill="#475569" stroke="#0F172A" strokeWidth="1" />
      <path d="M 36 60 Q 18 52 30 42" stroke="#334155" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="84" rx="25" ry="23" fill="url(#suitGrad)" stroke="#0f1115" strokeWidth="3" />
      <path d="M 26 78 Q 14 80 18 90" stroke="url(#suitGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M 74 78 Q 86 80 82 90" stroke="url(#suitGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="37" cy="108" rx="8" ry="5.5" fill="#12141a" transform="rotate(-15 37 108)" />
      <ellipse cx="63" cy="108" rx="8" ry="5.5" fill="#12141a" transform="rotate(15 63 108)" />

      <g stroke="#d8b4fe" strokeWidth="1.2" fill="none" strokeLinecap="round" filter="url(#neonSpiralGlow)">
        <path d="M 20 83 A 2 2 0 1 0 21 85 A 1 1 0 1 0 20.5 84" />
        <path d="M 80 83 A 2 2 0 1 0 81 85 A 1 1 0 1 0 80.5 84" />
      </g>

      <circle cx="50" cy="83" r="6" fill="#1f242e" stroke="#0f1115" strokeWidth="1.5" />
      <path d="M 50 83 A 2.2 2.2 0 1 0 52 85 A 1.2 1.2 0 1 0 50.5 84" stroke="#c084fc" strokeWidth="1.2" fill="none" strokeLinecap="round" filter="url(#neonSpiralGlow)" />
      <circle cx="50" cy="45" r="30" fill="url(#chromeRing)" />
      <circle cx="50" cy="45" r="26" fill="url(#visorGlass)" stroke="#0b0d10" strokeWidth="1.5" />
      <circle cx="50" cy="45" r="23" fill="#fffdf9" />
      <circle cx="35" cy="51" r="5" fill="url(#cheekBlush)" />
      <circle cx="65" cy="51" r="5" fill="url(#cheekBlush)" />
      <circle cx="41" cy="44" r="4.5" fill="#13151b" />
      <circle cx="43.5" cy="41.5" r="1.6" fill="#ffffff" />
      <circle cx="59" cy="44" r="4.5" fill="#13151b" />
      <circle cx="61.5" cy="41.5" r="1.6" fill="#ffffff" />
      <path d="M 46.5 50 Q 50 53.2 53.5 50" stroke="#13151b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 29 34 A 21 21 0 0 1 45 25" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      <circle cx="66" cy="37" r="1.5" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

// --- GLOBAL PROCEDURAL CANVAS DRAWING PIPELINE FOR THE DETAILED "DIVER" ---
const drawCanvasDiver = (ctx, x, y, size) => {
  ctx.save();
  ctx.translate(x, y);

  const rScale = size / 80;

  // Glowing backlight halo
  const haloGrad = ctx.createRadialGradient(0, 0, 10 * rScale, 0, 0, 45 * rScale);
  haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 45 * rScale, 0, Math.PI * 2);
  ctx.fill();

  // Air Tank Base drawing configuration
  ctx.fillStyle = '#1e222b';
  ctx.strokeStyle = '#0b0d10';
  ctx.lineWidth = 2 * rScale;
  ctx.beginPath();
  
  // Custom manual path calculation to satisfy older mobile WKWebView rendering loops (no roundRect!)
  const rx = -14 * rScale;
  const ry = 10 * rScale;
  const rw = 28 * rScale;
  const rh = 34 * rScale;
  const rRadius = 8 * rScale;
  ctx.moveTo(rx + rRadius, ry);
  ctx.lineTo(rx + rw - rRadius, ry);
  ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rRadius);
  ctx.lineTo(rx + rw, ry + rh - rRadius);
  ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rRadius, ry + rh);
  ctx.lineTo(rx + rRadius, ry + rh);
  ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rRadius);
  ctx.lineTo(rx, ry + rRadius);
  ctx.quadraticCurveTo(rx, ry, rx + rRadius, ry);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body Suit
  const suitGrad = ctx.createLinearGradient(-25 * rScale, 10 * rScale, 25 * rScale, 54 * rScale);
  suitGrad.addColorStop(0, '#2c303b');
  suitGrad.addColorStop(0.5, '#1e222b');
  suitGrad.addColorStop(1, '#12141a');
  ctx.fillStyle = suitGrad;
  ctx.strokeStyle = '#0f1115';
  ctx.lineWidth = 3 * rScale;
  ctx.beginPath();
  if (ctx.ellipse) {
    ctx.ellipse(0, 30 * rScale, 25 * rScale, 23 * rScale, 0, 0, Math.PI * 2);
  } else {
    ctx.arc(0, 30 * rScale, 24 * rScale, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();

  // Arms
  ctx.strokeStyle = suitGrad;
  ctx.lineWidth = 11 * rScale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.quadraticCurveTo(-20 * rScale, 30 * rScale, -32 * rScale, 40 * rScale);
  ctx.stroke();
  ctx.beginPath();
  ctx.quadraticCurveTo(20 * rScale, 30 * rScale, 32 * rScale, 40 * rScale);
  ctx.stroke();

  // Flippers
  ctx.fillStyle = '#12141a';
  ctx.save();
  ctx.translate(-13 * rScale, 54 * rScale);
  ctx.rotate(-0.2);
  ctx.beginPath();
  if (ctx.ellipse) {
    ctx.ellipse(0, 0, 8 * rScale, 5.5 * rScale, 0, 0, Math.PI * 2);
  } else {
    ctx.arc(0, 0, 7 * rScale, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(13 * rScale, 54 * rScale);
  ctx.rotate(0.2);
  ctx.beginPath();
  if (ctx.ellipse) {
    ctx.ellipse(0, 0, 8 * rScale, 5.5 * rScale, 0, 0, Math.PI * 2);
  } else {
    ctx.arc(0, 0, 7 * rScale, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.restore();

  // Neon Shoulder Spirals
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.9)';
  ctx.lineWidth = 1.2 * rScale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(-22 * rScale, 31 * rScale, 2 * rScale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(22 * rScale, 31 * rScale, 2 * rScale, 0, Math.PI * 2);
  ctx.stroke();

  // Spiral Chest Badge
  ctx.fillStyle = '#1f242e';
  ctx.strokeStyle = '#0f1115';
  ctx.lineWidth = 1.5 * rScale;
  ctx.beginPath();
  ctx.arc(0, 29 * rScale, 6 * rScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.2 * rScale;
  ctx.beginPath();
  ctx.arc(0, 29 * rScale, 2.5 * rScale, 0, Math.PI * 0.85);
  ctx.stroke();

  // Helmet Metallic Chrome Outer Ring
  const chromeGrad = ctx.createLinearGradient(-30 * rScale, -39 * rScale, 30 * rScale, 21 * rScale);
  chromeGrad.addColorStop(0, '#5f6775');
  chromeGrad.addColorStop(0.35, '#a1abbc');
  chromeGrad.addColorStop(0.5, '#ffffff');
  chromeGrad.addColorStop(0.65, '#7a8596');
  chromeGrad.addColorStop(1, '#2d333f');
  ctx.fillStyle = chromeGrad;
  ctx.beginPath();
  ctx.arc(0, -9 * rScale, 30 * rScale, 0, Math.PI * 2);
  ctx.fill();

  // Visor Shield Glass
  const glassGrad = ctx.createLinearGradient(-26 * rScale, -35 * rScale, 26 * rScale, 17 * rScale);
  glassGrad.addColorStop(0, '#334155');
  glassGrad.addColorStop(0.3, '#1e293b');
  glassGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = glassGrad;
  ctx.strokeStyle = '#0b0d10';
  ctx.lineWidth = 1.5 * rScale;
  ctx.beginPath();
  ctx.arc(0, -9 * rScale, 26 * rScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Face Plate
  ctx.fillStyle = '#fffdf9';
  ctx.beginPath();
  ctx.arc(0, -9 * rScale, 23 * rScale, 0, Math.PI * 2);
  ctx.fill();

  // Blushing cheeks
  const blushGrad1 = ctx.createRadialGradient(-15 * rScale, -3 * rScale, 0, -15 * rScale, -3 * rScale, 5 * rScale);
  blushGrad1.addColorStop(0, 'rgba(251, 113, 133, 0.8)');
  blushGrad1.addColorStop(1, 'rgba(251, 113, 133, 0)');
  ctx.fillStyle = blushGrad1;
  ctx.beginPath();
  ctx.arc(-15 * rScale, -3 * rScale, 5 * rScale, 0, Math.PI * 2);
  ctx.fill();

  const blushGrad2 = ctx.createRadialGradient(15 * rScale, -3 * rScale, 0, 15 * rScale, -3 * rScale, 5 * rScale);
  blushGrad2.addColorStop(0, 'rgba(251, 113, 133, 0.8)');
  blushGrad2.addColorStop(1, 'rgba(251, 113, 133, 0)');
  ctx.fillStyle = blushGrad2;
  ctx.beginPath();
  ctx.arc(15 * rScale, -3 * rScale, 5 * rScale, 0, Math.PI * 2);
  ctx.fill();

  // Big Adorable Visor Eyes
  ctx.fillStyle = '#13151b';
  ctx.beginPath();
  ctx.arc(-9 * rScale, -10 * rScale, 4.5 * rScale, 0, Math.PI * 2);
  ctx.arc(9 * rScale, -10 * rScale, 4.5 * rScale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-6.5 * rScale, -12.5 * rScale, 1.6 * rScale, 0, Math.PI * 2);
  ctx.arc(11.5 * rScale, -12.5 * rScale, 1.6 * rScale, 0, Math.PI * 2);
  ctx.fill();

  // Smiling Mouth
  ctx.strokeStyle = '#13151b';
  ctx.lineWidth = 2.5 * rScale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, -4 * rScale, 4 * rScale, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Upper Glass Visor gloss reflections
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3 * rScale;
  ctx.beginPath();
  ctx.arc(0, -9 * rScale, 22 * rScale, -0.6 * Math.PI, -0.15 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(16 * rScale, -17 * rScale, 1.5 * rScale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showGachaResult, setShowGachaResult] = useState(false);
  const [gachaResult, setGachaResult] = useState(null);
  const [leverAngle, setLeverAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('machine'); 
  const canvasRef = useRef(null);
  const domeCanvasRef = useRef(null);

  // Dynamic state stored safely
  const [totalSpins, setTotalSpins] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [coins, setCoins] = useState(3); // Strict 3 spins daily limit
  const [journalLogs, setJournalLogs] = useState([]);
  const [reflectionText, setReflectionText] = useState('');
  const [marqueeIndex, setMarqueeIndex] = useState(0);

  // Calibration Success Overlay state
  const [isCalibrated, setIsCalibrated] = useState(false);

  // Onboarding Guide Toggle (wrapped in storage safe-checks)
  const [showGuide, setShowGuide] = useState(() => {
    const value = safeLocalStorage.getItem('lym_guide_dismissed');
    return value !== 'true';
  });

  // Custom Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Streak State Tracker (Starts at 0 so Day 1 is grey/pulsing until spun)
  const [streakCount, setStreakCount] = useState(0);
  const [streakHistory, setStreakHistory] = useState([]);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Recharge Countdown Time States
  const [lastRecharge, setLastRecharge] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState('');

  // Personalized Motto & Header Focus of the Day
  const [messageOfTheDay, setMessageOfTheDay] = useState('TruSelf & Action');

  // Fixed brand theme color matching luxury slate gold
  const [beanColor] = useState('#D97706');

  // Physics-based balls reference for the HTML5 Canvas dome simulation
  const physicsBallsRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  // Toast Notification Trigger
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  }, []);

  // --- GLOBAL spinGacha DECLARED SAFELY AT TOP OF BODY IN SCOPE ---
  const spinGacha = useCallback(() => {
    if (isSpinning) return;
    if (coins <= 0) {
      showToast(`Daily energy exhausted. Resetting back to 3 pulls in ${timeRemaining || "a few moments"}.`);
      return;
    }

    setIsSpinning(true);
    setLeverAngle(prev => prev + 360);

    // Apply safe velocity to physics balls
    physicsBallsRef.current.forEach(b => {
      b.vx = (Math.random() - 0.5) * 15;
      b.vy = -8 - Math.random() * 8; 
    });

    const nextSpinCount = totalSpins + 1;
    
    const roll = Math.random() * 100;
    let targetRarity = "Common";
    if (roll > 90) targetRarity = "Legendary";
    else if (roll > 60) targetRarity = "Rare";

    let eligiblePool = ALL_QUESTIONS.filter(q => q.rarity === targetRarity);
    
    let recentPulls = [];
    try {
      recentPulls = JSON.parse(safeLocalStorage.getItem('lym_recent_pulls') || '[]');
    } catch (e) {
      recentPulls = [];
    }

    let filteredPool = eligiblePool.filter(q => !recentPulls.includes(q.id));
    
    if (filteredPool.length === 0) filteredPool = eligiblePool; 
    if (filteredPool.length === 0) filteredPool = ALL_QUESTIONS; 

    const selectedQuestion = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    const nextRecent = [selectedQuestion.id, ...recentPulls].slice(0, 5);
    safeLocalStorage.setItem('lym_recent_pulls', JSON.stringify(nextRecent));

    const updatedDiscoveries = discoveredIds.includes(selectedQuestion.id)
      ? discoveredIds
      : [...discoveredIds, selectedQuestion.id];
    const nextCoins = coins - 1;

    // Record streak dates in history (Only appends on actual gacha action to prevent pre-checked Day 1 anomalies)
    const todayStr = getLocalDateString(0);
    let updatedHistory = [...streakHistory];
    if (!updatedHistory.includes(todayStr)) {
      updatedHistory.push(todayStr);
      safeLocalStorage.setItem('lym_streak_history', JSON.stringify(updatedHistory));
      setStreakHistory(updatedHistory);
    }
    const currentStreak = computeStreak(updatedHistory);
    setStreakCount(currentStreak);

    // Dynamic Focus Phrase Intercept & Allocation
    try {
      const activeDomain = selectedQuestion.domainTitle;
      const phrases = FOCUS_PHRASES[activeDomain] || ["TruSelf & Action"];
      const randomizedFocus = phrases[Math.floor(Math.random() * phrases.length)];
      setMessageOfTheDay(randomizedFocus);
      safeLocalStorage.setItem('lym_motd', randomizedFocus);
    } catch (e) {}

    setTotalSpins(nextSpinCount);
    setDiscoveredIds(updatedDiscoveries);
    setCoins(nextCoins);
    setReflectionText(''); 
    setIsCalibrated(false); 

    safeLocalStorage.setItem('lym_total_spins', String(nextSpinCount));
    safeLocalStorage.setItem('lym_discovered_ids', JSON.stringify(updatedDiscoveries));
    safeLocalStorage.setItem('lym_gacha_coins', String(nextCoins));

    setTimeout(() => {
      setGachaResult(selectedQuestion);
      setShowGachaResult(true);
      setIsSpinning(false);
    }, 1800);
  }, [isSpinning, totalSpins, discoveredIds, coins, timeRemaining, streakHistory, showToast]);

  // --- FREE COIN REPLENISHMENT ENGINE ---
  const addFreeCoin = () => {
    setCoins(3);
    safeLocalStorage.setItem('lym_gacha_coins', '3');
    showToast("Energy balance refreshed! Daily spins reset to 3.");
  };

  // Save Reflection
  const saveReflection = () => {
    if (!gachaResult) return;

    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      questionId: gachaResult.id,
      domain: gachaResult.domainTitle,
      domainColor: gachaResult.domainColor,
      badge: gachaResult.badge,
      insight: gachaResult.insight,
      inquest: gachaResult.inquest,
      courage: gachaResult.courage,
      reflection: reflectionText || "Self-guided reflection session.",
      motto: messageOfTheDay
    };

    const updatedLogs = [newLog, ...journalLogs];
    setJournalLogs(updatedLogs);
    safeLocalStorage.setItem('lym_journal_logs', JSON.stringify(updatedLogs));
    safeLocalStorage.setItem('lym_motd', messageOfTheDay);
    
    setIsCalibrated(true);
    showToast("Reflection logged! TruSelf alignment validated.");
  };

  const deleteJournalEntry = (id) => {
    const updated = journalLogs.filter(log => log.id !== id);
    setJournalLogs(updated);
    safeLocalStorage.setItem('lym_journal_logs', JSON.stringify(updated));
    showToast("Entry deleted successfully.");
  };

  const copyJournalToClipboard = () => {
    const text = journalLogs.map(log => 
      `--- ${log.date} | Focus: ${log.motto || 'None'} | [${log.domain}] ---\nInsight: ${log.insight || ''}\nInquest: ${log.inquest}\nCourage Step: ${log.courage}\nReflection: ${log.reflection}\n`
    ).join('\n');

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    showToast("Entire reflection archive copied to clipboard!");
  };

  // --- PREMIUM CHIC MOBILE WALLPAPER GENERATOR ---
  const downloadManifestationCard = () => {
    if (!gachaResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1800;

    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(600, 900, 100, 600, 900, 900);
    gradient.addColorStop(0, gachaResult.domainColor + '2F'); 
    gradient.addColorStop(0.5, '#D977060A'); 
    gradient.addColorStop(1, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const beamGrad = ctx.createLinearGradient(600, 0, 600, 550);
    beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(350, 0);
    ctx.lineTo(850, 0);
    ctx.lineTo(1000, 550);
    ctx.lineTo(200, 550);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = gachaResult.domainColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = '#D9770630';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    const drawCornerMarks = (x, y, xDir, yDir) => {
      ctx.strokeStyle = '#D9770680';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + yDir * 40);
      ctx.lineTo(x, y);
      ctx.lineTo(x + xDir * 40, y);
      ctx.stroke();
    };
    drawCornerMarks(70, 70, 1, 1);
    drawCornerMarks(canvas.width - 70, 70, -1, 1);
    drawCornerMarks(70, canvas.height - 70, 1, -1);
    drawCornerMarks(canvas.width - 70, canvas.height - 70, -1, -1);

    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, currentY);
      return currentY;
    };

    drawCanvasDiver(ctx, 600, 175, 80);

    const drawLogoAndCardText = (startY) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.textAlign = 'center';
      ctx.fillText('TRUSELF REVEAL', canvas.width / 2, startY);

      ctx.fillStyle = gachaResult.domainColor;
      ctx.font = 'bold 16px sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('L I V E   Y O U R   M A R K', canvas.width / 2, startY + 36);

      const activeMotto = (messageOfTheDay || 'TruSelf & Action').trim();
      ctx.fillStyle = '#111827';
      ctx.fillRect(200, startY + 80, canvas.width - 400, 110);
      
      ctx.strokeStyle = '#D97706A0';
      ctx.lineWidth = 3;
      ctx.strokeRect(200, startY + 80, canvas.width - 400, 110);

      ctx.strokeStyle = '#FFFFFF0D';
      ctx.lineWidth = 1;
      ctx.strokeRect(210, 90, canvas.width - 420, 90);

      ctx.fillStyle = '#D97706';
      ctx.font = '900 13px sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('INTENTIONAL FOCUS OF THE DAY', canvas.width / 2, startY + 115);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`"${activeMotto}"`, canvas.width / 2, startY + 160);

      ctx.fillStyle = gachaResult.domainColor + '1C';
      ctx.fillRect(240, startY + 230, canvas.width - 480, 56);
      ctx.strokeStyle = gachaResult.domainColor + '50';
      ctx.lineWidth = 2;
      ctx.strokeRect(240, startY + 230, canvas.width - 480, 56);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px sans-serif';
      ctx.fillText(`${gachaResult.badge} • ${gachaResult.domainTitle.toUpperCase()}`, canvas.width / 2, startY + 265);

      const textStartY = startY + 360;
      ctx.fillStyle = '#D9770622';
      ctx.font = 'bold 180px Georgia, serif';
      ctx.fillText('“', canvas.width / 2 - 280, textStartY + 100);

      ctx.fillStyle = '#D97706';
      ctx.font = '900 16px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('MESSAGE OF THE DAY', canvas.width / 2, textStartY);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'italic 28px Georgia, serif';
      const lastInsightY = wrapText(ctx, `"${gachaResult.insight}"`, canvas.width / 2, textStartY + 55, 780, 44);

      const inquestStartY = lastInsightY + 110;
      ctx.fillStyle = '#D97706';
      ctx.font = '900 16px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('ASK YOURSELF?', canvas.width / 2, inquestStartY);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 38px sans-serif';
      const lastInquestY = wrapText(ctx, gachaResult.inquest, canvas.width / 2, inquestStartY + 65, 820, 56);

      const courageStartY = lastInquestY + 110;
      ctx.fillStyle = '#EF4444';
      ctx.font = '900 16px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('⚡ ACT OF COURAGE ⚡', canvas.width / 2, courageStartY);

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 28px sans-serif';
      const lastCourageY = wrapText(ctx, gachaResult.courage, canvas.width / 2, courageStartY + 60, 820, 44);

      if (reflectionText.trim().length > 0) {
        const reflectionStartY = lastCourageY + 110;
        ctx.fillStyle = gachaResult.domainColor;
        ctx.font = '900 15px sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('MY ALIGNMENT REFLECTION', canvas.width / 2, reflectionStartY);

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'italic 24px Georgia, serif';
        wrapText(ctx, `"${reflectionText}"`, canvas.width / 2, reflectionStartY + 45, 800, 38);
      }

      ctx.fillStyle = '#FFFFFF22';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('TRUSELF REVEAL • LIVE STRATEGY: 27 & 28 JUNE 2026', canvas.width / 2, canvas.height - 110);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `LYM_Inquest_${gachaResult.id}.png`;
      link.href = dataUrl;
      link.click();
    };

    drawLogoAndCardText(280);
  };

  // --- DOWNLOAD CORE ARCHETYPE ANALYSIS GRAPHIC ---
  const downloadArchetypeCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1800;

    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(600, 900, 100, 600, 900, 900);
    gradient.addColorStop(0, '#6366F12F'); 
    gradient.addColorStop(0.5, '#D977060A'); 
    gradient.addColorStop(1, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const beamGrad = ctx.createLinearGradient(600, 0, 600, 550);
    beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(350, 0);
    ctx.lineTo(850, 0);
    ctx.lineTo(1000, 550);
    ctx.lineTo(200, 550);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = '#D9770630';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    const drawCornerMarks = (x, y, xDir, yDir) => {
      ctx.strokeStyle = '#D9770680';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + yDir * 40);
      ctx.lineTo(x, y);
      ctx.lineTo(x + xDir * 40, y);
      ctx.stroke();
    };
    drawCornerMarks(70, 70, 1, 1);
    drawCornerMarks(canvas.width - 70, 70, -1, 1);
    drawCornerMarks(70, canvas.height - 70, 1, -1);
    drawCornerMarks(canvas.width - 70, canvas.height - 70, -1, -1);

    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, currentY);
      return currentY;
    };

    drawCanvasDiver(ctx, 600, 175, 85);

    const startY = 280;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TRUSELF REVEAL', canvas.width / 2, startY);

    ctx.fillStyle = '#6366F1';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('L I V E   Y O U R   M A R K', canvas.width / 2, startY + 36);

    // Dynamic Archetype Card Header
    ctx.fillStyle = '#111827';
    ctx.fillRect(200, startY + 80, canvas.width - 400, 110);
    ctx.strokeStyle = '#D97706A0';
    ctx.lineWidth = 3;
    ctx.strokeRect(200, startY + 80, canvas.width - 400, 110);

    ctx.fillStyle = '#D97706';
    ctx.font = '900 13px sans-serif';
    ctx.fillText('CORE PATTERN SYNTHESIS PROFILE', canvas.width / 2, startY + 115);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(currentArchetype.title.toUpperCase(), canvas.width / 2, startY + 160);

    const profileY = startY + 230;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('ALIGNMENT DIAGNOSIS', canvas.width / 2, profileY);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'italic 26px Georgia, serif';
    const lastSummaryY = wrapText(ctx, `"${currentArchetype.desc}"`, canvas.width / 2, profileY + 55, 800, 42);

    const strengthsY = lastSummaryY + 80;
    ctx.fillStyle = '#10B981';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('TACTICAL POWER STRENGTHS', canvas.width / 2, strengthsY);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 24px sans-serif';
    let currentY = strengthsY + 50;
    currentArchetype.strengths.forEach((str) => {
      currentY = wrapText(ctx, `• ${str}`, canvas.width / 2, currentY, 820, 36) + 40;
    });

    const blindspotY = currentY + 40;
    ctx.fillStyle = '#EF4444';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('HIGH-VALUE BLINDSPOT', canvas.width / 2, blindspotY);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '24px sans-serif';
    const lastBlindspotY = wrapText(ctx, currentArchetype.growth, canvas.width / 2, blindspotY + 50, 820, 36);

    const directiveY = lastBlindspotY + 80;
    ctx.fillStyle = '#F59E0B';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('⚡ ESSENTIAL ACTION DIRECTIVE ⚡', canvas.width / 2, directiveY);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 26px sans-serif';
    wrapText(ctx, currentArchetype.directive, canvas.width / 2, directiveY + 50, 820, 38);

    ctx.fillStyle = '#FFFFFF22';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('TRUSELF REVEAL • PATTERN ARCHETYPES: 27 & 28 JUNE 2026', canvas.width / 2, canvas.height - 110);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `TruSelf_Archetype_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Local Personalized NLP Reflection Input Parser
  const getValidationMessage = (domain, text) => {
    const rawText = (text || "").toLowerCase();

    if (rawText.includes("burnout") || rawText.includes("tired") || rawText.includes("exhausted") || rawText.includes("rest") || rawText.includes("sleep")) {
      return "Calibration Response: Deep energy drainage signals spotted in your reflection notes. Your physical system is actively requesting a strategic pause. Halting your manual execution right now to sleep or recover isn't a distraction—it is your highest revenue-generating asset today.";
    }
    if (rawText.includes("busy") || rawText.includes("overwhelmed") || rawText.includes("tasks") || rawText.includes("manage") || rawText.includes("work") || rawText.includes("todo")) {
      return "Calibration Response: High administrative friction detected. Remember that packing your daily agenda with minor check-lists is often a subconscious shield used to avoid making the high-stakes, higher-leverage structural moves on your macro roadmap. Prune the noise.";
    }
    if (rawText.includes("scared") || rawText.includes("fear") || rawText.includes("doubt") || rawText.includes("worry") || rawText.includes("afraid") || rawText.includes("risk") || rawText.includes("fail")) {
      return "Calibration Response: Internal boundary resistance detected. Do not retreat. This mental friction is not an indicator of failure; it is the natural nervous system stretch that marks the exact outer boundaries of your next alignment expansion phase. Breathe and pivot forward.";
    }
    if (rawText.includes("boundary") || rawText.includes("no") || rawText.includes("difficult") || rawText.includes("person") || rawText.includes("team") || rawText.includes("client")) {
      return "Calibration Response: Interpersonal alignment warning. Sustainable authority is never built on accommodating low-leverage compliance parameters or toxic demands. Re-anchor your standard, say your clear 'No', and establish an explicit agreement.";
    }

    switch (domain) {
      case "Creation/Choice": 
        return "Vision Calibrated. Your creative choice is anchored in your local device archive. Do not let this draft hide in isolation—bring your bold, unfiltered perspective into the light today.";
      case "Advancement": 
        return "Momentum Locked. Action is the ultimate clarifier. You have successfully structured your priority task—execute with zero compromise tomorrow.";
      case "Achievement": 
        return "Mastery Aligned. You are actively building past old comfort baselines. Honor your structural progress, play the highest stakes available, and celebrate this win.";
      case "Resource Gaining": 
        return "Abundance Registered. Focus and cognitive spacing are your primary assets. You have successfully mapped your leverage—allocate your resources intentionally today.";
      case "Vitality": 
        return "Energy Centered. Peak performance demands uncompromising biological recovery. By logging this alignment, you honor your physical vessel. Guard your rest.";
      case "Dreams/Passions": 
        return "Core Spark Verified. Excitement is your highest strategic compass. You have captured your enthusiasm—shield this playground of flow from daily static.";
      case "People": 
        return "Tribe Boundaries Established. Clean leadership is built on honest agreements and uncompromised respect. Speak your unfiltered perspective with conviction today.";
      case "Connection": 
        return "Truth Sealed. Empathy and self-honesty are your actual strength. You have successfully lowered your drawbridge—step forward in raw alignment.";
      default: 
        return "Alignment Calibrated. Your reflection has been successfully validated and logged in your secure local device memory.";
    }
  };

  // Setup initial state, load localStorage & auto-migrate data on mount
  useEffect(() => {
    let storedSpins = 0;
    let storedDiscoveries = [];
    let storedCoins = null;
    let storedJournal = [];
    let savedMOTD = 'TruSelf & Action';
    let storedRecharge = null;
    let storedHistory = [];

    // BULLETPROOF COMPATIBILITY: Secure variables with try-catch block to completely prevent corrupt local state crashes on iOS Safari!
    try {
      const rawSpins = safeLocalStorage.getItem('lym_total_spins');
      if (rawSpins) storedSpins = Number(rawSpins);

      const rawDiscoveries = safeLocalStorage.getItem('lym_discovered_ids');
      if (rawDiscoveries) storedDiscoveries = JSON.parse(rawDiscoveries);

      storedCoins = safeLocalStorage.getItem('lym_gacha_coins');

      const rawJournal = safeLocalStorage.getItem('lym_journal_logs');
      if (rawJournal) storedJournal = JSON.parse(rawJournal);

      const rawMOTD = safeLocalStorage.getItem('lym_motd');
      if (rawMOTD) savedMOTD = rawMOTD;

      storedRecharge = safeLocalStorage.getItem('lym_last_recharge');

      const rawHistory = safeLocalStorage.getItem('lym_streak_history');
      if (rawHistory) storedHistory = JSON.parse(rawHistory);
    } catch (e) {
      console.error("Corrupted localStorage entries handled. Resetting safely:", e);
    }

    if (!Array.isArray(storedHistory)) {
      storedHistory = [];
    }
    setStreakHistory(storedHistory);

    const migratedJournal = storedJournal.map(log => {
      if (log.question && !log.inquest) {
        return {
          ...log,
          inquest: log.question,
          insight: log.insight || log.horoscope || "Focus alignment mark pulled from archive.",
          badge: log.badge || "🔮 ALIGNMENT INQUEST",
          courage: log.courage || "Commit to taking immediate aligned action today."
        };
      }
      return log;
    });

    setTotalSpins(storedSpins);
    setDiscoveredIds(storedDiscoveries);
    setJournalLogs(migratedJournal);
    setMessageOfTheDay(savedMOTD);

    let initialRecharge = Date.now();
    if (storedRecharge) {
      initialRecharge = Number(storedRecharge);
    } else {
      safeLocalStorage.setItem('lym_last_recharge', String(initialRecharge));
    }
    setLastRecharge(initialRecharge);

    let initialCoins = 3;
    const msSinceLast = Date.now() - initialRecharge;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (msSinceLast >= twentyFourHours) {
      initialCoins = 3;
      initialRecharge = Date.now();
      safeLocalStorage.setItem('lym_gacha_coins', '3');
      safeLocalStorage.setItem('lym_last_recharge', String(initialRecharge));
      setLastRecharge(initialRecharge);
    } else if (storedCoins !== null) {
      initialCoins = Number(storedCoins);
    } else {
      safeLocalStorage.setItem('lym_gacha_coins', '3');
    }
    setCoins(initialCoins);

    const calculatedStreak = computeStreak(storedHistory);
    setStreakCount(calculatedStreak);

    const width = 280;
    const height = 240;
    const domainValues = Object.values(DOMAINS);
    physicsBallsRef.current = Array.from({ length: 14 }).map((_, i) => {
      const radius = 19 + Math.round(Math.random() * 4); 
      return {
        id: i,
        x: radius + Math.random() * (width - radius * 2),
        y: radius + Math.random() * (height / 2),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: radius,
        color: domainValues[Math.floor(Math.random() * domainValues.length)].color,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.1
      };
    });
  }, []);

  // Strict 24-Hour countdown ticker interval
  useEffect(() => {
    const timer = setInterval(() => {
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const nextRechargeTime = lastRecharge + twentyFourHours;
      const now = Date.now();
      const difference = nextRechargeTime - now;

      if (difference <= 0) {
        setCoins(3);
        setLastRecharge(now);
        safeLocalStorage.setItem('lym_gacha_coins', '3');
        safeLocalStorage.setItem('lym_last_recharge', String(now));
        setTimeRemaining('');
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const pad = (num) => String(num).padStart(2, '0');
        setTimeRemaining(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRecharge]);

  // HTML5 Physics engine loop
  useEffect(() => {
    if (activeTab !== 'machine') {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }

    const canvas = domeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = 280;
    let height = canvas.height = 240;

    const runPhysics = () => {
      ctx.clearRect(0, 0, width, height);

      const backingGrad = ctx.createRadialGradient(width/2, height/2, 20, width/2, height/2, width/2);
      backingGrad.addColorStop(0, '#1E1B4B44');
      backingGrad.addColorStop(1, '#00000000');
      ctx.fillStyle = backingGrad;
      ctx.fillRect(0, 0, width, height);

      const balls = physicsBallsRef.current;
      const gravity = 0.25;
      const friction = 0.985;
      const bounceRestitution = 0.65;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        if (isNaN(b.x) || isNaN(b.y) || !isFinite(b.x) || !isFinite(b.y)) {
          b.x = b.radius + Math.random() * (width - b.radius * 2);
          b.y = b.radius + Math.random() * (height / 2);
          b.vx = (Math.random() - 0.5) * 2;
          b.vy = (Math.random() - 0.5) * 2;
          b.angle = Math.random() * Math.PI * 2;
          b.spinSpeed = 0;
        }

        if (isSpinning) {
          const dx = b.x - centerX;
          const dy = b.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const swirlStrength = 2.4;
          b.vx += (-dy / dist) * swirlStrength + (Math.random() - 0.5) * 5;
          b.vy += (dx / dist) * swirlStrength - 0.9 + (Math.random() - 0.5) * 5;
          b.spinSpeed = b.vx * 0.01;
        } else {
          b.vy += gravity;
          b.vx *= friction;
          b.vy *= friction;
          b.spinSpeed *= 0.92;
        }

        const speedLimit = 12;
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > speedLimit) {
          b.vx = (b.vx / speed) * speedLimit;
          b.vy = (b.vy / speed) * speedLimit;
        }

        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.spinSpeed;

        if (b.x < b.radius) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx) * bounceRestitution;
        } else if (b.x > width - b.radius) {
          b.x = width - b.radius;
          b.vx = -Math.abs(b.vx) * bounceRestitution;
        }

        if (b.y < b.radius) {
          b.y = b.radius;
          b.vy = Math.abs(b.vy) * bounceRestitution;
        } else if (b.y > height - b.radius) {
          b.y = height - b.radius;
          b.vy = -Math.abs(b.vy) * bounceRestitution;
          b.vx *= 0.95; 
        }

        for (let j = i + 1; j < balls.length; j++) {
          const b2 = balls[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const minDist = b.radius + b2.radius;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            b.x -= nx * overlap * 0.5;
            b.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const impulse = 2 * (nx * kx + ny * ky) / 2;

            b.vx -= impulse * nx * 0.75;
            b.vy -= impulse * ny * 0.75;
            b2.vx += impulse * nx * 0.75;
            b2.vy += impulse * ny * 0.75;

            const tempSpin = b.spinSpeed;
            b.spinSpeed = b2.spinSpeed * 0.8;
            b2.spinSpeed = tempSpin * 0.8;
          }
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);

        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        const glossGrad = ctx.createLinearGradient(-b.radius, -b.radius, b.radius, b.radius);
        glossGrad.addColorStop(0, '#FFFFFF77');
        glossGrad.addColorStop(0.3, '#FFFFFF11');
        glossGrad.addColorStop(0.5, '#00000011');
        glossGrad.addColorStop(1, '#00000099');
        ctx.fillStyle = glossGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-b.radius, 0);
        ctx.lineTo(b.radius, 0);
        ctx.strokeStyle = '#00000044';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, b.radius * 0.8, -Math.PI * 0.6, -Math.PI * 0.1);
        ctx.strokeStyle = '#FFFFFF88';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }

      animationFrameIdRef.current = requestAnimationFrame(runPhysics);
    };

    runPhysics();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isSpinning, activeTab]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans select-none relative overflow-x-hidden" style={{ fontFamily: "'Jost', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;600;700;900&display=swap" rel="stylesheet" />
      
      {/* Premium Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-slate-900/95 border border-indigo-500/30 px-5 py-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-2.5 animate-in slide-in-from-top duration-300 max-w-xs text-center">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* Ambient depth background layout */}
      <div className="fixed inset-0 pointer-events-none opacity-25 z-0">
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-sky-900 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-indigo-950 rounded-full blur-[150px]"></div>
      </div>

      {/* Sticky Top Header Bar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 border-b border-white/5 backdrop-blur-md bg-[#0F172A]/40 sticky top-0">
        <div className="flex items-center gap-3">
          <DiverMascot size={32} />
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-100 uppercase leading-none">TruSelf Reveal</h1>
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-indigo-300 opacity-60 mt-1">Live Your Mark</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-200">
            <Coins className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="font-semibold">{coins} Spins</span>
            {coins < 3 && timeRemaining && (
              <span className="text-[10px] text-indigo-300 ml-1 opacity-80 border-l border-white/10 pl-2">
                Reset in {timeRemaining}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Ambient Arcade Billboard Marquee */}
      <div className="w-full bg-[#0B0F19]/90 border-b border-white/5 py-2.5 overflow-hidden relative z-40 flex items-center justify-center">
        <div className="text-[10px] font-black tracking-widest text-center text-indigo-300 uppercase opacity-80 px-4">
          {marqueeIndex === 0 && `🔮 MARKS UNLOCKED: ${discoveredIds.length}/56 TRUE SELF DIALS ARCHIVED 🔮`}
          {marqueeIndex === 1 && `🎪 CO-ACTION: TRUSELF SUMMIT Live • 27 & 28 June 2026 • Secure Your Seat Now 🎪`}
          {marqueeIndex === 2 && `📸 Follow us on Instagram: @live.your.mark`}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-50 max-w-sm mx-auto w-full px-6 mt-8 flex justify-between border-b border-white/5 pb-2 pointer-events-auto">
        {['machine', 'album', 'journal'].map((tab) => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); }}
            className={`text-xs font-bold uppercase tracking-widest transition-all pb-1 cursor-pointer relative z-50 pointer-events-auto ${activeTab === tab ? 'border-b-2 border-amber-500 text-amber-500 font-black' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab === 'machine' ? 'Wheel' : tab === 'album' ? 'Stickers' : 'Journal'}
          </button>
        ))}
      </div>

      {/* Main Workspace */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center py-8 px-6 w-full max-w-md mx-auto">
        
        {/* TAB 1: machine view */}
        {activeTab === 'machine' && (
          <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
            
            {/* --- QUICK START GUIDE PANEL (MOVED TO TOP FOR MOBILE ADAPTABILITY) --- */}
            {showGuide && (
              <div className="w-full max-w-[290px] mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 relative animate-in fade-in duration-300">
                <button 
                  onClick={() => {
                    setShowGuide(false);
                    safeLocalStorage.setItem('lym_guide_dismissed', 'true');
                  }}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <h4 className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Quick Start Guide
                </h4>
                <ul className="space-y-2 text-[10px] text-slate-300 leading-normal font-sans">
                  <li><strong>1. Spin the Wheel:</strong> Pull the golden dial to reveal your daily gacha assessment card. (Strictly 3 spins per day).</li>
                  <li><strong>2. Reflect & Save:</strong> Type your thoughts in the modal reflection box and click <strong>Save Log</strong> to archive your insights.</li>
                  <li><strong>3. Stickers & Journal:</strong> Track progress on the <strong>Stickers</strong> tab. Tap any unlocked card to review questions or view logs in your <strong>Journal</strong>.</li>
                  <li><strong>4. Pattern Synthesis:</strong> Build your 7-day streak to see what it reveals about the patterns you are running in life, and download your TruSelf report!</li>
                </ul>
              </div>
            )}

            <div className="w-full aspect-[3/4.2] relative max-w-[310px] mt-4">
              
              <div className="w-full h-full bg-white rounded-[45px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-[#1E1B4B] overflow-hidden flex flex-col relative">
                
                <div className="relative h-[58%] bg-[#F8FAFC] border-b-[10px] border-[#1E1B4B] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1E1B4B]/5 to-[#1E1B4B]/10 pointer-events-none z-10" />
                  <div className="absolute left-3 right-3 top-3 bottom-3 rounded-[35px] bg-slate-200/40 shadow-inner overflow-hidden flex items-center justify-center">
                    <canvas 
                      ref={domeCanvasRef} 
                      className="w-full h-full rounded-[28px] object-cover pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex-1 bg-[#1E1B4B] p-4 flex flex-col items-center justify-between relative">
                  <div className="w-full bg-indigo-950/40 rounded-xl py-1 px-3 text-center border border-indigo-900/40">
                    <span className="text-[9px] font-semibold text-indigo-300 tracking-wider">
                      {isSpinning ? "CONVERGING INTERNAL STATE..." : `PULLS REGISTERED: ${totalSpins}`}
                    </span>
                  </div>

                  <div 
                    className="w-18 h-18 bg-indigo-950 rounded-full shadow-2xl flex items-center justify-center border-4 border-indigo-900 cursor-pointer active:scale-95 transition-transform" 
                    style={{ transform: `rotate(${leverAngle}deg)`, transition: 'transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)' }} 
                    onClick={spinGacha}
                  >
                    <div className="w-11 h-2 bg-amber-500 rounded-full absolute shadow-inner" />
                    <div className="w-6 h-6 bg-white rounded-full border-4 border-amber-500 flex items-center justify-center z-20">
                      <div className="w-2 h-2 bg-[#1E1B4B] rounded-full" />
                    </div>
                  </div>

                  <div className="w-16 h-8 bg-slate-950 rounded-t-xl flex items-center justify-center pb-0.5 border-t border-slate-900">
                    <div className="w-4 h-2 bg-indigo-500/10 rounded-full blur-[3px]" />
                  </div>
                </div>

              </div>
            </div>

            {coins <= 0 && timeRemaining && (
              <div className="mt-5 p-3.5 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl text-center w-full max-w-[280px] animate-pulse">
                <span className="text-[11px] font-bold text-indigo-300 block">⏳ 24h Gacha Battery Empty</span>
                <span className="text-xs text-amber-500 font-mono font-bold mt-1 block">Recharges 3 coins in {timeRemaining}</span>
              </div>
            )}

            {/* --- LOCALIZED 7-DAY ALIGNMENT STREAK VIEW --- */}
            <div className="mt-6 w-full max-w-[290px] p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">Alignment Streak Tracker</span>
                <span className="text-xs font-black text-amber-500 tracking-tight">{streakCount} {streakCount === 1 ? 'Day' : 'Days'} Active</span>
              </div>

              {/* Progress nodes chronological layout (Filling forward D1 -> D7) */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {Array.from({ length: 7 }).map((_, index) => {
                  const isChecked = index < streakCount;
                  const isToday = index === Math.min(6, streakCount); 
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${isChecked ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-[0_0_12px_rgba(217,119,6,0.35)]' : isToday ? 'border-indigo-400 bg-indigo-950/40 text-indigo-300 animate-pulse' : 'border-white/10 bg-slate-900/60 text-slate-500'}`}>
                        {isChecked ? "✓" : index + 1}
                      </div>
                      <span className="text-[7px] text-slate-500 font-bold mt-1 uppercase font-sans">D{index + 1}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-sans text-left">
                <strong className="text-indigo-400 block mb-1">🎯 Day 1 Alignment Complete</strong>
                Your streak is currently active at <strong className="text-white">{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</strong>. Tap below to unlock your patterns based on your daily inputs!
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[10px] text-slate-400 leading-normal font-sans text-left">
                <strong className="text-indigo-400 block mb-1">🎯 Why Complete 7 Days Straight?</strong>
                Keep your streak going to see what it reveals about the patterns you are running in life. Reaching Day 7 unlocks your complete **TruSelf Synthesis** report!
              </div>

              <button
                onClick={() => { setShowStreakModal(true); }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9px] font-black tracking-widest uppercase transition-all shadow-md cursor-pointer"
              >
                📊 View Alignment Patterns
              </button>

              {/* Privacy Guarantee Card */}
              <div className="mt-3 p-3.5 bg-slate-950/80 border border-emerald-500/10 rounded-xl text-left flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-slate-200 uppercase tracking-wider">Privacy Guarantee</h5>
                  <p className="text-[9px] text-slate-400 leading-normal mt-0.5 font-sans">
                    No data is ever stored by us. All logs, journals, and reflections remain 100% inside your local device memory (<code className="text-emerald-400 font-bold font-mono">localStorage</code>). Your privacy is uncompromised.
                  </p>
                </div>
              </div>
            </div>

            {/* Reload Balance link */}
            <button 
              onClick={addFreeCoin} 
              className="mt-6 text-[10px] text-amber-500/50 font-bold tracking-widest uppercase hover:text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
            >
              + Refresh Energy Balance
            </button>

          </div>
        )}

        {/* TAB 2: ALBUM GRID */}
        {activeTab === 'album' && (
          <div className="w-full mt-2 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase block">Discovered Marks</span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">TruSelf Library Grid</h3>
              
              <div className="mt-4 bg-slate-950 rounded-full h-2.5 overflow-hidden border border-white/5 relative">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-1000"
                  style={{ width: `${(discoveredIds.length / 56) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block uppercase font-bold tracking-wider">
                Progress: {discoveredIds.length} / 56 Marks ({Math.round((discoveredIds.length / 56) * 100)}%)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {ALL_QUESTIONS.map((q, index) => {
                const isUnlocked = discoveredIds.includes(q.id);
                return (
                  <div 
                    key={q.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setGachaResult(q);
                        setIsCalibrated(true); 
                        setShowGachaResult(true);
                      }
                    }}
                    className={`aspect-[3/4.2] rounded-xl border flex flex-col items-center justify-center p-2 relative transition-all duration-300 ${isUnlocked ? 'cursor-pointer hover:scale-105 shadow-md active:scale-95' : 'bg-slate-950/40 border-white/5 opacity-30'}`}
                    style={{ 
                      borderColor: isUnlocked ? q.domainColor + '40' : '',
                      backgroundColor: isUnlocked ? q.domainColor + '10' : ''
                    }}
                  >
                    {isUnlocked ? (
                      <>
                        <div className="text-white mb-1">{q.icon}</div>
                        <span className="text-[7px] font-bold text-center text-slate-300 uppercase leading-none truncate max-w-full">
                          {q.domainTitle}
                        </span>
                        <span className="text-[8px] font-black text-amber-500 absolute bottom-1.5 text-center">
                          #{index + 1}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-600 mb-1" />
                        <span className="text-[8px] font-bold text-slate-600 uppercase">
                          #{index + 1}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {discoveredIds.length >= 2 && (
              <div className="bg-gradient-to-tr from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 text-center relative overflow-hidden">
                <h4 className="font-bold text-sm text-amber-400">Move Beyond Pure Assessments</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  You have logged {discoveredIds.length} internal marks. Solidify your real-world blueprint live with us on <strong className="text-white">June 27 & 28, 2026</strong>.
                </p>
                <a 
                  href="https://liveyourmark.com/truself-summit/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-3.5 inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase px-4 py-2 rounded-xl tracking-wider transition-colors"
                >
                  Enter Live TruSelf Summit
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REFLECTION ARCHIVE LOGS */}
        {activeTab === 'journal' && (
          <div className="w-full mt-2 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-slate-300">Self-Discovery Journal</span>
              {journalLogs.length > 0 && (
                <button 
                  onClick={copyJournalToClipboard}
                  className="text-[10px] text-indigo-400 hover:text-white uppercase font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Clipboard className="w-3.5 h-3.5" /> Copy Logs
                </button>
              )}
            </div>

            {/* Privacy Guarantee Card */}
            <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-left flex items-start gap-3 animate-in fade-in">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <h5 className="text-[10px] font-black text-slate-200 uppercase tracking-wider">Privacy Guarantee</h5>
                <p className="text-[9px] text-slate-400 leading-normal mt-0.5 font-sans">
                  The logs shown below are stored locally on your device. We do not maintain any cloud trackers, logging cookies, or database servers. No private details are ever shared.
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {journalLogs.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <BookOpen className="w-8 h-8 mx-auto stroke-[1.5] mb-2 text-slate-600" />
                  <p className="text-xs font-bold uppercase tracking-wider">Empty Log Book</p>
                  <p className="text-xs text-slate-500 mt-1 leading-normal max-w-xs mx-auto">
                    Type a reflection in your result card and save it to begin building your local assessment archive.
                  </p>
                </div>
              ) : (
                journalLogs.map(log => (
                  <div key={log.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5 relative group">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: log.domainColor }} />
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{log.domain}</span>
                      <span className="text-[9px] text-slate-500 font-bold ml-auto">{log.date}</span>
                    </div>

                    <p className="text-xs italic text-slate-400 leading-normal border-l border-white/10 pl-3">
                      "{log.insight || ''}"
                    </p>

                    <p className="text-sm font-bold text-white leading-snug">
                      {log.inquest}
                    </p>

                    {log.courage && (
                      <div className="text-xs font-bold text-amber-500 border border-amber-500/10 bg-amber-500/5 p-2 rounded-xl font-sans">
                        ⚡ Act of Courage: "{log.courage}"
                      </div>
                    )}

                    {log.motto && (
                      <div className="text-[10px] uppercase font-black text-amber-500 tracking-widest">
                        Focus: "{log.motto}"
                      </div>
                    )}

                    <div className="p-3 bg-black/40 rounded-xl text-xs text-indigo-200 border-l border-indigo-500 italic">
                      "{log.reflection}"
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <button 
                        onClick={() => deleteJournalEntry(log.id)}
                        className="text-[9px] text-red-400 hover:text-red-300 uppercase font-black tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete Log
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* DYNAMIC RESULTS POP-UP CARD */}
      {showGachaResult && gachaResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#090D1A]/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => { setShowGachaResult(false); setIsCalibrated(false); }}></div>
          
          <div className="relative bg-[#111526] w-full max-w-md rounded-[35px] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-400 flex flex-col max-h-[90vh]">
            <div className="h-1.5 w-full animate-pulse" style={{ backgroundColor: gachaResult.domainColor }}></div>
            
            <button 
              onClick={() => { setShowGachaResult(false); setIsCalibrated(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 p-2 bg-slate-900/60 hover:bg-slate-800 rounded-full border border-white/10 transition-all cursor-pointer shadow-md"
              title="Close & Return to Machine"
            >
              <X className="w-4 h-4" />
            </button>

            {/* --- REWARDING CALIBRATION VALIDATION OVERLAY SPLASH --- */}
            {isCalibrated ? (
              <div className="p-8 md:p-10 text-white flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 overflow-y-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 animate-bounce">
                  <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase block">TruSelf Calibration Complete</span>
                <h3 className="text-2xl font-black text-slate-100 tracking-tight mt-1 mb-4">ALIGNMENT SEALED</h3>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/5 max-w-sm mb-6 text-left">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {getValidationMessage(gachaResult.domainTitle, reflectionText)}
                  </p>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={downloadManifestationCard}
                    className="py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export Wallpaper
                  </button>
                  <button 
                    onClick={() => { setShowGachaResult(false); setIsCalibrated(false); }}
                    className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-black rounded-2xl uppercase tracking-wider text-[10px] transition-all active:scale-95 cursor-pointer"
                  >
                    Done
                  </button>
                </div>

                {/* Summit Anchor CTA */}
                <div className="pt-4 border-t border-white/5 w-full">
                  <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest block">Join our TruSelf Summit: 27 and 28 June 2026</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                    Reflections highlight the issues; the Summit is where you execute.
                  </p>
                  <a 
                    href="https://liveyourmark.com/truself-summit/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-2 text-xs text-white font-bold hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    Find out more about the TruSelf Summit <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-10 text-white flex flex-col overflow-y-auto">
                
                <div className="flex items-center gap-4 mb-6">
                  <DiverMascot size={56} />
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-amber-500 block">{gachaResult.badge}</span>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white mt-1 leading-none">{gachaResult.domainTitle}</h3>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 block uppercase">CARD INDEX #{ALL_QUESTIONS.findIndex(q => q.id === gachaResult.id) + 1}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest block font-sans">Focus of the Day / Intention:</label>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-bold"
                    value={messageOfTheDay}
                    onChange={(e) => {
                      setMessageOfTheDay(e.target.value);
                      safeLocalStorage.setItem('lym_motd', e.target.value);
                    }}
                  />
                </div>

                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-4 relative font-sans">
                  <span className="absolute -top-2 left-4 px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black tracking-wider text-indigo-400 uppercase">Message of the Day</span>
                  <p className="text-xs leading-relaxed text-slate-300 italic pt-1">
                    "{gachaResult.insight}"
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-950/20 to-black/40 p-5 rounded-2xl border border-indigo-500/15 mb-4 font-sans">
                  <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase block mb-1">Ask Yourself?</span>
                  <p className="text-base font-bold leading-snug text-white">
                    {gachaResult.inquest}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-red-500/5 p-5 rounded-2xl border border-amber-500/20 mb-6 font-sans">
                  <span className="text-[9px] font-black tracking-widest text-red-400 uppercase block mb-1">⚡ Act of Courage ⚡</span>
                  <p className="text-sm font-bold leading-snug text-amber-300">
                    {gachaResult.courage}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Input your raw alignment reflection:</label>
                  <textarea
                    className="w-full bg-[#111526] border border-white/10 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none h-18"
                    placeholder="Your first thought is usually your highest, most honest alignment..."
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <button 
                    onClick={saveReflection}
                    className="py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" /> Save Log
                  </button>
                  <button 
                    onClick={downloadManifestationCard}
                    className="py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export Wallpaper
                  </button>
                </div>

                {/* Conversion Footer updating summit dates and exact CTA requirements without duplicate strings */}
                <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center text-center font-sans">
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Join our TruSelf Summit: 27 and 28 June 2026
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal font-medium text-center">
                    Reflections highlight the issues; the Summit is where you execute.
                  </p>
                  <a 
                    href="https://liveyourmark.com/truself-summit/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-2 text-xs text-white font-bold hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    Find out more about the TruSelf Summit <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* --- STREAK PATTERN DIAGNOSIS MODAL PANEL --- */}
      {showStreakModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#090D1A]/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowStreakModal(false)}></div>
          <div className="relative bg-[#111526] w-full max-w-sm rounded-[35px] overflow-hidden shadow-2xl border border-white/10 p-8 text-white flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => { setShowStreakModal(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 bg-slate-900/60 rounded-full border border-white/10 z-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-4 overflow-y-auto pr-1">
              <DiverMascot size={80} className="mx-auto" />
              <div>
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase block">7-Day Alignment Pattern</span>
                <h3 className="text-xl font-black text-white mt-1 uppercase leading-none">TruSelf Synthesis</h3>
              </div>

              {streakCount >= 7 ? (
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5 text-left text-xs font-sans animate-in zoom-in-95">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">Logged Structural Archetype</span>
                    <h4 className="text-base font-black text-amber-400 font-sans mt-0.5">{currentArchetype.title}</h4>
                    <span className="text-[9px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wider">Dynamic Alignment: {currentArchetype.focus}</span>
                  </div>
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Core Alignment Profile</span>
                    <p className="text-slate-300 leading-relaxed italic text-[11px]">
                      {currentArchetype.desc}
                    </p>
                  </div>
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Tactical Power Strengths</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 leading-normal text-[11px]">
                      {currentArchetype.strengths.map((str, idx) => (
                        <li key={idx} className="pl-1 text-slate-300">{str}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-white/5 pt-3 space-y-1">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">High-Value Blindspot</span>
                    <p className="text-slate-300 leading-normal text-[11px]">
                      {currentArchetype.growth}
                    </p>
                  </div>
                  <div className="border-t border-white/5 pt-3 p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">⚡ Essential Action Directive</span>
                    <p className="text-slate-200 font-bold leading-normal text-[11px]">
                      {currentArchetype.directive}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <button 
                      onClick={downloadArchetypeCard}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Pattern Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-center">
                  <Lock className="w-8 h-8 text-amber-500 mx-auto stroke-[1.5] animate-pulse" />
                  <h4 className="text-sm font-black uppercase text-amber-500">Alignment Diagnosis Locked</h4>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    You have currently completed <strong className="text-white font-bold">{streakCount} out of 7 consecutive days</strong>. Keep drawing marks to align your focal patterns and unlock your synthesis diagnosis!
                  </p>
                  <div className="bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5 mt-2">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${(streakCount / 7) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Privacy guarantee info card */}
              <div className="p-3.5 bg-slate-900/60 border border-emerald-500/10 rounded-xl text-left flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-slate-200 uppercase tracking-wider">Privacy Guarantee</h5>
                  <p className="text-[9px] text-slate-400 leading-normal mt-0.5 font-sans">
                    These generated metrics are processed mathematically inside your secure web client. No telemetry keys or private profiles are transmitted to external servers.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowStreakModal(false)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl uppercase tracking-wider text-[10px] transition-all active:scale-95 cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Footer */}
      <footer className="py-10 opacity-30 text-center text-[10px] font-black uppercase tracking-widest relative z-10">
        Live Your Mark & ECI © 2026
      </footer>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-16px); } 
        } 
        .animate-bounce { animation: bounce 0.14s infinite alternate; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }} />
    </div>
  );
}