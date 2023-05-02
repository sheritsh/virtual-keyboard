/* created by sheritsh // Oleg Polovinko ※ School 21, Kzn */

import keysEn from "./en_layout.js";
import keysRu from "./ru_layout.js";

class KeyboardRender {
  constructor() {
    // Generate page elements and add them properties
    this.content = document.createElement('div');
    this.content.classList.add('content-wrapper');
    this.title = document.createElement('h1');
    this.title.textContent = 'Virtual Keyboard';
    this.title.classList.add('title');
    this.textarea = document.createElement('textarea');
    this.textarea.rows = '5';
    this.textarea.setAttribute('placeholder', 'Please input your text...');
    this.textarea.classList.add('textarea');
    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');
    this.description = document.createElement('div');
    this.description.classList.add('description');
    this.description.textContent = 'The keyboard was created in the macOS Big Sur v11.6.6 environment. \nTo switch layout press \'ctrl + space\'.';
    this.description.style.whiteSpace = 'pre';
    this.footer = document.createElement('div');
    this.footer.classList.add('footer');
    this.footer.innerHTML = '// designed by <a href="https://github.com/sheritsh">sheritsh</a> for <a href="https://rs.school/">RS School</a><br>© 2023';

    // Add page elements to content wrapper
    this.content.append(this.title);
    this.content.append(this.textarea);
    this.content.append(this.keyboard);
    this.content.append(this.description);
    this.content.append(this.footer);

    // Render content wrapper in html body
    document.body.prepend(this.content);
    this.textarea.focus();
  }

  getKeyboard() {
    const { keyboard } = this;
    const keyboardLayout = localStorage.getItem('userLang') === 'ru' ? keysRu : keysEn;
    for (let i = 0; i < keyboardLayout.length; i += 1) {
      for (let j = 0; j < keyboardLayout[i].length; j += 1) {
        let keyValue = '';
        keyValue = typeof keyboardLayout[i][j] === 'object' ? keyboardLayout[i][j][0] : keyboardLayout[i][j];
        const newKey = {};
        newKey.button = document.createElement('div');
        newKey.button.textContent = keyValue;
        newKey.button.classList.add('keyBtn', 'btn');
        // newKey.button.style.flexBasis = getBtnSize(i);
        if (keyValue === ' ') {
          newKey.button.classList.add('btn-space');
        } else if (keyValue === 'Shift') {
          newKey.button.classList.add('btn-shift');
        }
        keyboard.append(newKey.button);
      }
      const newLine = document.createElement('div');
      newLine.classList.add('line-break');
      keyboard.append(newLine);
    }
  }

  highlightKey(event) {
    console.log(event.key);
    const btnsCollection = document.querySelectorAll('keyBtn');
    const currentButton = event.target.closest('.keyBtn');
    if (currentButton && event.type !== 'click') {
      console.log(event.key);
    }
  }
}

const keyboard = new KeyboardRender();
keyboard.getKeyboard();

window.addEventListener('keydown', (event) => {
  // newKeyBoard.textareaFocus();
  keyboard.highlightKey(event);
});
