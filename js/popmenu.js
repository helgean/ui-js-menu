customElements.define('pop-menu', class extends HTMLElement {
  connectedCallback() {
    this.setAttribute('tabindex', '0');
    this.addEventListener('keydown', this.keydown);
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
});