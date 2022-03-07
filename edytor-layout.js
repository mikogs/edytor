class Layout {
    #id = {
        container: "",
        layerContainer: "",
        sidebarLeft: "",
        sidebarRight: "",
        layerList: "",
        toolContainer: "",
        colorFgContainer: "",
        colorBgContainer: ""
    }

    #ref = {
        container: null,
        layerContainer: null,
        sidebarLeft: null,
        sidebarRight: null,
        toolContainer: null,
        colorFgContainer: null,
        colorBgContainer: null
    }

    #getToolIconFn = null;
    #setToolFn = null;
    #setColorFn = null;
    #tools = [];
    #colors = {};

    InitBody() {
        // Just in case
        document.body.style.margin = 0;
        document.body.style.padding = 0;
    }

    InitContainer() {
        // We don't want this in the CSS
        this.#ref.container.style.margin = 0;
        this.#ref.container.style.padding = 0;
        this.#ref.container.style.position = "relative";
    }

    InitLayerContainer() {
        this.#ref.layerContainer = document.createElement('div');
        this.#ref.layerContainer.id = this.#id.layerContainer;
        // Again, we don't want the positioning to be in the CSS file
        this.#ref.layerContainer.style.margin = 0;
        this.#ref.layerContainer.style.padding = 0;
        this.#ref.layerContainer.style.position = "absolute";
        this.#ref.layerContainer.style.top = 0;
        this.#ref.layerContainer.style.left = 0;
        this.#ref.container.appendChild(this.#ref.layerContainer);
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.layerContainer.style.width = (w*2) + 'px';
        this.#ref.layerContainer.style.height = (h*2) + 'px';
    }

    #addSidebarDivToContainer(ref, className, id, zIndex, side) {
        this.#ref[ref] = document.createElement('div');
        this.#ref[ref].className = className;
        this.#ref[ref].id = id;
        this.#ref[ref].style.zIndex = zIndex;
        this.#ref[ref].style.position = "fixed";
        this.#ref[ref].style.top = 0;
        if (side == "right") {
            this.#ref[ref].style.right = 0;
        } else if (side == "left") {
            this.#ref[ref].style.left = 0;
        }
        this.#ref.container.appendChild(this.#ref[ref]);
    }

    #resizeSidebarsToWindow() {
        var h = window.innerHeight;
        this.#ref.sidebarLeft.style.height = h + 'px';
        this.#ref.sidebarRight.style.height = h + 'px';
    }

    #initSidebars(zIndexSidebarLeft, zIndexSidebarRight) {
        this.#addSidebarDivToContainer('sidebarLeft', 'sidebar_left', this.#id.sidebarLeft, zIndexSidebarLeft, 'left');
        this.#addSidebarDivToContainer('sidebarRight', 'sidebar_right', this.#id.sidebarRight, zIndexSidebarRight, 'right');
        this.#resizeSidebarsToWindow();
    }

    #setScroll() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        window.scrollTo(w/2,h/2);
    }

    #addSidebarTitle(ref, t) {
        var d = document.createElement('div');
        d.className = "sidebar_title";
        d.innerHTML = t;
        this.#ref[ref].appendChild(d);
    }

    #addSidebarContainer(ref, n) {
        this.#ref[n] = document.createElement('div');
        this.#ref[n].className = "sidebar_container";
        this.#ref[n].style.display = "flex";
        this.#ref[n].style.flexFlow = "row wrap";
        this.#ref[n].id = this.#id[n];
        this.#ref[ref].appendChild(this.#ref[n]);
    }

    #addSidebarToggle(ref, n, id, className, innerHtml, additionalFn, clickFn, addX) {
        var t = document.createElement('div');
        t.className = "toggle_off sidebar_toggle "+className;
        t.innerHTML = innerHtml;
        t.id = id;

        if (additionalFn != null) {
            additionalFn(t);
        }

        var scope = this;
        t.addEventListener('click', function() {
            clickFn(n);

            var tools = scope.#ref[ref].querySelectorAll('.'+className);
            for (var i=0; i<tools.length; i++) {
                tools[i].classList.remove('toggle_on');
                tools[i].classList.add('toggle_off');
                if (addX) {
                    tools[i].innerHTML = '';
                }
            }

            this.classList.remove('toggle_off');
            this.classList.add('toggle_on');
            if (addX) {
                this.innerHTML = 'X';
            }
        });

        this.#ref[ref].appendChild(t);
    }

    #addSidebarLeftTool(ref, n) {
        var scope = this;
        this.#addSidebarToggle(ref, n, 'tool_'+n, 'tool', this.#getToolIconFn(n), null, function(nm) {
            scope.#setToolFn(nm);
        }, false);
    }

    #addSidebarLeftColor(ref, fgbg, n) {
        var scope = this;
        this.#addSidebarToggle(ref, n, 'color_'+fgbg+'_'+n, 'color', '', function(o) {
            o.style.background = scope.#colors[n];
        }, function(nm) {
            scope.#setColorFn(fgbg, nm);
        }, true);
