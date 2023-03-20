export class ThruUtilits {
    static addCss(filepath) {
        let lnk = document.createElement('link');
        lnk.rel = 'stylesheet';
        lnk.href = filepath;
        document.head.append(lnk);
    }

    static getSearchValue() {
        let href = decodeURI(window.location.search).replace('?', '').replaceAll('%20',' ').replaceAll('%2C',',').replaceAll('+',' ');
        let params = href.split('&');
        let values = '';
        for(const element of params) {
            if(element.includes('q=')) {
                values = element.replace('q=', '');
                break;
            }
        }

        return values;
    }

    static getTagSearch() {
        let href = decodeURI(window.location.search).replace('?', '').replaceAll('%20',' ').replaceAll('%2C',',').replaceAll('+',' ');
        let params = href.split('&');
        let values = [];
        for(const element of params) {
            if(element.includes('tags=')) {
                values = element.replace('tags=', '').split(',');
                break;
            }
        }
        if(values[0] == '') {
            values = [];
        }

        return values;
    }

    static relativeMousePosition(mousePosition, objectBoundsData) {
        let scrollX = window.scrollX;
        let scrollY = window.scrollY;

        let x = 0;
        let y = 0;

        x = mousePosition.x - objectBoundsData.x;
        y = mousePosition.y - objectBoundsData.y;

        return {
            x: x,
            y: y
        };
    }

    static detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
}