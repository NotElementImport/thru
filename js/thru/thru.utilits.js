export class ThruUtilits {
    static addCss(filepath) {
        let lnk = document.createElement('link');
        lnk.rel = 'stylesheet';
        lnk.href = filepath;
        document.head.append(lnk);
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
}