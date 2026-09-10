import { LanguageCode } from "../types";

export function getLocaleForLanguage(lang: LanguageCode): string {
  switch (lang) {
    case "hi":
      return "hi-IN";
    case "mr":
      return "mr-IN";
    case "ml":
      return "ml-IN";
    case "ta":
      return "ta-IN";
    case "te":
      return "te-IN";
    case "kn":
      return "kn-IN";
    case "gu":
      return "gu-IN";
    case "bn":
      return "bn-IN";
    case "pa":
      return "pa-IN";
    case "en":
    default:
      return "en-IN";
  }
}

export function speakText(
  text: string,
  lang: LanguageCode,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported on this browser.");
    return false;
  }

  // Only cancel if actively speaking or pending to prevent unnecessary interruption events
  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  } catch (err) {
    // Ignore cancel errors
  }

  // Strip markdown formatting for cleaner natural audio
  const cleanText = text
    .replace(/[#*_`~>-]/g, " ")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetLocale = getLocaleForLanguage(lang);
  utterance.lang = targetLocale;
  utterance.rate = 0.95; // Slightly measured rate for clear rural comprehension
  utterance.pitch = 1.0;

  // Attempt to select regional voice if available in browser
  try {
    const voices = window.speechSynthesis.getVoices();
    const regionalVoice = voices.find(
      (v) => v.lang === targetLocale || v.lang.startsWith(targetLocale.split("-")[0])
    );
    if (regionalVoice) {
      utterance.voice = regionalVoice;
    }
  } catch (err) {
    // Voice lookup failure is non-fatal; browser falls back to default voice
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e: any) => {
    // Normal browser lifecycle events:
    // 'canceled' and 'interrupted' occur naturally when user stops playback or initiates new speech
    const errorType = e?.error;
    if (errorType === "canceled" || errorType === "interrupted") {
      if (onEnd) onEnd();
      return;
    }

    if (errorType === "not-allowed") {
      console.warn("Speech audio playback not permitted without direct user interaction in this frame context.");
    } else {
      console.warn("SpeechSynthesis notice:", errorType || "audio event");
    }

    if (onError) onError(e);
    if (onEnd) onEnd();
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn("Failed to initiate speech playback:", e);
    if (onError) onError(e);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

export function createSpeechRecognizer(
  lang: LanguageCode,
  onResult: (text: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = getLocaleForLanguage(lang);

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
