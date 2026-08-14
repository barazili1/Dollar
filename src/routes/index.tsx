import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppState } from '@/types';
import { SplashScreen } from '@/components/SplashScreen';
import { LiveWinnerNotifications } from '@/components/LiveWinnerNotifications';
import { LoginPage } from '@/components/LoginPage';
import { ConditionsPage } from '@/components/ConditionsPage';
import { ParticlesBackground } from '@/components/ParticlesBackground';

function App() {
  const [appState, setAppState] = useState<AppState>('splash');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black font-['Cairo',sans-serif] relative overflow-x-hidden">
      <ParticlesBackground />

      
      {/* Dynamic Splash Screen Phase */}
      <AnimatePresence mode="wait">
        {appState === 'splash' && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50"
          >
            <SplashScreen onComplete={() => setAppState('login')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Login or Conditions Phase) */}
      {appState !== 'splash' && (
        <div className="relative min-h-screen flex flex-col">
          
          {/* Dynamic Top-Left Winner Notification Slider System */}
          <LiveWinnerNotifications />

          {/* Main View Transition */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {appState === 'login' && (
                <motion.div
                  key="login-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <LoginPage
                    onGoToConditions={() => setAppState('conditions')}
                  />
                </motion.div>
              )}

              {appState === 'conditions' && (
                <motion.div
                  key="conditions-page"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <ConditionsPage
                    onBackToLogin={() => setAppState('login')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Subdued Footer */}
          <footer className="w-full py-5 border-t border-neutral-900 bg-black/90 text-center text-xs text-neutral-500 font-['Outfit','Cairo',sans-serif]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-black text-white">MR</span>
                <span className="font-black text-[#FFD700]">DOLLAR</span>
                <span className="text-[10px] text-neutral-600">© 2026 All Rights Reserved</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                <Link to="/apple" className="transition-colors hover:text-[#FFBF00]">
                  Apple
                </Link>
                <Link to="/mines" className="transition-colors hover:text-[#FFBF00]">
                  Mines
                </Link>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  الخوادم تعمل بكفاءة 100%
                </span>
                <span>تشفير 256-Bit SSL</span>
              </div>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MR DOLLAR | Premium VIP Scripting Service" },
      {
        name: "description",
        content:
          "MR DOLLAR - سكربت حصري ومتقدم لتفاحة الحظ والألغام مع تفعيل فوري ودعم فني متواصل.",
      },
      { property: "og:title", content: "MR DOLLAR | Premium VIP Scripting Service" },
      {
        property: "og:description",
        content: "سكربت VIP حصري بتفعيل فوري ودعم فني متواصل على مدار الساعة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
