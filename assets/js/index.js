/* created by sheritsh // Oleg Polovinko ※ School 21, Kzn */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */

import keysEn from './en_layout.js';
import specialBtns from './key_sets.js';
import macKbLayout from './mac_keyboard.js';
import keysRu from './ru_layout.js';

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
    this.textarea.cols = '60';
    this.textarea.setAttribute('placeholder', 'Please input your text...');
    // this.textarea.setAttribute('readonly', 'readonly');
    this.textarea.setAttribute('wrap', 'hard');
    this.textarea.classList.add('textarea');
    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');
    this.description = document.createElement('div');
    this.description.classList.add('description');
    this.description.textContent = "The keyboard was created in the macOS Big Sur v11.6.6 environment. \nTo switch layout press 'Ctrl + Option'.";
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

    // keys statuses
    this.shiftStatus = false;
    this.optionStatus = false;
    this.ctrlStatus = false;
    this.isCaps = false;
    this.isRightShiftLight = false;

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
        keyValue = typeof keyboardLayout[i][j] === 'object' ? keyboardLayout[i][j][Number(this.shiftStatus)] : keyboardLayout[i][j];
        if ((this.isCaps || this.shiftStatus) && keyValue.match(/^[а-яa-z]/)) {
          keyValue = keyValue.toUpperCase();
        }
        const newKey = {};
        newKey.button = document.createElement('div');
        newKey.button.textContent = keyValue;
        newKey.button.classList.add('keyBtn', 'btn');
        if (keyValue === 'CapsLock' && this.isCaps) {
          newKey.button.classList.add('caps-active');
        }
        if (keyValue === 'Shift' && this.shiftStatus) {
          if (!this.isRightShiftLight) {
            newKey.button.classList.add('caps-active');
            this.isRightShiftLight = !this.isRightShiftLight;
          } else {
            this.isRightShiftLight = !this.isRightShiftLight;
          }
        }
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

  eventHandler(event) {
    event.preventDefault();
    const btnsCollection = document.querySelectorAll('.keyBtn');
    const eventBtn = recognizeBtn(event, btnsCollection);
    let side = 'left';
    const sideDependent = ['Shift', 'Ctrl', 'Option', 'Cmd'];
    let curBtn = event.key;
    const forSpecial = curBtn;
    if (specialBtns.includes(event.key)) {
      curBtn = getSpecialBtn(event);
    }
    if (sideDependent.includes(eventBtn)) {
      side = checkBtnSide(event);
    }
    if (event.type === 'click') {
      curBtn = event.target.closest('.keyBtn').textContent;
      handleKeydown(curBtn, btnsCollection, side);
      if (!specialBtns.includes(curBtn)) {
        let bufStr = this.textarea.value.split('');
        const texpPointer = this.textarea.selectionEnd;
        bufStr.splice(this.textarea.selectionStart, 0, curBtn);
        bufStr = bufStr.join('');
        this.textarea.value = bufStr;
        this.textarea.selectionEnd = texpPointer + 1;
      } else {
        specialBtnsToDo(curBtn);
        if (curBtn === 'Shift') {
          refresh(side);
        }
      }

      handleKeyup(curBtn, btnsCollection, side);
      this.textarea.focus();
    } else if (event.type === 'keydown') {
      handleKeydown(eventBtn, btnsCollection, side);
      if (!specialBtns.includes(forSpecial)) {
        let bufStr = keyboard.textarea.value.split('');
        const texpPointer = keyboard.textarea.selectionEnd;
        bufStr.splice(keyboard.textarea.selectionStart, 0, eventBtn);
        bufStr = bufStr.join('');
        keyboard.textarea.value = bufStr;
        keyboard.textarea.selectionEnd = texpPointer + 1;
      } else {
        specialBtnsToDo(eventBtn);
        if (eventBtn === 'Shift') {
          refresh(side);
        }
      }
    } else if (event.type === 'keyup') {
      handleKeyup(eventBtn, btnsCollection, side);
    }
    if (event.type === 'click' || event.type === 'keydown') {
      if (!event.repeat) {
        soundPlay();
      }
    }
  }
}

/* GENERATING KEYBOARD ON PAGE */

const keyboard = new KeyboardRender();
keyboard.getKeyboard();

keyboard.keyboard.addEventListener('click', (event) => {
  keyboard.eventHandler(event);
});

document.addEventListener('keydown', (event) => {
  keyboard.eventHandler(event);
});

document.addEventListener('keyup', (event) => {
  keyboard.eventHandler(event);
});

/* END OF GENERATING KEYBOARD ON PAGE */

function handleKeydown(curBtn, btnsCollection, side) {
  if (curBtn === 'Shift') {
    keyboard.shiftStatus = true;
  } else if (curBtn === 'Option') {
    keyboard.optionStatus = true;
  } else if (curBtn === 'Ctrl') {
    keyboard.ctrlStatus = true;
  }
  switchLang();

  let sideNumber = side === 'left' ? 1 : 2;
  /* eslint-disable-next-line */
  for (const elem of btnsCollection) {
    if (elem.textContent === curBtn) {
      if (curBtn === 'CapsLock') {
        elem.classList.toggle('caps-active');
        break;
      }
      if (sideNumber === 1) {
        elem.classList.add('btn-active');
        break;
      }
      if (sideNumber === 2) {
        sideNumber = 1;
        if (curBtn === 'Shift') {
          keyboard.isRightShiftLight = true;
        }
      }
    }
  }
}

