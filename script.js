
let currentSong= new Audio();

async function getSongs() {
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text()
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;

}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track;  
    currentSong.play();
    play.src = "svgs/pause.svg";
    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}


async function main() {

    //get the list of all the songs 
    let songs = await getSongs();
    console.log(songs);

    //Show all the songs in the playlist 
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

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
}

main();