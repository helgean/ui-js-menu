export class PopMenu extends HTMLElement {
    connectedCallback() {
        this.pushedLeft = 0;
        this.pushedUp = 0;
        this.setAttribute('tabindex', '0');
        this.addEventListener('keydown', ev => this.keydown(ev));
        this.addEventListener('click', ev => this.action(ev.target));
        const intersectionObserver = new IntersectionObserver((entries) => {
            // If intersectionRatio is 0, the target is out of view
            const change = entries && entries.length > 0 ? entries[0] : null;
            if (!change)
                return;

            if (!change.isIntersecting && change.isVisible)
                return

            if (change.intersectionRatio <= 0 && change.isVisible)
                return;

            if (change.rootBounds.height <= change.boundingClientRect.height) {
                this.classList.add('at-top');
                return;
            }

            const pushLeft = Math.min(change.rootBounds.right - change.boundingClientRect.right - 20, 0);
            const pushUp = Math.min(change.rootBounds.bottom - change.boundingClientRect.bottom - 20, 0);

            if (pushLeft == 0 && pushUp == 0)
                return;

            this.querySelector('[role=menu]').style.marginLeft = `${pushLeft}px`;
            this.querySelector('[role=menu]').style.marginTop = `${pushUp}px`;

            this.pushedLeft = pushLeft;
            this.pushedUp = pushUp;
        },
        {
            root: document,
            threshold: 0.01
        });

        this.addEventListener('focusin', ev => {
            // start observing
            this.clearPosition();
            intersectionObserver.observe(this.querySelector('[role=menu]'));
        });

        this.addEventListener('focusout', ev => {
            // end observing
            this.clearPosition();
            intersectionObserver.unobserve(this.querySelector('[role=menu]'));
        });

    }

    clearPosition() {
        this.classList.remove('at-top');
        const menu = this.querySelector('[role=menu]');
        menu.style.removeProperty('margin-left');
        menu.style.removeProperty('margin-top');
    }

    keydown(ev) {
        let targetItem;
        const selectedItem = this.querySelector('[role="menuitem"]:focus');

        if (ev.key == 'ArrowDown')
            targetItem = selectedItem ? this.querySelector('[role="menuitem"]:focus + [role="menuitem"]') : this.querySelector('[role="menuitem"]');

        if (ev.key == 'ArrowUp')
            targetItem = selectedItem ? selectedItem.previousElementSibling : undefined;

        if (targetItem && targetItem.focus)
            targetItem.focus();
    }

    action(item) {
        if (item.getAttribute('role') != "menuitem")
            return;

        this.dispatchEvent(new CustomEvent('pop-menu-action', {
            bubbles: true,
            detail: {
                item: item
            }
        }));
    }
}

customElements.define('pop-menu', PopMenu);