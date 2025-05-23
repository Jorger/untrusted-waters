import { Howl } from "howler";
import explode from "../assets/explode.mp3";
import fire from "../assets/fire.mp3";
import type { Sounds, TESounds } from "../interfaces";
import water from "../assets/water.mp3";

const SOUNDS: Sounds = {
  EXPLODE: new Howl({
    src: [explode],
  }),
  FIRE: new Howl({
    src: [fire],
  }),
  WATER: new Howl({
    src: [water],
  }),
};

export const playSound = (type: TESounds) => {
  SOUNDS[type].play();
};
