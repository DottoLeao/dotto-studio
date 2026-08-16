"use client";

/* eslint-disable no-restricted-imports -- este é o único ponto de registro */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// Escopo de módulo: ES modules avaliam uma vez por bundle, então isto é
// inerentemente "uma vez só" — sem guard, sem corrida com useEffect.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

// Um resize causado pela barra de endereço do celular colapsando não deve
// disparar refresh no meio da rolagem.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
