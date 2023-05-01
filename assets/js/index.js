/* created by sheritsh // Oleg Polovinko ※ School 21, Kzn */

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
    this.textarea.classList.add('textarea');
    this.description = document.createElement('div');
    this.description.classList.add('description');
    this.description.textContent = 'The keyboard was created in the macOS Big Sur v11.6.6 environment. \nTo switch layout press "X"';
    this.description.style.whiteSpace = 'pre';
    this.footer = document.createElement('div');
    this.footer.classList.add('footer');
    this.footer.textContent = 'Copyrights';

    // Add page elements to content wrapper
    this.content.append(this.title);
    this.content.append(this.textarea);
    this.content.append(this.description);
    this.content.append(this.footer);

    // Render content wrapper in html body
    document.body.prepend(this.content);
  }
}

let newKeyBoard = new KeyboardRender();

export default newKeyBoard;