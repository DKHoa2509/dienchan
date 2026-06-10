const audio = document.querySelector("#audioPlayer");
const playButton = document.querySelector("#playButton");
const replayButton = document.querySelector("#replayButton");
const loopButton = document.querySelector("#loopButton");
const seekBar = document.querySelector("#seekBar");
const volumeBar = document.querySelector("#volumeBar");
const currentTimeLabel = document.querySelector("#currentTime");
const durationLabel = document.querySelector("#duration");
const statusText = document.querySelector("#statusText");
const screen = document.querySelector(".music-screen");

audio.loop = true;
audio.volume = Number(volumeBar.value);
volumeBar.style.setProperty("--volume", `${Number(volumeBar.value) * 100}%`);

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function updateProgress() {
  const duration = audio.duration || 0;
  const currentTime = audio.currentTime || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  seekBar.value = String(progress);
  seekBar.style.setProperty("--progress", `${progress}%`);
  currentTimeLabel.textContent = formatTime(currentTime);
  durationLabel.textContent = formatTime(duration);
}

function setPlayingState(isPlaying) {
  screen.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "Tạm dừng nhạc" : "Phát nhạc");
  statusText.textContent = isPlaying ? "Đang phát lặp liên tục." : "Đã tạm dừng.";
}

async function togglePlayback() {
  if (audio.paused) {
    try {
      await audio.play();
      setPlayingState(true);
    } catch {
      statusText.textContent = "Trình duyệt cần bạn chạm lại nút Play để bắt đầu.";
    }

    return;
  }

  audio.pause();
  setPlayingState(false);
}

playButton.addEventListener("click", togglePlayback);

replayButton.addEventListener("click", async () => {
  audio.currentTime = 0;
  updateProgress();

  if (audio.paused) {
    await togglePlayback();
  }
});

loopButton.addEventListener("click", () => {
  audio.loop = !audio.loop;
  loopButton.classList.toggle("active", audio.loop);
  loopButton.setAttribute("aria-label", audio.loop ? "Loop đang bật" : "Loop đang tắt");
  statusText.textContent = audio.loop ? "Loop đang bật." : "Loop đã tắt.";
});

seekBar.addEventListener("input", () => {
  const duration = audio.duration || 0;
  audio.currentTime = (Number(seekBar.value) / 100) * duration;
  updateProgress();
});

volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value);
  volumeBar.style.setProperty("--volume", `${audio.volume * 100}%`);
});

audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", () => setPlayingState(true));
audio.addEventListener("pause", () => setPlayingState(false));
audio.addEventListener("ended", updateProgress);

updateProgress();
