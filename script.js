/*function for the our player*/
const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const muteButton = document.getElementById("mute");

const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const audioFile = document.getElementById("audio-file");

let songs = [];
let currentSong = 0;

audioFile.addEventListener("change", function () {

    songs = Array.from(this.files);

    if (songs.length > 0) {
        loadSong(currentSong);
    }

});

function loadSong(index) {

    const file = songs[index];

    audio.src = URL.createObjectURL(file);

    document.getElementById("song-title").textContent =
        file.name.replace(/\.[^/.]+$/, "");

    document.getElementById("artist").textContent =
        "Local Audio";

    audio.play();

    playButton.textContent = "Ⅱ";
}

playButton.addEventListener("click", function () {

    if (!audio.src) {
        return;
    }

    if (audio.paused) {
        audio.play();
        playButton.textContent = "Ⅱ";
    } else {
        audio.pause();
        playButton.textContent = "▶";
    }

});

nextButton.addEventListener("click", function () {

    if (songs.length === 0) {
        return;
    }

    currentSong++;

    if (currentSong >= songs.length) {
        currentSong = 0;
    }

    loadSong(currentSong);

});

previousButton.addEventListener("click", function () {

    if (songs.length === 0) {
        return;
    }

    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);

});

audio.addEventListener("loadedmetadata", function () {

    duration.textContent = formatTime(audio.duration);

});

audio.addEventListener("timeupdate", function () {

    if (audio.duration) {

        progress.value =
            (audio.currentTime / audio.duration) * 100;

        currentTime.textContent =
            formatTime(audio.currentTime);
    }

});

progress.addEventListener("input", function () {

    if (audio.duration) {

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    }

});

volume.addEventListener("input", function () {

    audio.volume = volume.value;

});

muteButton.addEventListener("click", function () {

    audio.muted = !audio.muted;

    if (audio.muted) {
        muteButton.textContent = "🔇";
    } else {
        muteButton.textContent = "🔊";
    }

});

audio.addEventListener("ended", function () {

    nextButton.click();

});

function formatTime(time) {

    if (isNaN(time)) {
        return "0:00";
    }

    let minutes = Math.floor(time / 60);

    let seconds = Math.floor(time % 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
}
