class EdytorPencilTool extends EdytorTool {
    RequiresPad = true;

    #startPos = [-1, -1];
    #prevPos = [-1, -1];
    #ctx = null;

    constructor() {
        super();
    }

    __isMultiClick() {
        return false;
    }

    connectedCallback() {
        super._init('pencil', 'fa-pencil', 'Pencil');
        super._addProperty("Width", "width", "3", null);
        super._addProperty("Linecap", "linecap", "", {
            "butt": "butt",
            "square": "square",
            "round": "round"
        });
        super._addProperty("Linejoin", "linejoin", "", {
            "miter": "miter",
            "round": "round",
            "bevel": "bevel"
        });
        super._addProperty("Straight", "straight", "", {
            "": "",
            "horizontal": "horizontal",
            "vertical": "vertical",
            "diagonal-down": "diagonal-down",
            "diagonal-up": "diagonal-up"
        });
    }

    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }

    __drawStart(x, y, shiftKey, altKey) {
        var layer = super._getLayer(true);
        if (layer === null) {
            return;
        }

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');

        this.#ctx.globalCompositeOperation = 'source-over';
        this.#ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        this.#ctx.lineWidth = super._getProperty('width');
        this.#ctx.lineCap = super._getProperty('linecap');
        this.#ctx.lineJoin = super._getProperty('linejoin');
        this.#ctx.beginPath();
        this.#startPos = [x, y];
        this.#prevPos = [-1, -1];
        this.#ctx.moveTo(x, y);
    }
    __drawMove(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        if (super._getProperty('straight') == "diagonal-down") {
            y = this.#startPos[1] + (x - this.#startPos[0]);
        } else if (super._getProperty('straight') == "diagonal-up") {
            y = this.#startPos[1] - (x - this.#startPos[0]);
        } else if (super._getProperty('straight') == "vertical") {
            y = this.#startPos[1];
        } else if (super._getProperty('straight') == "horizontal") {
            x = this.#startPos[0];
        }

        if (this.#prevPos[0] != x || this.#prevPos[1] != y) {
            this.#ctx.lineTo(x, y);
            this.#ctx.stroke();
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;
    }
    __drawEnd(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#ctx.closePath();
    }
    __drawCancel() {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');
        this.#ctx.closePath();
    }
}

window.customElements.define("edytor-tool-pencil", EdytorPencilTool);
