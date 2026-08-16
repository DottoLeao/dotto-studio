"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// GSAP + ScrollTrigger num chunk separado, carregado só depois da hidratação.
// Quem pediu reduced-motion nunca baixa nada disto, e para todo mundo o
// download acontece depois da primeira pintura — o LCP nunca espera por ele.
const MotionRuntime = dynamic(
  () => import("./MotionRuntime").then((m) => m.MotionRuntime),
  { ssr: false },
);

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  let mq: MediaQueryList;
  try {
    mq = window.matchMedia(QUERY);
  } catch {
    return () => {};
  }
  // Reage se a pessoa mudar a preferência do sistema no meio da sessão.
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// A classe é posta pelo script inline no <head>, antes da primeira pintura.
// Ausente = reduced-motion, ou a rede de segurança já devolveu a página.
const getSnapshot = () =>
  document.documentElement.classList.contains("motion");

// No servidor, o estado calmo: assume-se sem movimento e libera-se depois.
// Assim o primeiro frame nunca é uma animação indesejada.
const getServerSnapshot = () => false;

export function MotionGate() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return enabled ? <MotionRuntime /> : null;
}
