import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TrendingUp, Trophy, Sparkle, Wallet, Zap, HelpCircle, Users, Heart,
  Volume2, VolumeX, Sparkles, Flame, Coins, Bookmark, Calendar, ArrowRight,
  BookOpen, Lock, Download, Clipboard, Trash2, X, RefreshCw
} from 'lucide-react';

// --- THE HARMONIC 56 INTERNAL MARKS DATASET (Balanced Horoscope + Inquest + Courage Mix) ---
const DOMAINS = {
  CREATION_CHOICE: { 
    title: "Creation/Choice", color: "#6366F1", glow: "shadow-indigo-500/10", badge: "🔮 ALIGNMENT INSIGHT", icon: <Sparkle className="w-4 h-4" />, 
    questions: [
      {
        id: "cc_1",
        rarity: "Rare",
        horoscope: "You possess an exceptional, latent capacity to see patterns and pathways where others only see blank walls. Your vision is highly potent, yet you are currently waiting for external confirmation of what your intuition has already validated.",
        inquest: "What is one creative direction you have kept quiet that deserves to be given absolute voice and action today?",
        courage: "Write a 3-sentence summary of your most unconventional idea, and text or email it to a peer, client, or alignment partner right now."
      },
      {
        id: "cc_2",
        rarity: "Common",
        horoscope: "You are currently hiding inside your own intelligence. You are treating 'more planning,' 'more research,' and 'getting ready' as progress, when in reality, it is just a sophisticated, elegant form of hesitation.",
        inquest: "What is the exact thing you are currently overthinking to protect yourself from the discomfort of actually launching it?",
        courage: "Close your research tabs. Draft the absolute simplest MVP version of this concept on a single piece of paper, and share it before your day ends."
      },
      {
        id: "cc_3",
        rarity: "Common",
        horoscope: "You carry a rare, magnetic depth. People feel safer, calmer, and more inspired simply entering your orbit when you show up authentically. You don't need to perform; your raw presence is the contribution.",
        inquest: "Where in your world today can you allow your natural, effortless energy to lead the room?",
        courage: "In your next conversation or meeting, do not prepare what to say. Sit back, listen entirely, and let your raw presence command the space."
      },
      {
        id: "cc_4",
        rarity: "Common",
        horoscope: "You are acting like a spectator in your own life's masterpiece, waiting for an imaginary permission slip from a crowd that is too busy looking at their own feet to give you one.",
        inquest: "If you never received validation or approval from anyone, what would you choose to create next?",
        courage: "Identify the one action step you've been delaying because you're waiting for consensus, and execute it now without asking for permission."
      },
      {
        id: "cc_5",
        rarity: "Common",
        horoscope: "Your inner voice is remarkably sharp right now, humming with pure creative potential. The only block is the static of other people's opinions that you've allowed to crowd your quiet center.",
        inquest: "If you carved out thirty minutes of absolute silence today, what is the first truth your spirit would whisper?",
        courage: "Put all devices on 'Do Not Disturb' for 30 minutes, go for a walk outside, and write down the very first insight that enters your quiet mind."
      },
      {
        id: "cc_6",
        rarity: "Rare",
        horoscope: "You are trying to paint a magnificent, legendary life using safe, comfortable, and predictable colors because you are quietly terrified of making a messy, brilliant mistake.",
        inquest: "What self-imposed rule are you currently following blindly that is actively suffocating your creative freedom?",
        courage: "Intentionally break this minor self-imposed rule today. Write a draft with typos, dress boldly, or pitch an incomplete concept just to break the spell."
      },
      {
        id: "cc_7",
        rarity: "Legendary",
        horoscope: "You have completely outgrown the small container of your current lifestyle. Your restlessness isn't a crisis of failure; it is your immense capacity screaming for a larger, stadium-scale challenge.",
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
        horoscope: "You are moving exceptionally fast, but you are running on a treadmill. You are mistaking movement for momentum and exhaustion for impact. Your spirit is tired because you are pouring power into small, low-leverage games.",
        inquest: "Look closely at your schedule this past week: What fake, comfortable busyness are you manufacturing to avoid doing the high-stakes task that actually scares you?",
        courage: "Block out the first 90 minutes of your morning tomorrow. Shut down all communication channels, and spend that time exclusively on the high-stakes task."
      },
      {
        id: "adv_2",
        rarity: "Common",
        horoscope: "You are a naturally gifted builder with an incredible capacity for deep execution. When you dial into your focus state, you are an absolute force of nature. The only thing missing is a target worthy of your power.",
        inquest: "What is one high-impact plan you can design today that matches the true scale of your execution power?",
        courage: "Define your single most critical milestone for this quarter, write it in big letters on a note, and stick it directly behind your screen."
      },
      {
        id: "adv_3",
        rarity: "Common",
        horoscope: "Your incredibly high standards are a superpower, but they have slowly decayed into silent perfectionism—acting as an elite shield to protect you from being judged.",
        inquest: "Where is your execution currently stalling because you're waiting for 'perfect' instead of taking bold, raw action?",
        courage: "Publish, share, or submit your current 70%-complete draft. Force yourself to get real-world feedback on raw, messy progress."
      },
      {
        id: "adv_4",
        rarity: "Rare",
        horoscope: "You have built a profound foundation of resilience. Every past trial has forged a highly adaptive, powerful mind capable of navigating any storm with total resourcefulness.",
        inquest: "If you trusted your capacity to handle any outcome, what courageous leap would you execute right now?",
        courage: "Make an irreversible public or financial commitment to your leap—buy the ticket, sign the contract, or announce your launch date today."
      },
      {
        id: "adv_5",
        rarity: "Rare",
        horoscope: "You are ignoring a foundational habit bottleneck, expecting grand professional breakthroughs to magically scale over daily chaos.",
        inquest: "Which single daily routine or habit leak is currently acting as the heaviest anchor holding your output back?",
        courage: "Eliminate the choice of backsliding tonight. Install a hard app-blocker, set an automated bedtime, or clear your space of your primary vice immediately."
      },
      {
        id: "adv_6",
        rarity: "Common",
        horoscope: "Your future self is looking back at you with immense pride and gratitude. You are quietly and patiently laying down the hard, unglamorous bricks of a magnificent empire.",
        inquest: "What is one silent, hidden victory from this past week that you haven't fully celebrated yet?",
        courage: "Book a restorative, non-work-related experience for yourself this weekend to intentionally reward your hard work and recharge your vessel."
      },
      {
        id: "adv_7",
        rarity: "Legendary",
        horoscope: "The friction you are feeling in your daily work isn't a sign of failure—it is the violent rejection of your current compromises by a future version of you that is already waiting.",
        inquest: "If you stopped pretending to be satisfied with your current level of execution, who would you have to become today?",
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
        horoscope: "You are exceptionally competitive, but you are running a race designed entirely by other people's expectations, wearing a crown that doesn't actually fit your head.", 
        inquest: "What does genuine 'winning' look like for you in this exact season of your life?",
        courage: "Write down your personal, raw definition of success on a card. Prune three goals from your current list that belong to other people's expectations."
      },
      { 
        id: "ach_2", 
        rarity: "Common", 
        horoscope: "You are highly respected and hold impressive achievements, but you are holding onto your old successes as a shield to avoid the discomfort of your next plateau.", 
        inquest: "Which of your current successes are you using to justify your present stagnation?",
        courage: "Identify one skill or environment where you are currently a complete beginner, and spend 45 minutes practicing or researching it today."
      },
      { 
        id: "ach_3", 
        rarity: "Common", 
        horoscope: "You are designed for cathedral-scale legacy, but you are currently focusing all your power on safe, short-term survival metrics that stifle your brilliance.", 
        inquest: "Are you playing the highest, most high-stakes game available to you in your career?",
        courage: "Decline one low-leverage opportunity or small client today to intentionally force open creative space for a high-value pursuit."
      },
      { 
        id: "ach_4", 
        rarity: "Rare", 
        horoscope: "A past setback has made you play smaller than your stature. You have mistakenly internalized a temporary stumble as a permanent limit.", 
        inquest: "What was a recent 'loss' that actually taught you the exact strategic lesson you need to win now?",
        courage: "Write a detailed post-mortem of that failure. Extract 3 core golden rules, and implement one of them in your current main project today."
      },
      { 
        id: "ach_5", 
        rarity: "Rare", 
        horoscope: "Your energy is incredibly valuable, but you are competing with individuals moving in a completely different direction, wasting your focal power.", 
        inquest: "Who are you competing with, and is that race pulling you toward your highest mark?",
        courage: "Unfollow, mute, or disconnect from 3 competitive accounts that trigger subtle insecurities or comparison metrics on your device today."
      },
      { 
        id: "ach_6", 
        rarity: "Common", 
        horoscope: "Your natural authority is preparing you for a major position of leadership. The people in your ecosystem are quietly waiting for you to step into that command.", 
        inquest: "What grand legacy is your daily work actually building for the next generation?",
        courage: "Spend the next hour creating a modular system, asset, or framework that can outlast your daily manual presence."
      },
      { 
        id: "ach_7", 
        rarity: "Legendary", 
        horoscope: "Your timeline is far too lazy. You are giving yourself decades to execute a vision that you are fully capable of birthing in the next six months.", 
        inquest: "If you achieved your 10-year major life milestone in the next 6 months, who would you have to become today?",
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
        horoscope: "You have a natural gift for spotting opportunities and pulling in resources. However, you are managing your small limits tightly while letting massive leaks in your primary energy drains run completely wild.", 
        inquest: "Where are you currently leaking your primary resources: time, money, or vital energy?",
        courage: "Audit your bank statements. Cancel 3 recurring subscriptions or fees that you have not actively utilized in the last 30 days."
      },
      { 
        id: "res_2", 
        rarity: "Common", 
        horoscope: "Your potential for abundance is massive, but your relationship with wealth is highly conditional. You operate from scarcity even when the metrics show complete safety.", 
        inquest: "How stable is your current financial foundation, rated honestly on a scale of 1-10?",
        courage: "Transfer a specific, small sum of capital into a high-yield savings or investment account today as a physical seed of abundance."
      },
      { 
        id: "res_3", 
        rarity: "Common", 
        horoscope: "You are highly strategic, but you are mistaking high-tech tools, toys, and systems for true leverage and execution capacity.", 
        inquest: "Are you genuinely managing your tools, or are your tools quietly managing your attention?",
        courage: "Uninstall all non-essential productivity apps from your main device, and work out of a single physical notebook for the rest of the day."
      },
      { 
        id: "res_4", 
        rarity: "Rare", 
        horoscope: "You are neglecting to purchase or invest in the exact foundational assets that would instantly unlock your next phase of velocity and speed.", 
        inquest: "What is one material or environmental investment that would immediately double your productivity?",
        courage: "Purchase, upgrade, or authorize the procurement of that exact tool or environment enhancer right now without hesitation."
      },
      { 
        id: "res_5", 
        rarity: "Rare", 
        horoscope: "Your mind holds wealth-generating wisdom, but you are hoarding your ideas instead of letting them circulate, creating a stagnant pool of potential.", 
        inquest: "What is your relationship with 'abundance' vs 'scarcity' right now?",
        courage: "Package one of your highest-value proprietary frameworks, templates, or resources, and share it with your network for free today."
      },
      { 
        id: "res_6", 
        rarity: "Common", 
        horoscope: "You are waiting for the perfect pile of resources to arrive before you take your big leap, ignoring the universal law that resources follow movement.", 
        inquest: "What high-income skill would be the most valuable asset for your future self to possess?",
        courage: "Book a masterclass, acquire a specialized textbook, or schedule a training session for that skill today."
      },
      { 
        id: "res_7", 
        rarity: "Legendary", 
        horoscope: "You are spending capital on temporary comforts while starving the singular, highest-yielding asset that generates everything: your own consciousness.", 
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
        horoscope: "You have an incredible engine of vitality, but you are treating your body like an unpaid slave—demanding infinite output while offering zero restorative recovery.", 
        inquest: "What is the one critical energetic signal your physical body is screaming that you are actively choosing to mute?",
        courage: "Book a physical assessment, clean massage, or comprehensive health check today to address this bottleneck immediately."
      },
      { 
        id: "vit_2", 
        rarity: "Common", 
        horoscope: "Your daily energy is a chaotic rollercoaster because you lack clear boundary filters with your environment. You are absorbing everyone else's static.", 
        inquest: "What is your current energy level, and what is the single biggest silent drain on it?",
        courage: "Put a hard 'Do Not Disturb' lock on your communication channels starting at 7:00 PM tonight. Protect your recovery."
      },
      { 
        id: "vit_3", 
        rarity: "Common", 
        horoscope: "You carry a rare, magnetic glow when you are operating in peak alignment. Lately, you have settled for a diluted, safe version of your physical health.", 
        inquest: "When was the last time you felt truly, vibrantly, and unapologetically alive in your own skin?",
        courage: "Put on your training gear and engage in 30 minutes of high-intensity functional movement or running right now to reset your biological baseline."
      },
      { 
        id: "vit_4", 
        rarity: "Rare", 
        horoscope: "Your physical processing space is cluttered. Your external environment is a direct, living mirror of your current internal static.", 
        inquest: "How is your immediate physical workspace currently affecting your mental clarity?",
        courage: "Spend 20 minutes cleaning and clearing your desk right now until only your computer, note pad, and a glass of water remain."
      },
      { 
        id: "vit_5", 
        rarity: "Rare", 
        horoscope: "You are relying on chemical stimulants instead of designing a high-vibrancy lifestyle that naturally generates power.", 
        inquest: "What is one daily ritual that consistently restores your physical and psychological power?",
        courage: "Commit to going tomorrow without caffeine, processed sugar, or artificial stimulants—relying solely on deep rest and hydration."
      },
      { 
        id: "vit_6", 
        rarity: "Common", 
        horoscope: "You are running your physical engine in the red zone, pretending that burnout is a badge of honor to prove your worth to the world.", 
        inquest: "If your health was a professional project, would it currently be rated 'on track' or 'failing'?",
        courage: "Block out an entire afternoon this weekend to do absolutely nothing productive—guilt-free and screen-free."
      },
      { 
        id: "vit_7", 
        rarity: "Legendary", 
        horoscope: "You are carrying old energetic and emotional toxic loops that cloud your spiritual signal, heavily stalling your execution speed.", 
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
        horoscope: "You have locked your truest creative fires inside a dark closet labeled 'unrealistic' to fit in with safe, predictable society.", 
        inquest: "What brilliant dream did you set aside simply because you were terrified of struggling through its infancy?",
        courage: "Secure the domain, register the draft, or design the raw concept document for this dream before you go to sleep tonight."
      },
      { 
        id: "dr_2", 
        rarity: "Common", 
        horoscope: "You are spending all your days on duty, ignoring the exact creative activities that naturally bend time around your focus.", 
        inquest: "What activity makes you lose track of time entirely when you engage with it?",
        courage: "Schedule a non-negotiable block of 2 hours on your calendar this week dedicated solely to this flow activity."
      },
      { 
        id: "dr_3", 
        rarity: "Common", 
        horoscope: "You are waiting for a mentor or a savior to show you your purpose, forgetting that purpose is actively forged, not passively found.", 
        inquest: "What is one grand contribution you want to be remembered for when your time is up?",
        courage: "Draft your grand, lifelong mission statement in 2 bold sentences, print it, and place it directly on your workspace wall."
      },
      { 
        id: "dr_4", 
        rarity: "Rare", 
        horoscope: "You have let survival needs completely overwrite your creative playground, leaving you dry, intellectual, and uninspired.", 
        inquest: "If money were completely out of the equation, how would you spend your Tuesday morning?",
        courage: "Commit to spending the first 60 minutes of your upcoming Tuesday morning executing exactly that activity."
      },
      { 
        id: "dr_5", 
        rarity: "Rare", 
        horoscope: "You are suppressing your excitement to match the lukewarm temperature of the safe rooms you currently occupy.", 
        inquest: "What currently makes your heart race with pure, unadulterated excitement?",
        courage: "Reach out to one high-energy teammate or partner, and pitch a joint initiative based around this exact excitement."
      },
      { 
        id: "dr_6", 
        rarity: "Common", 
        horoscope: "You are watching other people live out your secret desires on screens, acting as a spectator to your own life's dreams.", 
        inquest: "Whose life are you currently envious of, and what does that tell you about your hidden desires?",
        courage: "Send a brief message of genuine appreciation to that exact person, telling them their journey inspires you, and request a quick 10-minute coffee call."
      },
      { 
        id: "dr_7", 
        rarity: "Legendary", 
        horoscope: "You are choosing safety because you are terrified of the sheer, massive magnitude of your wild, authentic ambitions.", 
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
        horoscope: "You have a deep, loyal heart. However, you are keeping people in your inner circle who applaud your past while silently suffocating your future.", 
        inquest: "Are you surrounding yourself with anchors that drag you down, or rockets that pull you up?",
        courage: "Intentionally mute, distance yourself from, or decline invitations from one long-term acquaintance who drains your focus baseline."
      },
      { 
        id: "pe_2", 
        rarity: "Common", 
        horoscope: "You are tolerating subtle boundaries violations because you are terrified of the temporary friction of clean, honest confrontation.", 
        inquest: "What boundary do you need to set with a key person in your life today?",
        courage: "Send an incredibly polite, clear, and un-apologetic message establishing this boundary, without explaining or softening the impact."
      },
      { 
        id: "pe_3", 
        rarity: "Common", 
        horoscope: "You are carrying old resentments like hot coals, expecting the other person to burn while you damage your own progress and focus.", 
        inquest: "Who are you holding a grudge against, and what is that grudge costing your focus?",
        courage: "Write a raw, unfiltered letter of forgiveness to this person. Burn or delete it. This is for your release, not their approval."
      },
      { 
        id: "pe_4", 
        rarity: "Rare", 
        horoscope: "You are isolated, trying to carry a kingdom-scale vision entirely on your own fragile shoulders to avoid relying on others.", 
        inquest: "Who in your immediate network is currently challenging you to grow to your absolute limit?",
        courage: "Reach out to this exact person and ask: 'What is my greatest operational blindspot that I am currently avoiding?'"
      },
      { 
        id: "pe_5", 
        rarity: "Rare", 
        horoscope: "You are hiding your thoughts from the people who care about you, creating an island of isolation under the guise of strength.", 
        inquest: "What is one thing you have been meaning to say to someone close to you but haven't?",
        courage: "Call or schedule a meet with them today. Speak your absolute raw truth with love, without wrapping it in diplomacy."
      },
      { 
        id: "pe_6", 
        rarity: "Common", 
        horoscope: "You are hoarding your magic, refusing to be the generous leader your community desperately needs.", 
        inquest: "Who is the most generous person you know? How can you emulate them today?",
        courage: "Spend 25 minutes writing a detailed, unsolicited recommendation or public reference of appreciation for a peer or teammate."
      },
      { 
        id: "pe_7", 
        rarity: "Legendary", 
        horoscope: "You are ignoring your primary blindspot because your ego is terrified of losing its defensive armor.", 
        inquest: "What would your closest friend say is your absolute greatest blindspot?",
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
        horoscope: "You have a rare, beautiful soul depth. However, you are confusing your public broadcast armor with authentic presence. People see your shield, not you.", 
        inquest: "How can you develop deeper, unfiltered presence in your interactions today?",
        courage: "Go through your next 3 major conversations without checking your phone, interrupting, or planning your reply."
      },
      { 
        id: "co_2", 
        rarity: "Common", 
        horoscope: "You are surrounded by noise, but completely starved of genuine, quiet, soul-level communion.", 
        inquest: "Who do you need to have a deep, completely honest conversation with right now?",
        courage: "Call them right now and say: 'I was thinking about you, let's skip the small talk—how are you actually doing?'"
      },
      { 
        id: "co_3", 
        rarity: "Common", 
        horoscope: "You are presenting a carefully edited version of yourself, terrified that your raw, unfiltered truth is unlovable.", 
        inquest: "When do you feel most seen and understood by the world?",
        courage: "Share an unedited, raw realization or current struggle with your community or network—let them see your messy draft progress."
      },
      { 
        id: "co_4", 
        rarity: "Rare", 
        horoscope: "You are actively blocking intimacy, using business, humor, or hyper-independence as a defense mechanism to stay safe.", 
        inquest: "How do you currently block intimacy or deep connection when people get close?",
        courage: "Admit one vulnerability, weakness, or struggle to someone close to you today, and explicitly ask for their support."
      },
      { 
        id: "co_5", 
        rarity: "Rare", 
        horoscope: "You are lonely in crowded rooms because you refuse to lower your drawbridge and let anyone in.", 
        inquest: "Where in your life are you lonely, even when people are around?",
        courage: "Secure a seat at a curated physical mastermind, meetup, or physical workspace today where professional posturing is banned."
      },
      { 
        id: "co_6", 
        rarity: "Common", 
        horoscope: "You are waiting for others to be vulnerable first, trapped in an emotional standoff of safety.", 
        inquest: "What would happen if you were 10% more vulnerable today?",
        courage: "Share an honest fear or mistake you made in a recent project with your key collaborator or partner today."
      },
      { 
        id: "co_7", 
        rarity: "Legendary", 
        horoscope: "Your public avatar is thriving, but your private self is neglected, starved of true spiritual alignment.", 
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

// --- VECTOR DEFINITION FOR DEFAULT LYM "BEAN" LOGO ---
const DEFAULT_BEAN_PATH = "M30,10 C50,5 75,15 85,35 C95,55 90,75 70,85 C50,95 25,85 15,65 C5,45 10,15 30,10 Z";

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showGachaResult, setShowGachaResult] = useState(false);
  const [gachaResult, setGachaResult] = useState(null);
  const [leverAngle, setLeverAngle] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('machine'); // 'machine' | 'album' | 'journal'
  const canvasRef = useRef(null);
  const domeCanvasRef = useRef(null);

  // Dynamic state stored in LocalStorage
  const [totalSpins, setTotalSpins] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [coins, setCoins] = useState(3);
  const [journalLogs, setJournalLogs] = useState([]);
  const [reflectionText, setReflectionText] = useState('');
  const [marqueeIndex, setMarqueeIndex] = useState(0);

  // Recharge Countdown Time States
  const [lastRecharge, setLastRecharge] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState('');

  // Personalized Motto & Header Focus of the Day
  const [messageOfTheDay, setMessageOfTheDay] = useState('Sovereignty & Action');

  // Brand Settings: Fixed brand theme color matching luxury slate gold
  const [beanColor] = useState('#D97706');
  
  // Custom uploaded bean source (State preserved to avoid reference crashes)
  const [customBeanImgSrc, setCustomBeanImgSrc] = useState('');

  // Physics-based balls reference for the HTML5 Canvas dome simulation
  const physicsBallsRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  // Setup initial state, load localStorage & auto-migrate data on mount
  useEffect(() => {
    const storedSpins = Number(localStorage.getItem('lym_total_spins') || 0);
    const storedDiscoveries = JSON.parse(localStorage.getItem('lym_discovered_ids') || '[]');
    const storedCoins = localStorage.getItem('lym_gacha_coins');
    const storedJournal = JSON.parse(localStorage.getItem('lym_journal_logs') || '[]');
    const savedMOTD = localStorage.getItem('lym_motd') || 'Sovereignty & Action';
    const savedCustomBean = localStorage.getItem('lym_custom_bean_logo') || '';
    const storedRecharge = localStorage.getItem('lym_last_recharge');

    // Load custom uploaded bean if present in local filing cabinet
    setCustomBeanImgSrc(savedCustomBean);

    // Auto-migrate legacy formats if they exist from older sessions to prevent crashing
    const migratedJournal = storedJournal.map(log => {
      if (log.question && !log.inquest) {
        return {
          ...log,
          inquest: log.question,
          horoscope: log.horoscope || "Focus alignment mark pulled from archive.",
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

    // Initialize 24-hour daily coin recharge timestamps
    let initialRecharge = Date.now();
    if (storedRecharge) {
      initialRecharge = Number(storedRecharge);
    } else {
      localStorage.setItem('lym_last_recharge', String(initialRecharge));
    }
    setLastRecharge(initialRecharge);

    // Calculate coin balance accounting for daily resets
    let initialCoins = 3;
    const msSinceLast = Date.now() - initialRecharge;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (msSinceLast >= twentyFourHours) {
      initialCoins = 3;
      initialRecharge = Date.now();
      localStorage.setItem('lym_gacha_coins', '3');
      localStorage.setItem('lym_last_recharge', String(initialRecharge));
      setLastRecharge(initialRecharge);
    } else if (storedCoins !== null) {
      initialCoins = Number(storedCoins);
    } else {
      localStorage.setItem('lym_gacha_coins', '3');
    }
    setCoins(initialCoins);

    // Initialize 2D physics-engine balls inside the Gacha glass container
    const width = 280;
    const height = 240;
    physicsBallsRef.current = Array.from({ length: 14 }).map((_, i) => {
      const radius = 19 + Math.round(Math.random() * 4); // Big, juicy realistic balls
      return {
        id: i,
        x: radius + Math.random() * (width - radius * 2),
        y: radius + Math.random() * (height / 2),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: radius,
        color: Object.values(DOMAINS)[Math.floor(Math.random() * 8)].color,
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
        localStorage.setItem('lym_gacha_coins', '3');
        localStorage.setItem('lym_last_recharge', String(now));
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
    const canvas = domeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = 280;
    let height = canvas.height = 240;

    const runPhysics = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle backing lighting/vignette inside dome
      const backingGrad = ctx.createRadialGradient(width/2, height/2, 20, width/2, height/2, width/2);
      backingGrad.addColorStop(0, '#1E1B4B44');
      backingGrad.addColorStop(1, '#00000000');
      ctx.fillStyle = backingGrad;
      ctx.fillRect(0, 0, width, height);

      const balls = physicsBallsRef.current;
      const gravity = 0.25;
      const friction = 0.985;
      const bounceRestitution = 0.65;

      // Swirling center coordinates for the vortex
      const centerX = width / 2;
      const centerY = height / 2;

      // Calculate state updates
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        if (isSpinning) {
          // Vortex suction + chaotic agitation forces
          const dx = b.x - centerX;
          const dy = b.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          // Tangential swirl force + lift upwards + random agitation
          const swirlStrength = 2.4;
          b.vx += (-dy / dist) * swirlStrength + (Math.random() - 0.5) * 5;
          b.vy += (dx / dist) * swirlStrength - 0.9 + (Math.random() - 0.5) * 5;
          
          // Speed limit safety cap
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (speed > 16) {
            b.vx = (b.vx / speed) * 16;
            b.vy = (b.vy / speed) * 16;
          }
          
          b.spinSpeed = b.vx * 0.01;
        } else {
          // Standard gravity settling under steady state
          b.vy += gravity;
          b.vx *= friction;
          b.vy *= friction;
          b.spinSpeed *= 0.92;
        }

        // Apply velocities
        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.spinSpeed;

        // Boundary Collisions (Sides & floor)
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx *= -bounceRestitution;
        } else if (b.x + b.radius > width) {
          b.x = width - b.radius;
          b.vx *= -bounceRestitution;
        }

        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy *= -bounceRestitution;
        } else if (b.y + b.radius > height) {
          b.y = height - b.radius;
          b.vy *= -bounceRestitution;
          // Apply horizontal roll friction on ground
          b.vx *= 0.9;
        }

        // Ball-to-Ball Elastic Collisions
        for (let j = i + 1; j < balls.length; j++) {
          const b2 = balls[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b.radius + b2.radius;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);

            // Separate overlapping balls
            b.x -= nx * overlap * 0.5;
            b.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            // Elastic velocity resolution
            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const impulse = 2 * (nx * kx + ny * ky) / 2; // Equal mass model

            b.vx -= impulse * nx * 0.75;
            b.vy -= impulse * ny * 0.75;
            b2.vx += impulse * nx * 0.75;
            b2.vy += impulse * ny * 0.75;

            // Share angular spin torque
            const tempSpin = b.spinSpeed;
            b.spinSpeed = b2.spinSpeed * 0.8;
            b2.spinSpeed = tempSpin * 0.8;
          }
        }

        // --- DRAW SPHERICAL CAPSULE ---
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);

        // Capsule base backing circle
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        // High premium glossy overlay lines
        const glossGrad = ctx.createLinearGradient(-b.radius, -b.radius, b.radius, b.radius);
        glossGrad.addColorStop(0, '#FFFFFF77');
        glossGrad.addColorStop(0.3, '#FFFFFF11');
        glossGrad.addColorStop(0.5, '#00000011');
        glossGrad.addColorStop(1, '#00000099');
        ctx.fillStyle = glossGrad;
        ctx.fill();

        // Gashouse separator seam line
        ctx.beginPath();
        ctx.moveTo(-b.radius, 0);
        ctx.lineTo(b.radius, 0);
        ctx.strokeStyle = '#00000044';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Realistic glass reflection curve arc
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
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isSpinning]);

  // Sound Engine
  const playSound = useCallback((type) => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start(); osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'spin') {
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180 + (i * 20), ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.start(); osc.stop(ctx.currentTime + 0.08);
          }, i * 110);
        }
      } else if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); 
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  }, [isMuted]);

  // Spin core logic (True Randomization with Variety memory)
  const spinGacha = useCallback(() => {
    if (isSpinning) return;
    if (coins <= 0) {
      playSound('click');
      alert(`Daily energy exhausted. Resetting back to 3 pulls in ${timeRemaining || "a few moments"}.`);
      return;
    }

    setIsSpinning(true);
    playSound('spin');
    setLeverAngle(prev => prev + 360);

    // Apply high random impulse forces on physics balls for the vortex churn
    physicsBallsRef.current.forEach(b => {
      b.vx = (Math.random() - 0.5) * 30;
      b.vy = -15 - Math.random() * 20;
    });

    const nextSpinCount = totalSpins + 1;
    
    // Weighted probabilities
    const roll = Math.random() * 100;
    let targetRarity = "Common";
    if (roll > 90) targetRarity = "Legendary";
    else if (roll > 60) targetRarity = "Rare";

    let eligiblePool = ALL_QUESTIONS.filter(q => q.rarity === targetRarity);
    
    // Prevent immediate repeats by filtering out recently pulled IDs
    const recentPulls = JSON.parse(localStorage.getItem('lym_recent_pulls') || '[]');
    let filteredPool = eligiblePool.filter(q => !recentPulls.includes(q.id));
    
    if (filteredPool.length === 0) {
      filteredPool = eligiblePool; 
    }
    if (filteredPool.length === 0) {
      filteredPool = ALL_QUESTIONS; 
    }

    const selectedQuestion = filteredPool[Math.floor(Math.random() * filteredPool.length)];
    
    const nextRecent = [selectedQuestion.id, ...recentPulls].slice(0, 5);
    localStorage.setItem('lym_recent_pulls', JSON.stringify(nextRecent));

    const updatedDiscoveries = discoveredIds.includes(selectedQuestion.id)
      ? discoveredIds
      : [...discoveredIds, selectedQuestion.id];
    const nextCoins = coins - 1;

    setTotalSpins(nextSpinCount);
    setDiscoveredIds(updatedDiscoveries);
    setCoins(nextCoins);
    setReflectionText(''); 

    localStorage.setItem('lym_total_spins', String(nextSpinCount));
    localStorage.setItem('lym_discovered_ids', JSON.stringify(updatedDiscoveries));
    localStorage.setItem('lym_gacha_coins', String(nextCoins));

    setTimeout(() => {
      setGachaResult(selectedQuestion);
      setShowGachaResult(true);
      setIsSpinning(false);
      playSound('success');
    }, 1800);
  }, [isSpinning, totalSpins, discoveredIds, coins, playSound, timeRemaining]);

  // Save Reflection
  const saveReflection = () => {
    if (!gachaResult) return;
    playSound('click');

    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      questionId: gachaResult.id,
      domain: gachaResult.domainTitle,
      domainColor: gachaResult.domainColor,
      badge: gachaResult.badge,
      horoscope: gachaResult.horoscope,
      inquest: gachaResult.inquest,
      courage: gachaResult.courage,
      reflection: reflectionText || "Self-guided reflection session.",
      motto: messageOfTheDay
    };

    const updatedLogs = [newLog, ...journalLogs];
    setJournalLogs(updatedLogs);
    localStorage.setItem('lym_journal_logs', JSON.stringify(updatedLogs));
    localStorage.setItem('lym_motd', messageOfTheDay);
    
    setShowGachaResult(false);
    setReflectionText('');
    alert("Saved successfully to your personal mental journal!");
  };

  const deleteJournalEntry = (id) => {
    playSound('click');
    const updated = journalLogs.filter(log => log.id !== id);
    setJournalLogs(updated);
    localStorage.setItem('lym_journal_logs', JSON.stringify(updated));
  };

  const copyJournalToClipboard = () => {
    playSound('click');
    const text = journalLogs.map(log => 
      `--- ${log.date} | Focus: ${log.motto || 'None'} | [${log.domain}] ---\nObservation: ${log.horoscope}\nInquest: ${log.inquest}\nCourage Step: ${log.courage}\nReflection: ${log.reflection}\n`
    ).join('\n');

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert("Entire reflection archive copied to clipboard!");
  };

  // --- PREMIUM CHIC WALLPAPER GRAPHIC GENERATOR WITH COURAGE STEP ---
  const downloadManifestationCard = () => {
    if (!gachaResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ultra HD Canvas dimensions for high-fidelity mobile wallpapers
    canvas.width = 1200;
    canvas.height = 1800;

    // Background base layer (Luxury deep space black)
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic Luxury Aurora Radial Lighting Glow
    const gradient = ctx.createRadialGradient(600, 900, 100, 600, 900, 900);
    gradient.addColorStop(0, gachaResult.domainColor + '26'); 
    gradient.addColorStop(0.5, '#D977060A'); 
    gradient.addColorStop(1, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Double Gilded Premium Borders
    ctx.strokeStyle = gachaResult.domainColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner gold-threaded delicate line
    ctx.strokeStyle = '#D9770630';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // Corner geometric alignment marks
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

    // Wrapping helper
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

    const drawLogoAndCardText = (startY) => {
      // Header Brand Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 32px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.textAlign = 'center';
      ctx.fillText('TRUSELF SUITE', canvas.width / 2, startY);

      ctx.fillStyle = gachaResult.domainColor;
      ctx.font = 'bold 16px sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('L I V E   Y O U R   M A R K', canvas.width / 2, startY + 36);

      // --- LUXURY PERSONAL FOCUS EMBOSSED GOLD BOARD ---
      const activeMotto = (messageOfTheDay || 'Sovereignty & Action').trim();
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
      ctx.letterSpacing = '0px';
      ctx.fillText(`"${activeMotto}"`, canvas.width / 2, startY + 160);

      // Category Domain Badge
      ctx.fillStyle = gachaResult.domainColor + '1C';
      ctx.fillRect(240, startY + 230, canvas.width - 480, 56);
      ctx.strokeStyle = gachaResult.domainColor + '50';
      ctx.lineWidth = 2;
      ctx.strokeRect(240, startY + 230, canvas.width - 480, 56);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 18px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(`${gachaResult.badge} • ${gachaResult.domainTitle.toUpperCase()}`, canvas.width / 2, startY + 265);

      // --- SECTION 1: MESSAGE OF THE DAY ---
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
      const lastHoroscopeY = wrapText(ctx, `"${gachaResult.horoscope}"`, canvas.width / 2, textStartY + 55, 780, 44);

      // --- SECTION 2: ASK YOURSELF? ---
      const inquestStartY = lastHoroscopeY + 110;
      ctx.fillStyle = '#D97706';
      ctx.font = '900 16px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('ASK YOURSELF?', canvas.width / 2, inquestStartY);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 38px sans-serif';
      const lastInquestY = wrapText(ctx, gachaResult.inquest, canvas.width / 2, inquestStartY + 65, 820, 56);

      // --- SECTION 3: ACT OF COURAGE ---
      const courageStartY = lastInquestY + 110;
      ctx.fillStyle = '#EF4444';
      ctx.font = '900 16px sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('⚡ ACT OF COURAGE ⚡', canvas.width / 2, courageStartY);

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 28px sans-serif';
      const lastCourageY = wrapText(ctx, gachaResult.courage, canvas.width / 2, courageStartY + 60, 820, 44);

      // --- SECTION 4: RAW REFLECTION ---
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

      // Branded Editorial Footer
      ctx.fillStyle = '#FFFFFF22';
      ctx.font = 'bold 14px sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('TRUSELF SUITE ALIGNMENT • LIVE STRATEGY: JUNE 27 & 28', canvas.width / 2, canvas.height - 110);

      // Stream download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `LYM_Inquest_${gachaResult.id}.png`;
      link.href = dataUrl;
      link.click();
      playSound('success');
    };

    // Render original vector organic LYM Bean Seed brand watermark
    ctx.save();
    ctx.translate(600 - 45, 100);
    ctx.scale(0.9, 0.9);
    ctx.fillStyle = beanColor;
    const p = new Path2D(DEFAULT_BEAN_PATH);
    ctx.fill(p);
    ctx.restore();
    drawLogoAndCardText(230);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans select-none relative overflow-x-hidden" style={{ fontFamily: "'Jost', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;600;700;900&display=swap" rel="stylesheet" />
      
      {/* Dynamic ambient backdrop glows */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-indigo-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-amber-600 rounded-full blur-[150px]"></div>
      </div>

      {/* Luxury Minimalist Header Sticky Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 border-b border-white/5 backdrop-blur-md bg-[#0F172A]/40 sticky top-0">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-8 h-8 animate-spin-slow" style={{ fill: beanColor }}>
            <path d={DEFAULT_BEAN_PATH} />
          </svg>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-100 uppercase leading-none">TruSelf Suite</h1>
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-indigo-300 opacity-60 mt-1">Live Your Mark</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-200">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">{coins} Spins</span>
            {coins < 3 && timeRemaining && (
              <span className="text-[10px] text-indigo-300 ml-1 opacity-80 border-l border-white/10 pl-2">
                Reset in {timeRemaining}
              </span>
            )}
          </div>
          
          <button onClick={() => { playSound('click'); setIsMuted(!isMuted); }} className="text-slate-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* AMBIENT ARCADE BILLBOARD MARQUEE (Sleek minimalist announcement feed) */}
      <div className="w-full bg-[#0B0F19]/90 border-b border-white/5 py-2.5 overflow-hidden relative z-40 flex items-center justify-center">
        <div className="text-[10px] font-black tracking-widest text-center text-indigo-300 uppercase opacity-80 px-4">
          {marqueeIndex === 0 && `🔮 MARKS UNLOCKED: ${discoveredIds.length}/56 SOVEREIGN DIALS ARCHIVED 🔮`}
          {marqueeIndex === 1 && `🎪 CO-ACTION: TRUSELF SUMMIT Live • June 27 & 28 • Secure Your Seat Now 🎪`}
          {marqueeIndex === 2 && `⚡ DESIGN WITH DESIGN, NOT COINCIDENCE ⚡`}
        </div>
      </div>

      {/* High-End Editorial Tab Navigation - Fixed z-index & explicit tap activation for perfect click capture */}
      <div className="relative z-50 max-w-sm mx-auto w-full px-6 mt-8 flex justify-between border-b border-white/5 pb-2 pointer-events-auto">
        {['machine', 'album', 'journal'].map((tab) => (
          <button 
            key={tab}
            onClick={() => { playSound('click'); setActiveTab(tab); }}
            className={`text-xs font-bold uppercase tracking-widest transition-all pb-1 cursor-pointer relative z-50 pointer-events-auto ${activeTab === tab ? 'border-b-2 border-amber-500 text-amber-500 font-black' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab === 'machine' ? 'Wheel' : tab === 'album' ? 'Stickers' : 'Journal'}
          </button>
        ))}
      </div>

      {/* Main Workspace */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center py-8 px-6 w-full max-w-md mx-auto">
        
        {/* TAB 1: Sleek, high-fidelity premium physical capsule machine */}
        {activeTab === 'machine' && (
          <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="w-full aspect-[3/4.2] relative max-w-[310px] mt-4">
              
              {/* Luxury Cabinet Body - restored back to a clean capsule container */}
              <div className="w-full h-full bg-white rounded-[45px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-[#1E1B4B] overflow-hidden flex flex-col relative">
                
                {/* Physical Glass Dome with active 2D Canvas Physics */}
                <div className="relative h-[58%] bg-[#F8FAFC] border-b-[10px] border-[#1E1B4B] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1E1B4B]/5 to-[#1E1B4B]/10 pointer-events-none z-10" />
                  <div className="absolute left-3 right-3 top-3 bottom-3 rounded-[35px] bg-slate-200/40 shadow-inner overflow-hidden flex items-center justify-center">
                    <canvas 
                      ref={domeCanvasRef} 
                      className="w-full h-full rounded-[28px] object-cover pointer-events-none"
                    />
                  </div>
                </div>

                {/* Tactile minimalist lever controls */}
                <div className="flex-1 bg-[#1E1B4B] p-4 flex flex-col items-center justify-between relative">
                  
                  {/* Miniature LED Display Panel */}
                  <div className="w-full bg-indigo-950/40 rounded-xl py-1 px-3 text-center border border-indigo-900/40">
                    <span className="text-[9px] font-semibold text-indigo-300 tracking-wider">
                      {isSpinning ? "CONVERGING INTERNAL STATE..." : `PULLS REGISTERED: ${totalSpins}`}
                    </span>
                  </div>

                  {/* Elegant Golden Spin Lever Dial */}
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

                  {/* Clean ball exit gate */}
                  <div className="w-16 h-8 bg-slate-950 rounded-t-xl flex items-center justify-center pb-0.5 border-t border-slate-900">
                    <div className="w-4 h-2 bg-indigo-500/10 rounded-full blur-[3px]" />
                  </div>
                </div>

              </div>
            </div>

            {/* Display Strict Recharge Message when 0 Coins remain */}
            {coins <= 0 && timeRemaining && (
              <div className="mt-5 p-3.5 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl text-center w-full max-w-[280px] animate-pulse">
                <span className="text-[11px] font-bold text-indigo-300 block">⏳ 24h Gacha Battery Empty</span>
                <span className="text-xs text-amber-500 font-mono font-bold mt-1 block">Recharges 3 coins in {timeRemaining}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MINIMALIST STICKER ALBUM GRID */}
        {activeTab === 'album' && (
          <div className="w-full mt-2 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase block">Discovered Marks</span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">Sovereign Library Grid</h3>
              
              {/* Progress Tracker */}
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

            {/* Locked/Unlocked Grid elements */}
            <div className="grid grid-cols-4 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {ALL_QUESTIONS.map((q, index) => {
                const isUnlocked = discoveredIds.includes(q.id);
                return (
                  <div 
                    key={q.id}
                    onClick={() => {
                      if (isUnlocked) {
                        playSound('click');
                        setGachaResult(q);
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

            {/* Direct summit dynamic banner trigger */}
            {discoveredIds.length >= 2 && (
              <div className="bg-gradient-to-tr from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 text-center relative overflow-hidden">
                <h4 className="font-bold text-sm text-amber-400">Move Beyond Pure Assessments</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  You have logged {discoveredIds.length} internal marks. Solidify your real-world blueprint live with us on <strong className="text-white">June 27 & 28</strong>.
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

        {/* TAB 3: DYNAMIC REFLECTION ARCHIVE LOGS */}
        {activeTab === 'journal' && (
          <div className="w-full mt-2 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-slate-300">Self-Discovery Journal</span>
              {journalLogs.length > 0 && (
                <button 
                  onClick={copyJournalToClipboard}
                  className="text-[10px] text-indigo-400 hover:text-white uppercase font-bold flex items-center gap-1"
                >
                  <Clipboard className="w-3.5 h-3.5" /> Copy Logs
                </button>
              )}
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
                      "{log.horoscope}"
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
                        className="text-[9px] text-red-400 hover:text-red-300 uppercase font-black tracking-wider transition-colors flex items-center gap-1.5"
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
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowGachaResult(false)}></div>
          
          <div className="relative bg-[#111526] w-full max-w-md rounded-[35px] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-400 flex flex-col max-h-[90vh]">
            <div className="h-1.5 w-full animate-pulse" style={{ backgroundColor: gachaResult.domainColor }}></div>
            
            {/* Top-Right Quick-Close "X" Button */}
            <button 
              onClick={() => { playSound('click'); setShowGachaResult(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 p-2 bg-slate-900/60 hover:bg-slate-800 rounded-full border border-white/10 transition-all cursor-pointer shadow-md"
              title="Close & Return to Machine"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 md:p-10 text-white flex flex-col overflow-y-auto">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl text-white shadow-lg" style={{ backgroundColor: gachaResult.domainColor }}>
                  {gachaResult.icon}
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-amber-500 block">{gachaResult.badge}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mt-1 leading-none">{gachaResult.domainTitle}</h3>
                  <span className="text-[9px] text-slate-400 font-mono mt-1 block uppercase">CARD INDEX #{ALL_QUESTIONS.findIndex(q => q.id === gachaResult.id) + 1}</span>
                </div>
              </div>

              {/* DYNAMIC PERSONAL MOTTO HEADER FIELD */}
              <div className="space-y-2 mb-4">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest block font-sans">Focus of the Day / Intention:</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-bold"
                  placeholder="e.g. Sovereignty & Speed"
                  value={messageOfTheDay}
                  onChange={(e) => {
                    setMessageOfTheDay(e.target.value);
                    localStorage.setItem('lym_motd', e.target.value);
                  }}
                />
              </div>

              {/* Observation Block: Message of the Day */}
              <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-4 relative font-sans">
                <span className="absolute -top-2 left-4 px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black tracking-wider text-indigo-400 uppercase">Message of the Day</span>
                <p className="text-xs leading-relaxed text-slate-300 italic pt-1">
                  "{gachaResult.horoscope}"
                </p>
              </div>

              {/* Sovereign Inquest Block: Ask Yourself? */}
              <div className="bg-gradient-to-br from-indigo-950/20 to-black/40 p-5 rounded-2xl border border-indigo-500/15 mb-4 font-sans">
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase block mb-1">Ask Yourself?</span>
                <p className="text-base font-bold leading-snug text-white">
                  {gachaResult.inquest}
                </p>
              </div>

              {/* Action Prompt Block: Act of Courage */}
              <div className="bg-gradient-to-br from-amber-500/10 to-red-500/5 p-5 rounded-2xl border border-amber-500/20 mb-6 font-sans">
                <span className="text-[9px] font-black tracking-widest text-red-400 uppercase block mb-1">⚡ Act of Courage ⚡</span>
                <p className="text-sm font-bold leading-snug text-amber-300">
                  {gachaResult.courage}
                </p>
              </div>

              {/* In-Modal reflection inputs */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Input your raw alignment reflection:</label>
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none h-18"
                  placeholder="Your first thought is usually your highest, most honest alignment..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <button 
                  onClick={saveReflection}
                  className="py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <Bookmark className="w-4 h-4" /> Save Log
                </button>

                <button 
                  onClick={downloadManifestationCard}
                  className="py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-wider text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <Download className="w-4 h-4" /> Export Wallpaper
                </button>
              </div>

              {/* Conversion Footer */}
              <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center text-center">
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Next Convergence: June 27 & 28
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal font-medium font-sans">
                  Reflections highlight the issues; the physical room is where you execute. Secure your live experience at the TruSelf Summit.
                </p>
                <a 
                  href="https://liveyourmark.com/truself-summit/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mt-2 text-xs text-white font-bold hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  Claim Summit Pass Seat <ArrowRight className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Brand Footer */}
      <footer className="py-10 opacity-30 text-center text-[10px] font-black uppercase tracking-widest relative z-10">
        Live Your Mark & ECI © 2026
      </footer>

      {/* Hidden Layout canvas used to export graphic wallpapers */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Bouncing Physics parameters */}
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