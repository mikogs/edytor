class EdytorNewWorkspaceTool extends EdytorTool {
    RequiresPad = true;

    constructor() {
        super();
    }

    __isMultiClick() {
        return false;
    }

    connectedCallback() {
        super._init('new-workspace', 'fa-file', 'New');
        super._addProperty("Width", "width", "1920", null, null, false);
        super._addProperty("Height", "height", "1080", null, null, false);
        var self = this;
        super._addButton("Start new image", function () {
            var w = parseInt(self.__getProperty("width"));
            var h = parseInt(self.__getProperty("height"));
            if (!isNaN(w) && !isNaN(h)) {
                document.getElementById('edytor').__newWorkspace(w, h, 400);
            }
        });
    }

    __getProperty(name) {
        return super._getProperty(name);
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    __drawStart(x, y, shiftKey, altKey) {
        return false;
    }

    __drawPoint(x, y) {
        return false;
    }

    __drawMove(x, y, shiftKey, altKey) {
        return false;
    }

    __drawEnd(x, y, shiftKey, altKey) {
        return false;
    }

    __drawCancel() {
        return false;
    }
}

window.customElements.define("edytor-tool-new-workspace", EdytorNewWorkspaceTool);
