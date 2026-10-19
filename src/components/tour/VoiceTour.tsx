"use client";

import {
  PauseIcon as Pause,
  PlayIcon as Play,
  SkipForwardIcon as SkipForward,
  XIcon as X,
} from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE } from "@/components/motion/variants";
import { TOUR_STEPS, type TourStep } from "./tourData";

export const START_TOUR_EVENT = "voice-tour:start";

export function startVoiceTour() {
  window.dispatchEvent(new Event(START_TOUR_EVENT));
}

const SPOTLIGHT_CLASS = "tour-spotlight";

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// The voice engine reports word timings without punctuation, so pair each
// word of the original sentence with the next timing that matches it.
function captionTokens(step: TourStep) {
  let cursor = 0;
  let last = 0;
  return step.text.split(" ").map((token) => {
    const key = normalize(token);
    const at = step.words.findIndex((w, i) => i >= cursor && key.startsWith(normalize(w.w)));
    if (at !== -1) {
      cursor = at + 1;
      last = step.words[at].t;
    }
    return { token, t: last };
  });
}

export function VoiceTour() {
  const [step, setStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const playStepRef = useRef<(index: number) => void>(() => {});

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    cancelAnimationFrame(rafRef.current);
    document.querySelectorAll(`.${SPOTLIGHT_CLASS}`).forEach((el) => el.classList.remove(SPOTLIGHT_CLASS));
    setStep(null);
    setPlaying(false);
    setTime(0);
  }, []);

  const playStep = useCallback(
    (index: number) => {
      // Sections that render nothing (e.g. no testimonials yet) are skipped.
      let i = index;
      while (i < TOUR_STEPS.length && !document.getElementById(TOUR_STEPS[i].id)) i++;
      if (i >= TOUR_STEPS.length) {
        stop();
        return;
      }

      const data = TOUR_STEPS[i];
      document.querySelectorAll(`.${SPOTLIGHT_CLASS}`).forEach((el) => el.classList.remove(SPOTLIGHT_CLASS));
      const section = document.getElementById(data.id)!;
      section.classList.add(SPOTLIGHT_CLASS);
      section.scrollIntoView({ behavior: "smooth", block: i === 0 ? "start" : "center" });

      audioRef.current?.pause();
      const audio = new Audio(data.audio);
      audioRef.current = audio;
      audio.onended = () => playStepRef.current(i + 1);
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );

      setStep(i);
      setTime(0);
    },
    [stop],
  );

  useEffect(() => {
    playStepRef.current = playStep;
  }, [playStep]);

  useEffect(() => {
    const onStart = () => playStep(0);
    window.addEventListener(START_TOUR_EVENT, onStart);
    return () => {
      window.removeEventListener(START_TOUR_EVENT, onStart);
      audioRef.current?.pause();
      cancelAnimationFrame(rafRef.current);
    };
  }, [playStep]);

  // Track playback position so the caption can highlight the spoken word.
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      if (audioRef.current) setTime(audioRef.current.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, step]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && stop();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, stop]);

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const current = step === null ? null : TOUR_STEPS[step];

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="region"
          aria-label="Voice tour with Arnold"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/10 bg-primary-deep/95 p-4 text-white shadow-2xl backdrop-blur sm:bottom-6 sm:right-28"
        >
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {playing &&
                [0, 1].map((ring) => (
                  <motion.span
                    key={ring}
                    className="absolute inset-0 rounded-full border-2 border-accent"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: ring * 0.8, ease: "easeOut" }}
                  />
                ))}
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-accent">
                <Image src="/arnold-ai-avatar.png" alt="Arnold" fill sizes="56px" className="object-cover" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">Arnold&apos;s voice tour</p>
                <Waveform active={playing} />
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1.5 text-sm leading-relaxed sm:text-base"
                >
                  {captionTokens(current).map((word, i) => (
                    <span
                      key={i}
                      className={`transition-colors duration-150 ${time >= word.t ? "text-white" : "text-white/35"}`}
                    >
                      {word.token}{" "}
                    </span>
                  ))}
                </motion.p>
              </AnimatePresence>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex gap-1.5" aria-label={`Step ${step! + 1} of ${TOUR_STEPS.length}`}>
                  {TOUR_STEPS.map((s, i) => (
                    <motion.span
                      key={s.id}
                      className="h-1.5 rounded-full bg-white/25"
                      animate={{ width: i === step ? 20 : 6, backgroundColor: i <= step! ? "#f0b394" : "rgba(255,255,255,0.25)" }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <TourButton label={playing ? "Pause" : "Play"} onClick={togglePause}>
                    {playing ? <Pause weight="fill" className="h-4 w-4" /> : <Play weight="fill" className="h-4 w-4" />}
                  </TourButton>
                  <TourButton label="Next" onClick={() => playStep(step! + 1)}>
                    <SkipForward weight="fill" className="h-4 w-4" />
                  </TourButton>
                  <TourButton label="End tour" onClick={stop}>
                    <X className="h-4 w-4" />
                  </TourButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TourButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.5, 1, 0.7, 0.9, 0.4].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-accent"
          animate={active ? { height: ["25%", `${h * 100}%`, "25%"] } : { height: "25%" }}
          transition={active ? { duration: 0.6 + i * 0.08, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        />
      ))}
    </span>
  );
}
