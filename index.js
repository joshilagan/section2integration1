//Get Artist Name displayed on the page then assign artist name to variable
const artistName = document.querySelector('.artist').textContent;


const API_KEY = '28e6d09161msh447eec6e356c7d9p1f9b7djsnd2f167725cca';
const URL_SEARCH = 'https://genius-song-lyrics1.p.rapidapi.com/search/';
const URL_LYRICS = 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/';
const headerObj = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
  };

//use artist name variable in the params query
//use the API key variable in the RapidAPI Key header
const geniusArtist = {
  method: 'GET',
  url: URL_SEARCH ,
  params: {
    q: artistName,
    per_page: '10',
    page: '1'
  },
  headers: headerObj
};



//Display the lyrics and song name
const importLyrics = async () => {

  //Fetched SongID
  const geniusArtistID = await axios.request(geniusArtist); 
  const songID = geniusArtistID.data.hits[0].result.id;

  //Get Lyrics API and use the Song ID to params
  const geniusLyrics = {
    method: 'GET',
    url: URL_LYRICS,
    params: {id: songID},
    headers: headerObj
    };

  //Fetch Song name and update the DOM
    
    document.querySelector('.song-name').textContent = geniusArtistID.data.hits[0].result.title;

  //Fetch lyrics and update the DOM
    const res = await axios.request(geniusLyrics);
    document.getElementById('lyrics').innerHTML= res.data.lyrics.lyrics.body.html;
   
  }

//import lyrics function displays song name and lyrics on load
function init(){
  document.addEventListener('DOMContentLoaded', importLyrics);
}
init()




let currentMusic = 0;
const music = document.querySelector('#audio')

const seekBar  = document.querySelector('.seek-bar')
const songName = document.querySelector('.song-name')

const currentTime = document.querySelector('.start-time')
const musicDuration = document.querySelector('.running-time')
const playBtn = document.querySelector('.play')
const forwardBtn = document.querySelector('.forward-btn')
const backwardBtn = document.querySelector('.back-btn')

  
//toggles the play button to play and pause music onclick
playBtn.addEventListener('click', () => {
  if (playBtn.className.includes('pause')){
    music.play();
  } else{
    music.pause();
  }
  
  playBtn.classList.toggle('pause');
})

//fetch music data
fetch('./data.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    
//loads up the song data from data.json
const setMusic = (i) => {
  seekBar.value = 0; //set range slide value to 0
  let song = data[i];
  
  currentMusic = i;
  music.src = song.path; 
    //sets song details
  songName.innerHTML = song.name;
  artistName.innerHTML = song.artist;
    //initialize current time
  currentTime.innerHTML = '00:00';
  setTimeout(() =>{
    seekBar.max = music.duration;
    
    musicDuration.innerHTML = formatTime(music.duration);
  }, 300)
}
//set initial song to index 0
setMusic(0)

const formatTime = (time) => {
  let min = Math.floor(time/60);
  if (min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor (time % 60);
  if(sec < 10) {
    sec = `0${sec}`;
  }
  return  `${min} : ${sec}`
}

//seek bar
setInterval(() =>{
  seekBar.value = music.currentTime;
  currentTime.innerHTML = formatTime(music.currentTime)
}, 300)

//play next song when current song ends
music.addEventListener('ended', () => {    
    music.pause();
    if(currentMusic >= data.length -1)  {
        currentMusic = 0;
      } else {
        currentMusic ++;
      }
      setMusic(currentMusic);
    music.play();
  });

//moves the song currentTime if you move the seekbar
seekBar.addEventListener('change', () => {
  music.currentTime = seekBar.value;
})

//play the music and remove pause classname
const playMusic = () => {
  music.play();
  playBtn.classList.remove('pause');

}

//forward and backward button
forwardBtn.addEventListener('click', () => {
  if(currentMusic >= data.length -1)  {
    currentMusic = 0;
  } else {
    currentMusic ++;
  }
  setMusic(currentMusic);
  playMusic();
  }
)
backwardBtn.addEventListener('click', () => {
  if(currentMusic <= 0)  {
    currentMusic = data.length - 1;
  } else {
    currentMusic --;
  }
  setMusic(currentMusic);
  playMusic();
  }
)
});   