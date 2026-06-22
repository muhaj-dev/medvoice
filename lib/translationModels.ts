/**
 * Maps each non-English app language to its QVAC Bergamot NMT model (English→
 * target). Used by lib/qvac.ts → loadTranslationModel to translate the UI
 * catalog on-device. Only the model for the language the user actually picks is
 * ever downloaded/loaded — never all of them.
 */
import {
  downloadAsset,
  BERGAMOT_EN_ES, BERGAMOT_EN_DE, BERGAMOT_EN_IT, BERGAMOT_EN_FR,
  BERGAMOT_EN_PT, BERGAMOT_EN_NL, BERGAMOT_EN_RU, BERGAMOT_EN_UK,
  BERGAMOT_EN_PL, BERGAMOT_EN_CS, BERGAMOT_EN_SK, BERGAMOT_EN_SL,
  BERGAMOT_EN_HR, BERGAMOT_EN_SR, BERGAMOT_EN_BS, BERGAMOT_EN_BG,
  BERGAMOT_EN_RO, BERGAMOT_EN_EL, BERGAMOT_EN_HU, BERGAMOT_EN_FI,
  BERGAMOT_EN_ET, BERGAMOT_EN_LV, BERGAMOT_EN_LT, BERGAMOT_EN_DA,
  BERGAMOT_EN_SV, BERGAMOT_EN_NB, BERGAMOT_EN_IS,
  BERGAMOT_EN_SQ, BERGAMOT_EN_CA, BERGAMOT_EN_AZ, BERGAMOT_EN_TR,
  BERGAMOT_EN_AR, BERGAMOT_EN_FA, BERGAMOT_EN_HE, BERGAMOT_EN_HI,
  BERGAMOT_EN_BN, BERGAMOT_EN_GU, BERGAMOT_EN_KN, BERGAMOT_EN_ML,
  BERGAMOT_EN_TA, BERGAMOT_EN_TE, BERGAMOT_EN_VI,
  BERGAMOT_EN_ID, BERGAMOT_EN_MS, BERGAMOT_EN_ZH, BERGAMOT_EN_JA,
  BERGAMOT_EN_KO,
} from "@qvac/sdk";
import type { Lang } from "@/constants/strings";

type AssetSrc = Parameters<typeof downloadAsset>[0]["assetSrc"];

// English needs no model (it's the source). Every other language maps to its
// en→xx Bergamot pair.
export const TRANSLATION_SRC: Partial<Record<Lang, AssetSrc>> = {
  es: BERGAMOT_EN_ES, de: BERGAMOT_EN_DE, it: BERGAMOT_EN_IT, fr: BERGAMOT_EN_FR,
  pt: BERGAMOT_EN_PT, nl: BERGAMOT_EN_NL, ru: BERGAMOT_EN_RU, uk: BERGAMOT_EN_UK,
  pl: BERGAMOT_EN_PL, cs: BERGAMOT_EN_CS, sk: BERGAMOT_EN_SK, sl: BERGAMOT_EN_SL,
  hr: BERGAMOT_EN_HR, sr: BERGAMOT_EN_SR, bs: BERGAMOT_EN_BS, bg: BERGAMOT_EN_BG,
  ro: BERGAMOT_EN_RO, el: BERGAMOT_EN_EL, hu: BERGAMOT_EN_HU, fi: BERGAMOT_EN_FI,
  et: BERGAMOT_EN_ET, lv: BERGAMOT_EN_LV, lt: BERGAMOT_EN_LT, da: BERGAMOT_EN_DA,
  sv: BERGAMOT_EN_SV, nb: BERGAMOT_EN_NB, is: BERGAMOT_EN_IS,
  sq: BERGAMOT_EN_SQ, ca: BERGAMOT_EN_CA, az: BERGAMOT_EN_AZ, tr: BERGAMOT_EN_TR,
  ar: BERGAMOT_EN_AR, fa: BERGAMOT_EN_FA, he: BERGAMOT_EN_HE, hi: BERGAMOT_EN_HI,
  bn: BERGAMOT_EN_BN, gu: BERGAMOT_EN_GU, kn: BERGAMOT_EN_KN, ml: BERGAMOT_EN_ML,
  ta: BERGAMOT_EN_TA, te: BERGAMOT_EN_TE, vi: BERGAMOT_EN_VI,
  id: BERGAMOT_EN_ID, ms: BERGAMOT_EN_MS, zh: BERGAMOT_EN_ZH, ja: BERGAMOT_EN_JA,
  ko: BERGAMOT_EN_KO,
};
