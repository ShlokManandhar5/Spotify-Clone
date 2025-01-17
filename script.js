
let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // console.log(formattedMinutes, formattedSeconds);
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    // console.log(folder);
    let response = await a.text()
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    //Show all the songs in the playlist
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        let songName = song.replaceAll("%20", " ").replaceAll("%2C", " ").replaceAll("%26", " ");
        let displayName = songName.split(/ - | ll | \( /)[0].trim();
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" src="svgs/music.svg" alt="">
            <div class="info">
                <div>${displayName}</div>  <!-- Display only the part before the delimiter -->
                <div>Kuma Sagar</div>
            </div>
            <div class="playNow">
                <span>Play now</span>
                <img class="invert" src="svgs/play.svg" alt="">
            </div>
        </li>`;
    }

    //attact an event listener to each songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function main() {

    //get the list of all the songs
    await getSongs("songs/kumaSagar");
    // console.log(songs);
    playMusic(songs[0], true);
    // console.log(songs);

    //attact an event listener to play, next and previous buttons
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause.svg";
        } else {
            currentSong.pause();
            play.src = "svgs/play.svg";
        }
    });

    // listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100 + "%"}`;
    });

    // Add an event listener to the seekbarr
    document.querySelector(".seekBar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // Add an event listener to the hamBurger button (to toggle the left part )
    document.querySelector('.hamBurger').addEventListener('click', () => {
        document.querySelector('.left').style.left = "0";
    })

    // Add an event listener to the close button (to toggle the left part )
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = "-120%";
    })

    // Add a event listener to previous and next
    previous.addEventListener("click", () => {
        // console.log("Previous clicked ");
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        // console.log(songs,index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        // console.log("Next clicked ");
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        // console.log(songs,index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            playMusic(songs[0])
        }
    })
    // load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            // playMusic(songs[0]);
        })
    })

}

main();