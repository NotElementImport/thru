import { ThruAudioplayer } from "./thru/thru.audioplayer.js"; 
import { ThruUtilits } from "./thru/thru.utilits.js"; 

let thruObjects = [

];

let id = 0;
window.onload = () => {
    console.log();
    
    ThruUtilits.addCss('/css/thru/thru.css');

    ThruAudioplayer.init();
    document.body.querySelectorAll('audioplayer').forEach(element => {
        if(element.hasAttribute('uid') == false) {
            thruObjects.push(
                ThruAudioplayer.create(element, id)
            );
    
            id += 1;
        }
    });
};