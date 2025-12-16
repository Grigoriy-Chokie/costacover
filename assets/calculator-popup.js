class CalculatorPopup extends HTMLElement {
  constructor() {
    super();

    this.closeButtons = document.querySelectorAll('.calculator-popup__close');
    this.openButton = document.querySelector('.calculator-popup__trigger');
    this.popupContainer = this.querySelector('.calculator-popup__container');
    this.addCartButton = this.querySelector('.calculator__add-to-cart');
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      if(!this.popupContainer?.contains(e.target)) {
        this.close();
      }
    });

    this.closeButtons.forEach(closeButton => {
      closeButton.addEventListener('click', this.close.bind(this));
    });

    this.addCartButton?.addEventListener('click', this.close.bind(this));

    this.openButton?.addEventListener('click', this.open.bind(this));
  }

  open() {
    this.classList.add('calculator-popup--active');
    document.documentElement.classList.add('js-drawer-open');
  }

  close() {
    this.classList.remove('calculator-popup--active');
    document.documentElement.classList.remove('js-drawer-open');
  }
}

customElements.define('calculator-popup', CalculatorPopup);
