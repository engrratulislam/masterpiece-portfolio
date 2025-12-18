/**
 * Types for Dave Gamache-style Parallax Scrolling
 * Based on: http://davegamache.com/parallax/
 */

export type AnimationProperty = 'translateX' | 'translateY' | 'opacity' | 'rotate' | 'scale';

export interface AnimationValue {
  translateX?: number | [number, number];
  translateY?: number | [number, number];
  opacity?: number | [number, number];
  rotate?: number | [number, number];
  scale?: number | [number, number];
}

export interface KeyframeAnimation {
  selector: string;
  translateX?: number | [number, number];
  translateY?: number | [number, number];
  opacity?: number | [number, number];
  rotate?: number | [number, number];
  scale?: number | [number, number];
}

export interface Keyframe {
  wrapper: string;
  duration: string | number; // percentage or pixels
  animations: KeyframeAnimation[];
}

export interface ParallaxConfig {
  keyframes: Keyframe[];
  windowHeight: number;
  windowWidth: number;
}

