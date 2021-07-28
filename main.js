//BUG
//1. Giật lag khi tua bài
//2. Khi chuyển bài thì tự động phát
//3. Repeat and radom button are promoted at the same time
//4. ActiveSong scroll to view

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORED_KEY = 'F8_LAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    songs: [
        {
            name: "Wonderful U (Demo version)",
            singer: "AGA",
            path:
                "asset/sound/WonderfulU.mp3",
            image:
                "https://i.ytimg.com/vi/sqiXHp7BCkg/maxresdefault.jpg"
        },
        {
            name: "Gone",
            singer: "Rose - BlackPink",
            path: "http://www.yazfia.com/wp-content/uploads/2021/04/ROSE-Gone-BLACKPINK-mp3-song-download-320kbps-Audio.mp3",
            image: "https://image.thanhnien.vn/1024/uploaded/hoalp/2021_04_05/rose3_xdqj.png"
        },
        {
            name: "Bao tien mot mo binh yen ?",
            singer: "14 Casper & Bon",
            path: "asset/sound/BaoTienMotMoBinhYen.mp3",
            image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/1/c/3/b/1c3b6283e28b9030d8f6410b210bd765.jpg"
        },
        {
            name: "Em không hiểu",
            singer: "Chang ft Minh Huy",
            path: "asset/sound/Em Khong Hieu - Changg_ Minh Huy.mp3",
            image:
                "https://avatar-ex-swe.nixcdn.com/song/2021/07/06/7/a/3/0/1625546620298_640.jpg"
        },
        {
            name: "I love you 3000 II",
            singer: "Stephanie Poetri",
            path: "asset/sound/I Love You 3000 II - Stephanie Poetri.mp3",
            image:
                "https://i.ytimg.com/vi/a0qC7lG3Vfc/maxresdefault.jpg"
        },
        {
            name: "I miss you",
            singer: "Czarina",
            path: "asset/sound/IMissYou-Czarina.mp3",
            image:
                "https://i.ytimg.com/vi/yvrCd813NCA/maxresdefault.jpg"
        },
        {
            name: "Try",
            singer: "Colbie Caillat",
            path: "asset/sound/Try - Colbie Caillat.mp3",
            image:
                "https://i.ytimg.com/vi/rIMfl1Ka5RU/maxresdefault.jpg"
        },
       
        {
            name: "The Way I Still Love You",
            singer: "Reynard Silva",
            path: "asset/sound/TheWayIStillLoveYou-ReynardSilva.mp3",
            image:
                "https://i.ytimg.com/vi/3BwfmrrAexA/maxresdefault.jpg"
        }
    ],

    config: JSON.parse(localStorage.getItem(PLAYER_STORED_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORED_KEY, this.config)
    },
    
    currentIndex: 1,

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index===this.currentIndex?'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>`
        });

        playList.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function(){
        const cdWidth = cd.offsetWidth;

        //zoom in or out CD when scroll
        document.onscroll = function(){
            scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = (newCdWidth > 0 ? newCdWidth : 0) + 'px';
            cd.style.opacity = (newCdWidth > 56 ? newCdWidth : 0)/cdWidth;
        }

        //CD thumb rotate
        const cdThumbAnimate = cdThumb.animate(
            [
                {transform: 'rotate(360deg)'}
            ],
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause();

        //click on Play button
        playBtn.onclick = function(){
            if(player.classList.contains('playing'))
            {
                audio.pause();
            }
            else
            {
                audio.play();
            }
        }

        audio.onplay = function(){
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function(){
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //When the song is being played
        audio.ontimeupdate = function(){
            progress.value = (audio.currentTime/audio.duration)*100;
        }

        //Change progress of song
        progress.onchange = function(e){
            audio.currentTime = (e.target.value*audio.duration)/100;
        }

        //Click on next button
        nextBtn.onclick = function(){
            if(randomBtn.classList.contains('active')){
                app.randomSong();
            }
            else{
                app.nextSong();
            }
            audio.play();
            app.scrollToActiveSong();
        }
        
        //Click on previous button
        prevBtn.onclick = function(){
            if(randomBtn.classList.contains('active')){
                app.randomSong();
            }
            else{
                app.preSong();
            }

            audio.play();
            app.scrollToActiveSong();
        }

        //Click on random button
        randomBtn.onclick = function(e){
            if(randomBtn.classList.contains('active')){
                randomBtn.classList.remove('active');
            }
            else {
                randomBtn.classList.add('active');
            }
        }

        //Next song when Audio is ended
        audio.onended = function(){
            if(repeatBtn.classList.contains('active')){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }

        //Repeat a song
        repeatBtn.onclick = function(e){
            if(repeatBtn.classList.contains('active')){
                repeatBtn.classList.remove('active');
            }
            else {
                repeatBtn.classList.add('active');
            }
        }

        //Click on a member of plalist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode && !e.target.closest('.option')){
                app.currentIndex = songNode.getAttribute('data-index');
                app.loadCurrentSong();
                app.activeSongOnList();
                audio.play();
            }
            else if(e.target.closest('.option')){
                //Do something when you click on option
            }
            
        }
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.activeSongOnList();
    },

    preSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
        this.activeSongOnList();
    },

    randomSong: function(){
        let newIndex = 0;
        do{
            newIndex = Math.floor(Math.random()*app.songs.length);
        }
        while(newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.activeSongOnList();
    },

    //active (UI) song on playlist
    activeSongOnList: function(){
        const activeSong = $('.playlist .song.active');
        activeSong.classList.remove('active');
        const songList = $$('.song');
        songList[this.currentIndex].classList.add('active');
    },

    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 100);
    },

    start: function(){
        //define properties for object app
        this.defineProperties();

        //handle
        this.handleEvents();

        //load song to UI
        this.loadCurrentSong();

        //render playlist
        this.render();
    },
}

app.start();
