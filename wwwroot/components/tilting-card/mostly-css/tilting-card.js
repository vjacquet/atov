class TiltingCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
:host {
    position: relative;
    --perspective: var(--tilting-perspective, 500px);
    --angle: var(--tilting-angle, 15deg);
}

.mouse-position-tracker {
    //z-index: 2;
    position: absolute;
    width: calc(100% / 3);
    height: calc(100% / 3);
}

/* 1st, 4th, 7th */
.mouse-position-tracker:nth-of-type(3n - 2) {
    left: 0;
}
/* 2nd, 5th, 8th */
.mouse-position-tracker:nth-of-type(3n - 1) {
    left: calc(100% / 3);
}

/* 3rd, 6th, 9th */
.mouse-position-tracker:nth-of-type(3n) {
    right: 0;
}

/* 1 to 3 */
.mouse-position-tracker:nth-of-type(n + 1):nth-of-type(-n + 3) {
    top: 0;
}

/* 4 to 6 */
.mouse-position-tracker:nth-of-type(n + 4):nth-of-type(-n + 6) {
    top: calc(100% / 3);
}
/* 7 to 9 */
.mouse-position-tracker:nth-of-type(n + 7):nth-of-type(-n + 9) {
    bottom: 0;
}

.body {
    --rotationX: 0;
    --rotationY: 0;
    --rotationZ: 0;
    transform: perspective(var(--perspective)) rotateX(var(--rotationX)) rotateY(var(--rotationY)) rotateZ(var(--rotationZ));
    transition: transform 500ms ease;
}

.mouse-position-tracker:nth-of-type(1):hover ~ .body {
    --rotationX: var(--angle);
    --rotationY: calc(var(--angle) * -1);
}

.mouse-position-tracker:nth-of-type(2):hover ~ .body {
    --rotationX: var(--angle);
}

.mouse-position-tracker:nth-of-type(3):hover ~ .body {
    --rotationX: var(--angle);
    --rotationY: var(--angle);
}

.mouse-position-tracker:nth-of-type(4):hover ~ .body {
    --rotationY: calc(var(--angle) * -1);
}

.mouse-position-tracker:nth-of-type(6):hover ~ .body {
    --rotationY: var(--angle);
}

.mouse-position-tracker:nth-of-type(7):hover ~ .body {
    --rotationY: calc(var(--angle) * -1);
    --rotationX: calc(var(--angle) * -1);
}

.mouse-position-tracker:nth-of-type(8):hover ~ .body {
    --rotationX: calc(var(--angle) * -1);
}

.mouse-position-tracker:nth-of-type(9):hover ~ .body {
    --rotationY: var(--angle);
    --rotationX: calc(var(--angle) * -1);
}
`;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div');
            div.classList.add('mouse-position-tracker');
            fragment.appendChild(div);
        }
        const slot = document.createElement('slot');
        const body = document.createElement('div');
        body.setAttribute('part', 'body');
        body.classList.add('body');
        body.appendChild(slot);
        fragment.appendChild(body);

        this.shadowRoot.append(style, fragment);
    }
}

customElements.define('tilting-card', TiltingCard);