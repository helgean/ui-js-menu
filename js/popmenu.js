export class PopMenu extends HTMLElement {
  connectedCallback() {
    this.setAttribute('tabindex', '0');
    this.addEventListener('keydown', ev => this.keydown(ev));
    this.addEventListener('click', ev => this.action(ev.target));
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
    console.log(item);
    this.dispatchEvent(new CustomEvent('pop-menu-action', {
      bubbles: true,
      detail: {
        item: item
      }
    }));
  }
}

customElements.define('pop-menu', PopMenu);