/*
        var t = document.createElement('div');
        t.className = "toggle_off color";
        t.innerHTML = "&nbsp;";
        t.id = "color"+fgbg+"_"+n;
        t.style.background = this.#colors[n];

        var scope = this;
        t.addEventListener('click', function() {
            scope.#setColorFn(fgbg, n);

            var o = document.getElementById("color"+fgbg+"_"+n);
            o.classList.remove("toggle_off");
            o.classList.add("toggle_on");
            o.innerHTML = 'X';
            for (const key in scope.#colors) {
                if (key == n) {
                    continue;
                }
                var o = document.getElementById("color"+fgbg+"_"+key);
                o.classList.remove("toggle_on");
                o.classList.add("toggle_off");
                o.innerHTML = '&nbsp;';
            }
        });
        this.#ref.sidebarLeft.appendChild(t);*/
    }

    #addSidebarLeftInputText(id, label, defval) {
        var p = document.createElement('div');
        p.className = "tool_property";

        var lbl = document.createElement('label');
        lbl.innerHTML = label;

        var inp = document.createElement('input');
        inp.type = "text";
        inp.id = id;
        inp.value = defval;

        p.appendChild(lbl);
        p.appendChild(inp);
        this.#ref.sidebarLeft.appendChild(p);
    }

    #addSidebarLeftSelect(id, label, vals) {
        var p = document.createElement('div');
        p.className = "tool_property";

        var lbl = document.createElement('label');
        lbl.innerHTML = label;

        var sel = document.createElement('select');
        sel.id = id;

        for (const key in vals) {
            var o = document.createElement('option');
            o.value = key;
            o.innerHTML = vals[key];
            sel.appendChild(o);
        }
        p.appendChild(lbl);
        p.appendChild(sel);
        this.#ref.sidebarLeft.appendChild(p);
    }

    #initTools() {
        this.#addSidebarTitle('sidebarLeft',"Tools");
        this.#addSidebarContainer('sidebarLeft', 'toolContainer');
        for (var i=0; i<this.#tools.length; i++) {
            this.#addSidebarLeftTool('toolContainer', this.#tools[i]);
        }
    }

    #initColors() {
        this.#addSidebarTitle('sidebarLeft',"Fg Color");
        this.#addSidebarContainer('sidebarLeft', 'colorFgContainer');
        var i = 0;
        var firstColor = "";
        for (const key in this.#colors) {
            if (i == 0) {
                firstColor = key;
            }
            this.#addSidebarLeftColor('colorFgContainer', "fg", key);
            i++;
        }

        this.#addSidebarTitle('sidebarLeft',"Bg Color");
        this.#addSidebarContainer('sidebarLeft', 'colorBgContainer');
        for (const key in this.#colors) {
            this.#addSidebarLeftColor('colorBgContainer', "bg", key);
        }

        this.#setColorFn("fg", firstColor);
        this.#setColorFn("bg", firstColor);
    }

    #initStroke() {
        this.#addSidebarTitle('sidebarLeft',"Stroke");
        this.#addSidebarLeftInputText("stroke_width", "width", "3");
        this.#addSidebarLeftInputText("stroke_opacity", "opacity", "100%");
        this.#addSidebarLeftSelect("stroke_linecap", "linecap", {"butt": "butt", "square": "square", "round": "round"});
        this.#addSidebarLeftSelect("stroke_linejoin", "linejoin", {"miter": "miter", "round": "round", "bevel": "bevel"});
        this.#addSidebarLeftInputText("stroke_dasharray", "dasharray", "5");
    }

    #initFill() {
        this.#addSidebarTitle('sidebarLeft',"Fill");
        this.#addSidebarLeftInputText("fill_opacity", "opacity", "100%");
        this.#addSidebarLeftSelect("fill_rule", "rule", {"nonzero": "nonzero", "evenodd": "evenodd", "inherit": "inherit"});
    }

    #initProperties() {
        this.#addSidebarTitle('sidebarRight',"Properties");

        for (var i=0; i<10; i++) {
            var p = document.createElement('div');
            p.className = "property";

            var lbl = document.createElement('label');
            lbl.innerHTML = "Property:";

            var inp = document.createElement('input');
            inp.type = "text";
            inp.value = "val";

            p.appendChild(lbl);
            p.appendChild(inp);
            this.#ref.sidebarRight.appendChild(p);
        }
    }

    #initLayers() {
        this.#addSidebarTitle('sidebarRight', "Layers");

        this.#ref.layerList = document.createElement('div');
        this.#ref.layerList.id = this.#id.layerList;
        this.#ref.sidebarRight.appendChild(this.#ref.layerList);

        var p = document.createElement('div');
        p.className = "property";
        var b = document.createElement('button');
        b.innerHTML = "Add";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Lock";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Unlock";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Show";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Hide";
        b.className = "action";
        p.appendChild(b);
        var b = document.createElement('button');
        b.innerHTML = "Del";
        b.className = "action";
        p.appendChild(b);

        this.#ref.sidebarRight.appendChild(p);
    }

    constructor(idContainer, idLayerContainer, idSidebarLeft, idSidebarRight, idLayerList, idToolContainer, idColorFgContainer, idColorBgContainer) {
        this.#id.container = idContainer;
        this.#id.layerContainer = idLayerContainer;
        this.#id.sidebarLeft = idSidebarLeft;
        this.#id.sidebarRight = idSidebarRight;
        this.#id.layerList = idLayerList;
        this.#id.toolContainer = idToolContainer;
        this.#id.colorFgContainer = idColorFgContainer;
        this.#id.colorBgContainer = idColorBgContainer;

        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='"+this.#id.container+"' not found");
            return;
        }
    }

    InitSidebars(zIndexSidebarLeft, zIndexSidebarRight, getToolIconFn, setToolFn, tools, colors, setColorFn) {
        this.#getToolIconFn = getToolIconFn;
        this.#setToolFn = setToolFn;
        this.#setColorFn = setColorFn;
        this.#tools = tools;
        this.#colors = colors;
        this.#initSidebars(zIndexSidebarLeft, zIndexSidebarRight);
        this.#setScroll();
        this.#initTools();
        this.#initColors();
        this.#initStroke();
        this.#initFill();
        this.#initLayers();
        this.#initProperties();

        this.AddLayer('svg');
        this.AddLayer('px');
    }

    AddLayer(t) {
        var p = document.createElement('div');
        p.className = "property";

        var b = document.createElement('input');
        b.type = "checkbox";
        p.appendChild(b);

        var typ = document.createElement('label');
        typ.className = "type";
        typ.innerHTML = t;
        p.appendChild(typ);

        var inp = document.createElement('input');
        inp.type = "text";
        inp.value = "Layer 1";
        inp.className = "layer_name";
        p.appendChild(inp);

        var b = document.createElement('button');
        b.className = "toggle_off";
        b.innerHTML = "L";
        p.appendChild(b);
        var b = document.createElement('button');
        b.className = "toggle_on";
        b.innerHTML = "H";
        p.appendChild(b);
        var b = document.createElement('button');
        b.className = "toggle_on";
        b.innerHTML = "U";
        p.appendChild(b);
        var b = document.createElement('button');
        b.className = "toggle_off";
        b.innerHTML = "D";
        p.appendChild(b);

        this.#ref.layerList.appendChild(p);
    }
}