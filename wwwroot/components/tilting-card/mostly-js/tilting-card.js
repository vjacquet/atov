const rotations = ['calc(var(--angle) * -1)', '0', 'var(--angle)'];

class TiltingCard extends HTMLElement {
    #cleanup;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
:host {
    position: relative;
    --perspective: var(--tilting-perspective, 500px);
    --angle: var(--tilting-angle, 15deg);

    --rotationX: 0;
    --rotationY: 0;
    --rotationZ: 0;
    transform: perspective(var(--perspective)) rotateX(var(--rotationX)) rotateY(var(--rotationY)) rotateZ(var(--rotationZ));
    transition: transform 500ms ease;
}
`;
        const slot = document.createElement('slot');
        shadow.append(style, slot);
    }

    #getCell(x, y) {
        const rect = this.getBoundingClientRect();
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom)
            return [undefined,  undefined];
        const i = Math.trunc(3 * (x - rect.left) / rect.width);
        const j = Math.trunc(3 * (y - rect.top) / rect.height);
        return [i, j];
    }

    #updateStyle(i, j) {
        let x = rotations[2 - (j ?? 1)];
        let y = rotations[i ?? 1];
        this.style.setProperty('--rotationX', x);
        this.style.setProperty('--rotationY', y);
    }


    connectedCallback() {
        const onmousemove = e => this.#updateStyle(...this.#getCell(e.clientX, e.clientY));
        const onmouseleave = e => this.#updateStyle();
        this.parentElement.addEventListener('mousemove', onmousemove, { passive: true });
        this.parentElement.addEventListener('mouseleave', onmouseleave, { passive: true });
        this.#cleanup = function () {
            this.parentElement.removeEventListener('mousemove', onmousemove);
            this.parentElement.removeEventListener('mouseleave', onmouseleave);
        };
    }

    disconnectedCallback() {
        this.#cleanup();
    }
}

customElements.define('tilting-card', TiltingCard);