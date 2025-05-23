import { $, debounce } from "./helpers";
import { BASE_WIDTH } from "./constants";

const resizeScreen = debounce(() => {
  const bodyElement = $("#root") as HTMLBodyElement;

  const applyZoom =
    window.innerWidth < BASE_WIDTH
      ? Math.round((window.innerWidth / BASE_WIDTH) * 100)
      : 100;

  const style = `zoom: ${applyZoom}%;`;

  bodyElement.setAttribute("style", style);
}, 100);

export default resizeScreen;
