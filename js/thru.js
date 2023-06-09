import { ThruAudioplayer } from "./thru/thru.audioplayer.js"; 
import { ThruSearch } from "./thru/thru.search.js"; 
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

    ThruSearch.init();
    document.body.querySelectorAll('search').forEach(element => {
        if(element.hasAttribute('uid') == false) {
            thruObjects.push(
                ThruSearch.create(element, id)
            );
    
            id += 1;
        }
    });

    let navLinks = document.body.querySelectorAll('layout aside a');
    let isSelectedLink = false;
    for(let link of navLinks) {
        let href = link.href;
        let alt = link.alt;
        let url = window.location.pathname;
        let icon = link.getAttribute('icon');
        if((href.includes(url) || alt?.includes(url)) && !isSelectedLink) {
            link.classList.add(['active']);
            isSelectedLink = true;
        }
        if(icon)
            link.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
    }
    let button = document.createElement('button');
    button.classList.add(['nav-bar']);
    document.body.appendChild(button);

    let header = document.body.querySelector('header');
    header.setAttribute('opened', 'false');
    let aside = document.body.querySelector('aside');
    aside.setAttribute('opened', 'false');
    button.addEventListener('click', (e) => {
        let val = (aside.getAttribute('opened') == 'true' ? true : false);
        val = !val;

        if(val) {
            aside.style.transform = 'translateX(0%)';
        }
        else {
            aside.style.transform = 'translateX(-100%)';
        }

        aside.setAttribute('opened', val);
    });
    button = document.createElement('button');
    button.addEventListener('click', (e) => {
        let val = (header.getAttribute('opened') == 'true' ? true : false);
        val = !val;

        if(val) {
            header.style.overflow = 'hidden';
            header.style.overflowY = 'hidden';
            header.style.height = 'unset';
            header.style.maxHeight = 'unset';
            header.style.flex = 'unset';
        }
        else {
            header.style.removeProperty('overflow');
            header.style.removeProperty('overflowY');
            header.style.removeProperty('height');
            header.style.removeProperty('max-height');
            header.style.removeProperty('flex');
        }

        header.setAttribute('opened', val);
    });
    button.classList.add(['nav-search']);
    document.body.appendChild(button);
};