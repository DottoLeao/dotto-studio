import type { CaseStudy } from "../types";
import { torreAtiva } from "./torre-ativa";

/**
 * O contador da seção ("CASE 01 / 01") deriva daqui. Adicionar um case
 * atualiza o contador sozinho — nada de número escrito à mão na UI.
 */
export const cases: CaseStudy[] = [torreAtiva];
