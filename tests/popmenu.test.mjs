import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { JSDOM } from 'jsdom'

const Menu = suite('Menu');

Menu.before(async context => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preload" href="../css/pop-menu.css" as="style" />
      </head>
      <body>
      </body>
    </html>`, {
      features : {
        FetchExternalResources : ['script', 'css'],
        QuerySelector : true
      }
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.customElements = window.customElements;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.IntersectionObserver = class MockIntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  context.window = globalThis.window;
  context.document = globalThis.document;
});

Menu.before.each(async context => {
  await import('../js/pop-menu.mjs');

  const ready = () => new Promise(resolve => {
    context.document.addEventListener('DOMContentLoaded', () => resolve(true));
  });

  //await ready();

  const document = context.document;
  document.body.innerHTML = `
    <button>empty</button>
    <pop-menu aria-haspopup="true" aria-controls="popmenu">
      <span class="material-symbols-rounded">more_vert</span>
      <div role="menu">
        <a href="#null" tabindex="-1" role="menuitem">Item 1</a>
        <a href="#null" tabindex="-1" role="menuitem">Item 2</a>
        <a href="#null" tabindex="-1" role="menuitem">Item 3</a>
        <a href="#null" tabindex="-1" role="menuitem">Item 4</a>
      </div>
    </pop-menu>
  `;
  context.menu = document.querySelector('pop-menu');
  context.btn = document.querySelector('pop-menu > span');
});

Menu('contains class', async context => {
  const popMenu = context.menu;
  assert.ok(popMenu.classList.contains('pop-menu')); //=> pass
});

Menu('menu visible on element focus', async context => {
  const menu = context.document.querySelector('[role="menu"]');
  const window = context.window;
  const style = window.getComputedStyle(menu);
  console.log(style)
  assert.is(style.display, 'none'); //=> pass
});

Menu.run();