function handleKeyup(curBtn, btnsCollection) {
  if (curBtn === 'Shift') {
    keyboard.shiftStatus = false;
  } else if (curBtn === 'Option') {
    keyboard.optionStatus = false;
  } else if (curBtn === 'Ctrl') {
    keyboard.ctrlStatus = false;
  }

  for (const elem of btnsCollection) {
    if (elem.textContent === curBtn) {
      if (curBtn !== 'Caps') {
        elem.classList.remove('btn-active');
      }
    }
  }
  if (curBtn === 'Shift') {
    refresh();
    keyboard.isRightShiftLight = false;
  }
}

function soundPlay() {
  const clickSound = new Audio();
  clickSound.preload = 'auto';
  clickSound.src = 'assets/sounds/btn_click_sound.mp3';
  clickSound.play();
}

function getSpecialBtn(event) {
  let resBtn = '';

  if (event.key === 'Tab') {
    resBtn = 'Tab';
  } else if (event.key === 'CapsLock') {
    resBtn = 'CapsLock';
  } else if (event.key === 'Shift') {
    resBtn = 'Shift';
  } else if (event.key === 'Control') {
    resBtn = 'Ctrl';
  } else if (event.key === 'Alt') {
    resBtn = 'Option';
  } else if (event.key === 'Meta') {
    resBtn = 'Cmd';
  } else if (event.key === 'ArrowUp') {
    resBtn = '▴';
  } else if (event.key === 'ArrowLeft') {
    resBtn = '◂';
  } else if (event.key === 'ArrowRight') {
    resBtn = '▸';
  } else if (event.key === 'ArrowDown') {
    resBtn = '▾';
  } else if (event.key === 'Enter') {
    resBtn = 'Enter';
  } else if (event.key === 'Backspace') {
    resBtn = 'Backspace';
  } else if (event.key === 'Delete') {
    resBtn = 'Del';
  }

  return resBtn;
}

function checkBtnSide(event) {
  let side = 'left';
  if (event.code.includes('Right')) {
    side = 'right';
  }

  return side;
}

function switchLang() {
  if (keyboard.ctrlStatus === true && keyboard.optionStatus === true) {
    if (
      !localStorage.getItem('userLang') || localStorage.getItem('userLang') === 'en'
    ) {
      localStorage.setItem('userLang', 'ru');
    } else {
      localStorage.setItem('userLang', 'en');
    }
    setTimeout(() => {
      refresh();
    }, '200');
  }
}

function refresh() {
  document.querySelector('.keyboard').innerHTML = '';
  keyboard.getKeyboard();
}

function specialBtnsToDo(curBtn) {
  if (curBtn === 'Tab') {
    let bufStr = keyboard.textarea.value.split('');
    const texpPointer = keyboard.textarea.selectionEnd;
    bufStr.splice(keyboard.textarea.selectionStart, 0, '    ');
    bufStr = bufStr.join('');
    keyboard.textarea.value = bufStr;
    keyboard.textarea.selectionEnd = texpPointer + 4;
  } else if (curBtn === 'CapsLock') {
    if (keyboard.isCaps) {
      keyboard.isCaps = false;
    } else {
      keyboard.isCaps = true;
    }
    refresh();
  } else if (curBtn === 'Shift') {
    keyboard.shiftStatus = true;
  } else if (curBtn === '▴') {
    keyboard.textarea.selectionStart = 0;
    keyboard.textarea.selectionEnd = 0;
  } else if (curBtn === '◂') {
    if (keyboard.textarea.selectionStart !== 0) {
      keyboard.textarea.selectionStart -= 1;
      keyboard.textarea.selectionEnd -= 1;
    }
  } else if (curBtn === '▸') {
    keyboard.textarea.selectionStart += 1;
  } else if (curBtn === '▾') {
    keyboard.textarea.selectionStart = keyboard.textarea.value.length;
  } else if (curBtn === 'Enter') {
    let bufStr = keyboard.textarea.value.split('');
    const texpPointer = keyboard.textarea.selectionEnd;
    bufStr.splice(keyboard.textarea.selectionStart, 0, '\n');
    bufStr = bufStr.join('');
    keyboard.textarea.value = bufStr;
    keyboard.textarea.selectionEnd = texpPointer + 1;
  } else if (curBtn === 'Backspace') {
    let bufStr = keyboard.textarea.value.split('');
    const texpPointer = keyboard.textarea.selectionEnd;
    bufStr.splice(keyboard.textarea.selectionStart - 1, 1);
    bufStr = bufStr.join('');
    keyboard.textarea.value = bufStr;
    keyboard.textarea.selectionEnd = texpPointer - 1;
  } else if (curBtn === 'Del') {
    let bufStr = keyboard.textarea.value.split('');
    const texpPointer = keyboard.textarea.selectionEnd;
    bufStr.splice(keyboard.textarea.selectionStart, 1);
    bufStr = bufStr.join('');
    keyboard.textarea.value = bufStr;
    keyboard.textarea.selectionEnd = texpPointer;
  }
}

function recognizeBtn(event, btnsCollection) {
  const kbCoords = checkDoesItExist(event);
  if (kbCoords) {
    const kbKey = getKbKey(kbCoords - 1, btnsCollection);
    return kbKey;
  }

  return null;
}

function checkDoesItExist(event) {
  let res = 0;
  for (let i = 0; i < macKbLayout.length; i += 1) {
    for (let j = 0; j < macKbLayout[i].length; j += 1) {
      res += 1;
      if (event.code === macKbLayout[i][j]) {
        return res;
      }
    }
  }

  return false;
}

function getKbKey(kbCoords, btnsCollection) {
  return btnsCollection[kbCoords].textContent;
}
