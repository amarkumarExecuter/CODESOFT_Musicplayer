const audio = document.getElementById("audio");
const musicFile = document.getElementById("musicFile");
const songList = document.getElementById("songList");
const empty = document.getElementById("empty");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const previousBtn = document.getElementById("previous");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");

const currentTime = document.getElementById("current");
const totalTime = document.getElementById("total");

const likeBtn = document.getElementById("likeBtn");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

let songs = [];
let currentSong = -1;
let shuffle = false;
let repeat = false;

musicFile.addEventListener("change", function () {

    const files = Array.from(this.files);

    files.forEach(function(file) {

        if (!file.type.startsWith("audio/")) {
            return;
        }

        const song = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local Artist",
            file: file,
            url: URL.createObjectURL(file),
            favorite: false
        };

        songs.push(song);

    });

    displaySongs();
});

function displaySongs() {

    songList.innerHTML = "";

    if (songs.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    songs.forEach(function(song, index) {

        const div = document.createElement("div");

        div.className = "song";

        div.innerHTML = `
            <div class="song-cover">♪</div>

            <div>
                <div class="song-name">${song.name}</div>
                <div class="song-artist">${song.artist}</div>
            </div>

            <div>Local Audio</div>

            <div>
                <button onclick="playSong(${index})">▶</button>
                <button onclick="favoriteSong(${index})">
                    ${song.favorite ? "♥" : "♡"}
                </button>
                <button onclick="deleteSong(${index})">🗑</button>
            </div>
        `;

        songList.appendChild(div);
    });
}

function playSong(index) {

    if (!songs[index]) {
        return;
    }

    currentSong = index;

    audio.src = songs[index].url;

    songTitle.textContent = songs[index].name;
    artist.textContent = songs[index].artist;

    likeBtn.textContent = songs[index].favorite ? "♥" : "♡";

    audio.play();

    playBtn.textContent = "Ⅱ";
}

playBtn.addEventListener("click", function() {

    if (currentSong === -1) {

        if (songs.length > 0) {
            playSong(0);
        }

        return;
    }

    if (audio.paused) {
        audio.play();
        playBtn.textContent = "Ⅱ";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }

});

nextBtn.addEventListener("click", function() {

    if (songs.length === 0) {
        return;
    }

    let next;

    if (shuffle) {

        next = Math.floor(Math.random() * songs.length);

    } else {

        next = currentSong + 1;

        if (next >= songs.length) {
            next = 0;
        }

    }

    playSong(next);

});

previousBtn.addEventListener("click", function() {

    if (songs.length === 0) {
        return;
    }

    let previous = currentSong - 1;

    if (previous < 0) {
        previous = songs.length - 1;
    }

    playSong(previous);

});

audio.addEventListener("loadedmetadata", function() {

    totalTime.textContent = formatTime(audio.duration);

});

audio.addEventListener("timeupdate", function() {

    if (!audio.duration) {
        return;
    }

    const value = (audio.currentTime / audio.duration) * 100;

    progressBar.value = value;

    currentTime.textContent = formatTime(audio.currentTime);

});

progressBar.addEventListener("input", function() {

    if (!audio.duration) {
        return;
    }

    audio.currentTime =
        (progressBar.value / 100) * audio.duration;

});

volumeBar.addEventListener("input", function() {

    audio.volume = volumeBar.value;

});

document.getElementById("mute").addEventListener("click", function() {

    audio.muted = !audio.muted;

    this.textContent = audio.muted ? "🔇" : "🔊";

});

shuffleBtn.addEventListener("click", function() {

    shuffle = !shuffle;

    this.style.color = shuffle ? "#2563eb" : "";

});

repeatBtn.addEventListener("click", function() {

    repeat = !repeat;

    this.style.color = repeat ? "#2563eb" : "";

});

audio.addEventListener("ended", function() {

    if (repeat) {

        audio.currentTime = 0;
        audio.play();

    } else {

        nextBtn.click();

    }

});

function favoriteSong(index) {

    songs[index].favorite = !songs[index].favorite;

    if (index === currentSong) {
        likeBtn.textContent =
            songs[index].favorite ? "♥" : "♡";
    }

    displaySongs();
}

likeBtn.addEventListener("click", function() {

    if (currentSong !== -1) {
        favoriteSong(currentSong);
    }

});

function deleteSong(index) {

    URL.revokeObjectURL(songs[index].url);

    songs.splice(index, 1);

    if (currentSong === index) {

        audio.pause();
        audio.src = "";

        currentSong = -1;

        songTitle.textContent = "No song selected";
        artist.textContent = "Add a song to play";

        playBtn.textContent = "▶";

    } else if (index < currentSong) {

        currentSong--;

    }

    displaySongs();

}

document.getElementById("search").addEventListener("input", function() {

    const searchText = this.value.toLowerCase();

    const allSongs = document.querySelectorAll(".song");

    allSongs.forEach(function(song) {

        const name =
            song.querySelector(".song-name").textContent.toLowerCase();

        if (name.includes(searchText)) {
            song.style.display = "grid";
        } else {
            song.style.display = "none";
        }

    });

});

document.getElementById("favoriteBtn").addEventListener("click", function() {

    const allSongs = document.querySelectorAll(".song");

    songs.forEach(function(song, index) {

        if (!song.favorite) {
            allSongs[index].style.display = "none";
        } else {
            allSongs[index].style.display = "grid";
        }

    });

    document.getElementById("heading").textContent = "Favorites";

});

document.getElementById("allSongsBtn").addEventListener("click", function() {

    displaySongs();

    document.getElementById("heading").textContent = "All Songs";

});

document.getElementById("recentBtn").addEventListener("click", function() {

    displaySongs();

    document.getElementById("heading").textContent =
        "Recently Added";

});

document.getElementById("darkBtn").addEventListener("click", function() {

    document.body.classList.toggle("dark");

});

function formatTime(seconds) {

    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return minutes + ":" + secs;
}
