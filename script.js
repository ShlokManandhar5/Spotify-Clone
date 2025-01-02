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
async function main() {

    //get the list of all the songs 
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    for (const song of songs) {
        let songName = song.replaceAll("%20", " ").replaceAll("%2C", " ").replaceAll("%26", " ").replaceAll(".mp3", "");

        // Split by multiple delimiters (' - ', 'll', '(', etc.) and take the first part
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

    //play the first song
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener('ontimeupdate', () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
        //The duration variable now holds the duration of the song in seconds
    })
}

main();