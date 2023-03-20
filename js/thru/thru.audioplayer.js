import {ThruUtilits} from "./thru.utilits.js"

/**
 * @typedef {Object} Audioplayer
 * @property {number} time
 */
export class ThruAudioplayer{
    static playedObject = null;

    static init() {
        ThruUtilits.addCss('/css/thru/thru.audioplayer.css');
    }

    static async create(element, id){
        let isElement = element.hasAttribute('compact');

        let audio = document.createElement('audio');
        audio.addEventListener('loadeddata', (e) => {
            audioObject._.enable();
            audioObject.functions.setTime(0);
            console.log('loaded');
        });

        let source = element.querySelectorAll('source');

        element.setAttribute('uid', id);
        let info = document.createElement('div');
            info.classList.add('info');
            element.appendChild(info);
            let infoPicture = document.createElement('div');
                infoPicture.classList.add('picture');
                info.appendChild(infoPicture);
            let infoTitle = document.createElement('div');
                infoTitle.classList.add('title');
                if(!isElement) info.appendChild(infoTitle);   
                let infoTitleNameTitle = document.createElement('span');
                    infoTitleNameTitle.innerHTML = 'Loading...';
                    infoTitle.appendChild(infoTitleNameTitle);
                let infoTitleArtist = document.createElement('span');
                    infoTitleArtist.innerHTML = 'Unknow';
                    infoTitle.appendChild(infoTitleArtist);
            let durationTime = document.createElement('i');
                durationTime.innerHTML = '0:00 / 0:00';
                if(!isElement) info.appendChild(durationTime);

        let timeline = document.createElement('div');
            timeline.classList.add('timeline');
            timeline.addEventListener('click', (e) => {
                let bounds = timeline.getBoundingClientRect();
                let mousePosition = ThruUtilits.relativeMousePosition(
                    {x: e.pageX, y: e.pageY},
                    bounds
                );
                
                audioObject.time = mousePosition.x * (1 / bounds.width);
                audioObject.functions.setTime(audioObject.time);
            });
            if(!isElement) element.appendChild(timeline);
            let fillGap = document.createElement('div');
                fillGap.style.width = '0';
                timeline.appendChild(fillGap);

        let controls = document.createElement('div');
            controls.classList.add('controls');
            if(source.length == 0)
                controls.classList.add(['extend'])
            element.appendChild(controls);
            let lastSong = document.createElement('button');
                lastSong.classList.add(['lastSong']);
                lastSong.addEventListener('click', (e) => {
                    audioObject.functions.previousSong();
                });
                if(source.length > 0) {
                    controls.appendChild(lastSong);
                }
            let play = document.createElement('button');
                play.classList.add(['play']);
                play.addEventListener('click', (e) => {
                    audioObject.functions.toggle();
                });
                controls.appendChild(play);
            let stop = document.createElement('button');
                stop.classList.add(['stop']);
                stop.addEventListener('click', (e) => {
                    audioObject.functions.stop();
                });
                controls.appendChild(stop);
            let nextSong = document.createElement('button');
                nextSong.classList.add(['nextSong']);
                nextSong.addEventListener('click', (e) => {
                    audioObject.functions.nextSong();
                });
                if(source.length > 0) {
                    controls.appendChild(nextSong);
                }
            if(isElement) controls.appendChild(timeline);
            if(isElement) timeline.appendChild(infoTitle);   
            if(isElement) timeline.appendChild(durationTime);   
            let loop = document.createElement('button');
                loop.classList.add(['loop']);
                loop.addEventListener('click', (e) => {
                    audioObject.functions.loop(
                        !audioObject._.loop
                    );
                });
                controls.appendChild(loop);
            let volume = document.createElement('button');
                volume.classList.add(['volume']);
                volume.addEventListener('click', (e) => {
                    audioObject.functions.mute(
                        !audioObject._.muted
                    );
                });
                controls.appendChild(volume);

        let playlist = document.createElement('div');
            playlist.classList.add('playlist');
            if(source.length == 0) {
                playlist.style.display = 'none';
            }
            element.appendChild(playlist);

        audio.addEventListener('timeupdate', (e) => {
            audioObject._.updateGap(audio.currentTime * (1 / audio.duration) * 100);
        });
        audio.addEventListener('ended', (e) => {
            if(audioObject.trackPull.length > 0) {

            }
            else {
                audioObject.functions.stop();
            }
        });

        let audioObject = {
            _ : {
                disabled : true,
                audio : audio,
                loop : false,
                muted : false,
                currentTrackIndex : 0,
                disable : () => {
                    infoTitleNameTitle.innerHTML = 'Loading...';
                    infoTitleArtist.innerHTML = 'Unknow';
                    audioObject._.disabled = true;
                    element.classList.add(['disable']);
                },
                enable : () => {
                    audioObject._.disabled = false;
                    element.classList.remove(['disable']);
                },
                updateGap : (percent) => {
                    fillGap.style.width = `${(percent)}%`;
                    audioObject._._updateTimeline();
                },
                _updateTimeline : () => {
                    if(!audioObject._.disabled) {
                        let currentTimeSeconds = Math.round(audio.currentTime % 60).toString().padStart(2, '0');;
                        let currentTimeMinute = Math.round(audio.currentTime * (1 / 60));

                        let durationSeconds = Math.round(audio.duration % 60).toString().padStart(2, '0');
                        let durationMinutes = Math.round(audio.duration * (1 / 60));
                        
                        durationTime.innerHTML = `${currentTimeMinute}:${currentTimeSeconds} / ${durationMinutes}:${durationSeconds}`;
                    }
                },
                _updateInfo : (author, title, pic = '') => {
                    infoTitleArtist.innerHTML = author;
                    infoTitleNameTitle.innerHTML = title;
                    if(pic != '') {
                        infoPicture.style.backgroundImage = `url('${pic}')`;
                    }
                    else {
                        infoPicture.style.removeProperty('backgroundImage');
                    }
                },
                _updatePlaylist : () => {
                    playlist.innerHTML = '';
                    if(audioObject.trackPull.length > 0) {
                        let unid = 0;
                        for(let x of audioObject.trackPull) {
                            let sourceObject = document.createElement('button');

                            sourceObject.innerHTML = `${x.author} - ${x.title}`;

                            sourceObject.addEventListener('click', (e) => {
                                audioObject.functions.stop();
                                audioObject.functions.loadFile(x.src);
                            });

                            if(unid == 0) {
                                audioObject.functions.stop();
                                audioObject.functions.loadFile(x.src);
                            }
    
                            playlist.appendChild(sourceObject);
                            unid += 1;
                        }
                    }
                }
            },
            trackPull : [

            ],
            time : 0,
            audiofile : {
                name : '',
                duration : 0,
                artist : '',
                title : ''
            },
            name : '',
            functions : {
                toggle : () => {
                    if(audio.paused) {
                        audioObject.functions.play();
                    }
                    else {
                        audioObject.functions.pause();
                    }
                    return !audio.paused;
                },
                play : (time = null) => {
                    if(!audioObject._.disabled) {
                        play.classList.remove(['play']);
                        play.classList.add(['pause']);
                        if(time == null) {
                            audio.play();
                        }
                        else {
                            audioObject.functions.setTime(time);
                            audio.play();
                        }

                        if(ThruAudioplayer.playedObject && ThruAudioplayer.playedObject != audioObject) {
                            if(ThruAudioplayer.playedObject.name == audioObject.name) {
                                ThruAudioplayer.playedObject.functions.pause(); 
                            }
                        }
                        ThruAudioplayer.playedObject = audioObject;
                    }
                    else {
                        console.log('audioObject is disable!');
                    }
                },
                pause : () => {
                    if(!audioObject._.disabled) {
                        audio.pause();
                        play.classList.add(['play']);
                        play.classList.remove(['pause']);
                    }
                },
                stop : () => {
                    if(!audioObject._.disabled) {
                        play.classList.remove(['pause']);
                        play.classList.add(['play']);
                        audio.pause();
                        audioObject.functions.setTime(0);
                    }
                },
                loop : (enable) => {
                    if(!audioObject._.disabled) {
                        loop.setAttribute('enable', enable);
                        audioObject._.loop = enable;
                        audio.loop = enable;
                    }
                },
                mute : (enable) => {
                    if(!audioObject._.disabled) {
                        audioObject._.muted = enable;
                        audio.muted = enable;
                        if(enable) {
                            volume.classList.add(['muted']);
                        }
                        else {
                            volume.classList.remove(['muted']);
                        }
                    }
                },
                nextSong : () => {
                    if(!audioObject._.disabled) {
                        if(audioObject._.currentTrackIndex < audioObject.trackPull.length - 1) {
                            audioObject._.currentTrackIndex += 1;
                            
                            audioObject.functions.stop();
                            audioObject.functions.loadFile(
                                audioObject.trackPull[audioObject._.currentTrackIndex].src
                            );
                        }
                    }
                },
                previousSong : () => {
                    if(!audioObject._.disabled) {
                        if(audioObject._.currentTrackIndex > 0) {
                            audioObject._.currentTrackIndex -= 1;
                            
                            audioObject.functions.stop();
                            audioObject.functions.loadFile(
                                audioObject.trackPull[audioObject._.currentTrackIndex].src
                            );
                        }
                    }
                },
                getMetaData : async (src) => {
                    return await fetch(src)
                    .then(e => e.blob())
                    .then(e => e.text())
                    .then(e => {
                        let title = '';
                        let author = '';
                        let text = e.match(/TIT2([\w\d-\W]*)TYER/gm)[0];
                        if(text != null) {
                            text = text.replace('\u0000\u0000\u0000\u001c\u0000\u0000\u0000', '')
                                .replace('TIT2', '')
                                .replace('TYER','');
                            title = text.trim();

                            if(title == '')
                                title = "Untitled"; 
                        }
                        text = e.match(/TPE1([\w\d-\W]*)TIT2/gm)[0];
                        if(text != null) {
                            text = text.replace('\u0000\u0000\u0000\u001c\u0000\u0000\u0000', '')
                                .replace('TPE1', '')
                                .replace('TIT2','');
                            author = text.trim();
                            if(author == '')
                                author = "Unknow"; 
                        }

                        return {title: title, author: author};
                    });
                },
                loadFile : (src) => {
                    audioObject._.updateGap(0);
                    audioObject._.disable();
                    audio.src = src;
                    audio.load();
                    fetch(src)
                        .then(e => e.blob())
                        .then(e => e.text())
                        .then(e => {
                            let text = e.match(/TIT2([\w\d-\W]*)TYER/gm)[0];
                            if(text != null) {
                                text = text.replace('\u0000\u0000\u0000\u001c\u0000\u0000\u0000', '')
                                    .replace('TIT2', '')
                                    .replace('TYER','');
                                audioObject.audiofile.title = text.trim();

                                if(audioObject.audiofile.title == '')
                                    audioObject.audiofile.title = "Untitled"; 

                                infoTitleNameTitle.innerHTML = audioObject.audiofile.title;
                            }
                            text = e.match(/TPE1([\w\d-\W]*)TIT2/gm)[0];
                            if(text != null) {
                                text = text.replace('\u0000\u0000\u0000\u001c\u0000\u0000\u0000', '')
                                    .replace('TPE1', '')
                                    .replace('TIT2','');
                                audioObject.audiofile.artist = text.trim();
                                if(audioObject.audiofile.artist == '')
                                    audioObject.audiofile.artist = "Unknow"; 

                                infoTitleArtist.innerHTML = audioObject.audiofile.artist;
                            }
                        });
                },
                setTime : (time = 0) => {
                    if(!audioObject._.disabled) {
                        audioObject._.updateGap(time * 100)
                        audio.currentTime = (audio.duration * time);
                        audioObject.time = time;
                    }
                }
            }
        };

        audioObject._.disable();

        let srcAudio = element.getAttribute('src');
        if(srcAudio)
            audioObject.functions.loadFile(srcAudio);

        let name = element.getAttribute('name');
        if(name)
            audioObject.name = name;

        for(let audiosource of source) {
            let objectPlaylist = {
                author : '',
                title : '',
                src : '',
                pic : ''
            };
            let dataMeta = await audioObject.functions.getMetaData(audiosource.src);
            objectPlaylist.author = dataMeta.author;
            objectPlaylist.title = dataMeta.title;
            objectPlaylist.src = audiosource.src;

            audioObject.trackPull.push(objectPlaylist);
        }

        audioObject._._updatePlaylist();

        return audioObject;
    }
}