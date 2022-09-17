const PREAMBULE = `::slotted(span) {
    display: inline-block;
    white-space: break-spaces;
}`;

const WORDS_PREAMBULE = `:host {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 1ch;
}`;

function span(text, index) {
    const node = document.createElement('span')
    node.textContent = text
    node.style.setProperty('--index', index)
    return node
}

const algorithms = {
    letter: text => [...text].map(span),
    word: text => text.split(' ').map(span)
}

const animations = {
    'breath': {
        splitBy: 'letter',
        style:`${PREAMBULE}
@media (prefers-reduced-motion:no-preference) {
    :host([animation=breath]) {
        --glow-color: white;
    }
        :host([animation=breath]) ::slotted(span) {
            animation: breath 1.2s ease calc(var(--index) * 100ms) infinite alternate;
   }
}
@media (prefers-reduced-motion:no-preference) and (prefers-color-scheme:light) {
    :host([animation=breath]) {
        --glow-color: black;
    }
}`
    },
    'hover': {
        splitBy: 'letter',
        style:`${PREAMBULE}
@media (prefers-reduced-motion:no-preference) and (hover) {
    :host(:hover) ::slotted(span) {
        transform: scale(.75) perspective(1px)
    }

    ::slotted(span) {
        transition: transform .3s ease;
        cursor: pointer;
        will-change: transform
    }

    :host ::slotted(span:hover) {
        transform: scale(1.25) perspective(1px)
    }
}`
    },
    'trampoline': {
        splitBy: 'word',
        style:`${PREAMBULE}
${WORDS_PREAMBULE}
@media (prefers-reduced-motion:no-preference) {
    ::slotted(span) {
        transform: translateY(100%);
        -webkit-animation: trampoline 3s ease calc(var(--index) * 150ms) infinite alternate;
        animation: trampoline 3s ease calc(var(--index) * 150ms) infinite alternate
    }
}`
    },
    'reveal': {
        splitBy: 'word',
        style:`${PREAMBULE}
${WORDS_PREAMBULE}
@media (prefers-reduced-motion:no-preference) and (hover) {
    :host {
        overflow: hidden;
        overflow: clip
    }
        ::slotted(span) {
            transition: transform .3s ease;
            cursor: pointer
        }
        ::slotted(span:not(:hover)) {
            transform: translateY(50%)
        }
}`
    }
}

export default class AnimateText extends HTMLElement {
    static get observedAttributes() { return ['animation']; }

    #timeoutID;

    constructor() {
        super();
        this.animation = 'breath';

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(document.createElement('slot'));
        shadow.append(document.createElement('style'));
    }

    requestSetup() {
        if (!this.#timeoutID) {
            this.#timeoutID = setTimeout(() => {
                this.#setup();
                this.#timeoutID = null;
            }, 0);
        }
    }

    #setup() {
        if (this.isConnected) {
            const animation = animations[this.animation];
            const nodes = algorithms[animation.splitBy](this.innerText);
            this.replaceChildren(...nodes);
            this.shadowRoot.querySelector('style').textContent = animation.style;
        }
    }

    connectedCallback() {
        this.requestSetup();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'animation':
                if (animations[newValue]) {
                    this.animation = newValue;
                    this.requestSetup();
                }
                break;
        }
    }
}

customElements.define('animate-text', AnimateText);