/* created by sheritsh // Oleg Polovinko ※ School 21, Kzn */

import keysEn from "./en_layout.js";
import specialBtns from "./key_sets.js";
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
    this.textarea.cols = '60';
    this.textarea.setAttribute('placeholder', 'Please input your text...');
    // this.textarea.setAttribute('readonly', 'readonly');
    this.textarea.setAttribute('wrap', 'hard');
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

    // keys statuses
    this.shiftStatus = false;
    this.optionStatus = false;
    this.isCaps = false;
    this.isRightShiftLight = false;

    // Render content wrapper in html body
    document.body.prepend(this.content);
    this.textarea.focus();
  }

  getKeyboard() {
    const { keyboard } = this;
    const keyboardLayout = localStorage.getItem('userLang') === 'ru' ? keysRu : keysEn;
    let tabMode = 0;
    if (this.isCaps || this.shiftStatus) {
      tabMode = 1;
    }
    
    for (let i = 0; i < keyboardLayout.length; i += 1) {
      for (let j = 0; j < keyboardLayout[i].length; j += 1) {
        let keyValue = '';
        keyValue = typeof keyboardLayout[i][j] === 'object' ? keyboardLayout[i][j][tabMode] : keyboardLayout[i][j];
        const newKey = {};
        newKey.button = document.createElement('div');
        newKey.button.textContent = keyValue;
        newKey.button.classList.add('keyBtn', 'btn');
        if(keyValue === 'CapsLock' && this.isCaps) {
          newKey.button.classList.add('caps-active');
        }
        if(keyValue === 'Shift' && this.shiftStatus) {
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
    const currentBtn = event.target.closest('.keyBtn');

    let side = 'left';
    const sideDependent = ['Shift', 'Ctrl', 'Option', 'Cmd'];


    let curBtn = event.key;
    let forSpecial = curBtn;
    if (specialBtns.includes(event.key)) {
      curBtn = getSpecialBtn(event);
    }

    if (sideDependent.includes(curBtn)) {
      side = checkBtnSide(event);
    }



    if (event.type === 'click') {
      // console.log(event.target.closest('.keyBtn'));
      curBtn = event.target.closest('.keyBtn').textContent;
      console.log(curBtn)
      handleKeydown(curBtn, btnsCollection, side);
      
      if (!specialBtns.includes(curBtn)) {
        let bufStr = keyboard.textarea.value.split('');
        const texpPointer = keyboard.textarea.selectionEnd;
        bufStr.splice(keyboard.textarea.selectionStart, 0, curBtn);
        bufStr = bufStr.join('');
        keyboard.textarea.value = bufStr;
        keyboard.textarea.selectionEnd = texpPointer+1;
    } else {
      specialBtnsToDo(curBtn);
      if (curBtn === 'Shift') {
        refresh(side);
      }
    }
      
      handleKeyup(curBtn, btnsCollection, side);
    } else if (event.type === 'keydown') {
      // console.log("Pressed " +event.code);
      handleKeydown(curBtn, btnsCollection, side);
      if (!specialBtns.includes(forSpecial)) {
        let bufStr = keyboard.textarea.value.split('');
        const texpPointer = keyboard.textarea.selectionEnd;
        bufStr.splice(keyboard.textarea.selectionStart, 0, curBtn);
        bufStr = bufStr.join('');
        keyboard.textarea.value = bufStr;
        keyboard.textarea.selectionEnd = texpPointer+1;
    } else {
      specialBtnsToDo(curBtn);
      if (curBtn === 'Shift') {
        refresh(side);
      }
    }

      // if (this.textarea.value.length % 65 === 0) {
      //   keyboard.textarea.value += '\n';
      // }
      // event.target.closest('.button').classList.add("btn-active");
    } else if (event.type === 'keyup') {
      // console.log("Unpressed " + event.key);
      handleKeyup(curBtn, btnsCollection, side);
    }

    if (event.type === 'click' || event.type === 'keydown') {
      if (!event.repeat) {
        soundPlay();
      }

    }
 }
}

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

function handleKeydown(curBtn, btnsCollection, side) {
  // console.log(event.code);
  // console.log(event.key);

  // if (sideDependent.includes(curBtn)) {

  // }



  
  if (curBtn === 'Shift') {

      keyboard.shiftStatus = true;
      
  } else if (curBtn === 'Option') {
    keyboard.optionStatus = true;
  }
  switchLang();

  let sideNumber = side === 'left' ? 1 : 2;
  console.log(sideNumber);
  /* eslint-disable-next-line */
  for (const elem of btnsCollection) {
    if (elem.textContent === curBtn) {
      if (curBtn === 'CapsLock') {
        elem.classList.toggle('caps-active');
        break;
      }
      if (sideNumber === 1) {
        elem.classList.add('btn-active');
        console.log(keyboard.isRightShiftLight);
        break;
        
      }
      if (sideNumber === 2) {
        sideNumber = 1;
        if (curBtn === 'Shift') {
          keyboard.isRightShiftLight = true;
          console.log(keyboard.isRightShiftLight);
        }
      }
    }
    // console.log("Match");
  }

}


function handleKeyup(curBtn, btnsCollection, side) {
  if (curBtn === 'Shift') {
    // document.querySelector('.keyboard').innerHTML = '';
    // keyboard.getKeyboard();
    keyboard.shiftStatus = false;
} else if (curBtn === 'Option') {
  keyboard.optionStatus = false;
}
  
  for (let elem of btnsCollection) {
    if (elem.textContent == curBtn) {
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

// function whichBtn(event) {
//   if event.key
// }

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
  if (keyboard.shiftStatus === true && keyboard.optionStatus === true) {

    if (!localStorage.getItem('userLang') || localStorage.getItem('userLang') === 'en') {
      localStorage.setItem('userLang', 'ru');
    } else {
      localStorage.setItem('userLang', 'en');
    }
    refresh();
  }

}

function refresh() {
  document.querySelector('.keyboard').innerHTML = '';
  keyboard.getKeyboard();
}


function specialBtnsToDo(curBtn) {
  
  if (curBtn === 'Tab') {
    keyboard.textarea.value += '    ';
  } else if (curBtn === 'CapsLock') {
    if (keyboard.isCaps) {
      keyboard.isCaps = false;
    } else {
      keyboard.isCaps = true;
    }
    console.log(keyboard.isCaps);
    refresh();
  } else if (curBtn === 'Shift') {
    keyboard.shiftStatus = true;
  } else if (curBtn === 'Control') {
    resBtn = 'Ctrl';
  } else if (curBtn === 'Alt') {
    resBtn = 'Option';
  } else if (curBtn === 'Meta') {
    resBtn = 'Cmd';
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
    keyboard.textarea.selectionEnd = texpPointer+1;
  } else if (curBtn === 'Backspace') {
    let bufStr = keyboard.textarea.value.split('');
    const texpPointer = keyboard.textarea.selectionEnd;
    bufStr.splice(keyboard.textarea.selectionStart-1,1);
    bufStr = bufStr.join('');
    keyboard.textarea.value = bufStr;
    keyboard.textarea.selectionEnd = texpPointer-1;
  } else if (curBtn === 'Del') {
    let bufStr = keyboard.textarea.value.split('');
    const texpPointer = keyboard.textarea.selectionEnd;
    bufStr.splice(keyboard.textarea.selectionStart, 1);
    bufStr = bufStr.join('');
    keyboard.textarea.value = bufStr;
    keyboard.textarea.selectionEnd = texpPointer;
  }

}