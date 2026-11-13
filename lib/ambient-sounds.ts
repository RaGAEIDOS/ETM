/**
 * Ambient sound engine for the Pomodoro timer.
 *
 * All five sounds (rain / night / ocean / deep space / campfire) are
 * SYNTHESIZED LIVE with the Web Audio API. There are no audio files and no
 * external streams involved — nothing to download, license, or re-host.
 * Playback only ever starts from a user gesture (clicking a sound chip);
 * nothing autoplays.
 */

export type AmbientKind = "rain" | "night" | "ocean" | "space" | "fire";

export interface AmbientSound {
  id: AmbientKind;
  /** Short bilingual label shown on the picker chips. */
  name: Record<"ar" | "en", string>;
}

export const AMBIENTS: readonly AmbientSound[] = [
  { id: "rain", name: { ar: "مطر", en: "Rain" } },
  { id: "night", name: { ar: "صوت الليل", en: "Night" } },
  { id: "ocean", name: { ar: "موج بحر", en: "Ocean waves" } },
  { id: "space", name: { ar: "صوت فراغ", en: "Deep space" } },
  { id: "fire", name: { ar: "نار مخيم", en: "Campfire" } },
] as const;

export function isAmbientKind(value: unknown): value is AmbientKind {
  return typeof value === "string" && AMBIENTS.some((s) => s.id === value);
}

interface VoiceNodes {
  nodes: AudioNode[];
  /** Sources that must be explicitly started. */
  sources: AudioBufferSourceNode[];
  oscillators: OscillatorNode[];
  /** Extra cleanup (timers) in addition to disconnecting nodes. */
  dispose?: () => void;
}

function makeNoiseBuffer(
  ctx: AudioContext,
  kind: "white" | "brown",
  seconds = 2
): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  if (kind === "white") {
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
  } else {
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5; // boost brown-noise energy
    }
  }
  return buffer;
}

