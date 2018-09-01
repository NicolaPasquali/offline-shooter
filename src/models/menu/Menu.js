import MenuItem from './MenuItem';

export default class Menu {
    constructor(kontra) {
        this.kontra = kontra;
        this._items = [
            new MenuItem(kontra, 'Write Code', 125, 465, () => {
                console.log('Writing code!');
            }),
            new MenuItem(kontra, 'Debug', 370, 465, () => {
                console.log('Debugging!');
            }),
            new MenuItem(kontra, 'Meditate', 680, 465, () => {
                console.log('Meditating!');
            }),
            new MenuItem(kontra, 'Meeting', 125, 545, () => {
                console.log('In a meeting!');
            }),
            new MenuItem(kontra, 'Pair Programming', 370, 545, () => {
                console.log('Doing pair programming!');
            }),
            new MenuItem(kontra, 'Procrastinate', 680, 545, () => {
                console.log('Procrastinating!');
            })
        ];
        this._borderSprite = this._createMenuBorderSprite();
        this._backgroundSprite = this._createMenuSprite();
        this._selectedItem = 0;
        this._selectorSprite = this._createSelectorSprite();
    }

    // 900x585
    _createMenuBorderSprite() {
        return kontra.sprite({
            x: 0,
            y: 400,
            color: 'gold',
            width: kontra.canvas.width,
            height: 185
        });
    }

    _createMenuSprite() {
        return kontra.sprite({
            x: 20,
            y: 420,
            color: 'blue',
            width: kontra.canvas.width - 40,
            height: 145
        });
    }

    _createSelectorSprite() {
        return kontra.sprite({
            x: this._items[this._selectedItem].x - 25,
            y: this._items[this._selectedItem].y - 15,
            color: 'white',
            width: 10,
            height: 10
        });
    }

    render() {
        this._borderSprite.render();
        this._backgroundSprite.render();
        this._items.forEach((menuItem) => menuItem.render());
        this._selectorSprite.render();
    }

    manageInput() {
        if (kontra.keys.pressed('left')) {
            this._selectedItem = Math.max(0, --this._selectedItem);
            this._updateSelectorPosition();
        }
        if (kontra.keys.pressed('right')) {
            this._selectedItem = Math.min(this._items.length - 1, ++this._selectedItem);
            this._updateSelectorPosition();
        }
        if (kontra.keys.pressed('enter')) {
            this._items[this._selectedItem].select();
        }
    }

    _updateSelectorPosition() {
        this._selectorSprite.x = this._items[this._selectedItem].x - 25;
        this._selectorSprite.y = this._items[this._selectedItem].y - 15;
        this._selectorSprite.update();
    }
}