const shutterAudio = new Audio(import.meta.env.BASE_URL + "camera-click.mp4");
shutterAudio.preload = "auto";

export function playShutter() {
  try {
    shutterAudio.currentTime = 0;
    shutterAudio.play();
  } catch (e) {}
}