function loopSource(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

function rampTo(ctx: AudioContext, gain: GainNode, value: number, seconds = 0.4) {
  gain.gain.setTargetAtTime(value, ctx.currentTime, seconds / 3);
}

/** Chain every provided node to the master gain and collect them for cleanup. */
function chain(nodes: AudioNode[], master: GainNode): AudioNode[] {
  for (let i = 0; i < nodes.length - 1; i += 1) {
    nodes[i].connect(nodes[i + 1]);
  }
  nodes[nodes.length - 1].connect(master);
  return nodes;
}

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private active: VoiceNodes | null = null;
  private current: AmbientKind | null = null;
  private volume = 0.5;

  private ensureGraph(): { ctx: AudioContext; master: GainNode } {
    if (!this.ctx || !this.master) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) throw new Error("Web Audio API unavailable");
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return { ctx: this.ctx, master: this.master };
  }

  get currentSound(): AmbientKind | null {
    return this.current;
  }

  start(kind: AmbientKind) {
    if (this.current === kind && this.active) return;
    this.stop();
    const { ctx, master } = this.ensureGraph();
    const voice = this.build(ctx, master, kind);
    for (const src of voice.sources) src.start();
    for (const osc of voice.oscillators) osc.start();
    this.active = voice;
    this.current = kind;
  }

  stop() {
    if (!this.active) {
      this.current = null;
      return;
    }
    this.active.dispose?.();
    for (const src of this.active.sources) {
      try {
        src.stop();
      } catch {
        // already stopped
      }
    }
    for (const osc of this.active.oscillators) {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    }
    for (const node of this.active.nodes) {
      try {
        node.disconnect();
      } catch {
        // disconnected already
      }
    }
    this.active = null;
    this.current = null;
  }

  setVolume(value: number) {
    this.volume = Math.min(1, Math.max(0, value));
    if (this.ctx && this.master) {
      rampTo(this.ctx, this.master, this.volume, 0.2);
    }
  }

  /** Stop everything and release the AudioContext (call on unmount). */
  dispose() {
    this.stop();
    const ctx = this.ctx;
    this.ctx = null;
    this.master = null;
    if (ctx) void ctx.close().catch(() => {});
  }

  private build(
    ctx: AudioContext,
    master: GainNode,
    kind: AmbientKind
  ): VoiceNodes {
    switch (kind) {
      case "rain":
        return this.buildRain(ctx, master);
      case "night":
        return this.buildNight(ctx, master);
      case "ocean":
        return this.buildOcean(ctx, master);
      case "space":
        return this.buildSpace(ctx, master);
      case "fire":
        return this.buildFire(ctx, master);
    }
  }

  /** Steady rain: white noise, high-passed body + low-passed top. */
  private buildRain(ctx: AudioContext, master: GainNode): VoiceNodes {
    const noise = makeNoiseBuffer(ctx, "white", 4);
    const src = loopSource(ctx, noise);
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 420;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 2400;
    lowpass.Q.value = 0.4;
    const body = ctx.createGain();
    body.gain.value = 0.34;
    const nodes = chain([src, highpass, lowpass, body], master);
    return { nodes, sources: [src], oscillators: [] };
  }

  /** Night: very low wind bed + sparse synthesized cricket chirps. */
  private buildNight(ctx: AudioContext, master: GainNode): VoiceNodes {
    const brown = makeNoiseBuffer(ctx, "brown", 4);
    const src = loopSource(ctx, brown);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 210;
    lowpass.Q.value = 0.6;
    const wind = ctx.createGain();
    wind.gain.value = 0.32;
    const nodes = chain([src, lowpass, wind], master);

    // Crickets: little 3–5 pulse chirp bursts, randomly scheduled.
    let disposed = false;
    let timer: number | null = null;
    const chirp = () => {
      if (disposed) return;
      const now = ctx.currentTime;
      const freq = 3900 + Math.random() * 700;
      const pulses = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < pulses; i += 1) {
        const t = now + i * 0.075;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.028, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0006, t + 0.055);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.06);
        osc.onended = () => {
          osc.disconnect();
          g.disconnect();
        };
      }
      timer = window.setTimeout(chirp, 350 + Math.random() * 1900);
    };
    timer = window.setTimeout(chirp, 250);

    return {
      nodes,
      sources: [src],
      oscillators: [],
      dispose: () => {
        disposed = true;
        if (timer !== null) window.clearTimeout(timer);
      },
    };
  }

  /** Ocean: brown noise swelling and receding with a slow LFO pair. */
  private buildOcean(ctx: AudioContext, master: GainNode): VoiceNodes {
    const brown = makeNoiseBuffer(ctx, "brown", 5);
    const src = loopSource(ctx, brown);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 620;
    lowpass.Q.value = 0.8;
    const swell = ctx.createGain();
    swell.gain.value = 0.3;
    const nodes = chain([src, lowpass, swell], master);

    const lfoGainWave = ctx.createOscillator();
    lfoGainWave.type = "sine";
    lfoGainWave.frequency.value = 0.075; // ~13s wave period
    const lfoGainDepth = ctx.createGain();
    lfoGainDepth.gain.value = 0.2;
    lfoGainWave.connect(lfoGainDepth);
    lfoGainDepth.connect(swell.gain);

    const lfoFilter = ctx.createOscillator();
    lfoFilter.type = "sine";
    lfoFilter.frequency.value = 0.052;
    const lfoFilterDepth = ctx.createGain();
    lfoFilterDepth.gain.value = 260;
    lfoFilter.connect(lfoFilterDepth);
    lfoFilterDepth.connect(lowpass.frequency);

    nodes.push(lfoGainDepth, lfoFilterDepth);
    return {
      nodes,
      sources: [src],
      oscillators: [lfoGainWave, lfoFilter],
    };
  }

  /** Deep space: slow detuned sub drone + a very faint filtered shimmer. */
  private buildSpace(ctx: AudioContext, master: GainNode): VoiceNodes {
    const nodes: AudioNode[] = [];
    const oscillators: OscillatorNode[] = [];

    const sub1 = ctx.createOscillator();
    sub1.type = "sine";
    sub1.frequency.value = 54;
    const sub1Gain = ctx.createGain();
    sub1Gain.gain.value = 0.085;
    sub1.connect(sub1Gain);
    sub1Gain.connect(master);
    nodes.push(sub1Gain);
    oscillators.push(sub1);

    const sub2 = ctx.createOscillator();
    sub2.type = "sine";
    sub2.frequency.value = 54.5; // slow beating with sub1
    const sub2Gain = ctx.createGain();
    sub2Gain.gain.value = 0.085;
    sub2.connect(sub2Gain);
    sub2Gain.connect(master);
    nodes.push(sub2Gain);
    oscillators.push(sub2);

    const lowMid = ctx.createOscillator();
    lowMid.type = "triangle";
    lowMid.frequency.value = 108.3;
    const lowMidGain = ctx.createGain();
    lowMidGain.gain.value = 0.025;
    lowMid.connect(lowMidGain);
    lowMidGain.connect(master);
    nodes.push(lowMidGain);
    oscillators.push(lowMid);

    // Faint, slow-moving shimmer high above the drone
    const white = makeNoiseBuffer(ctx, "white", 3);
    const src = loopSource(ctx, white);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 840;
    bandpass.Q.value = 9;
    const shimmer = ctx.createGain();
    shimmer.gain.value = 0.012;
    const shimmerNodes = chain([src, bandpass, shimmer], master);
    nodes.push(...shimmerNodes);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.03;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 420;
    lfo.connect(lfoDepth);
    lfoDepth.connect(bandpass.frequency);
    nodes.push(lfoDepth);
    oscillators.push(lfo);

    return { nodes, sources: [src], oscillators };
  }

  /** Campfire: soft brown-noise bed + random crackle pops. */
  private buildFire(ctx: AudioContext, master: GainNode): VoiceNodes {
    const brown = makeNoiseBuffer(ctx, "brown", 4);
    const src = loopSource(ctx, brown);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 300;
    lowpass.Q.value = 0.5;
    const bed = ctx.createGain();
    bed.gain.value = 0.3;
    const nodes = chain([src, lowpass, bed], master);

    // Crackle: random short white-noise pops through a mid bandpass.
    let disposed = false;
    let timer: number | null = null;
    const pop = () => {
      if (disposed) return;
      const now = ctx.currentTime;
      const len = Math.floor(ctx.sampleRate * (0.02 + Math.random() * 0.07));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) {
        const envelope = 1 - i / len;
        data[i] = (Math.random() * 2 - 1) * envelope * envelope;
      }
      const popSrc = ctx.createBufferSource();
      popSrc.buffer = buf;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 1200 + Math.random() * 2200;
      bandpass.Q.value = 1.6;
      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.16 + Math.random() * 0.2, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      popSrc.connect(bandpass);
      bandpass.connect(popGain);
      popGain.connect(master);
      popSrc.start(now);
      popSrc.onended = () => {
        popSrc.disconnect();
        bandpass.disconnect();
        popGain.disconnect();
      };
      timer = window.setTimeout(pop, 45 + Math.random() * 240);
    };
    timer = window.setTimeout(pop, 180);

    return {
      nodes,
      sources: [src],
      oscillators: [],
      dispose: () => {
        disposed = true;
        if (timer !== null) window.clearTimeout(timer);
      },
    };
  }
}
