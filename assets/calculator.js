class Calculator extends HTMLElement {
  constructor() {
    super();

    this.productType = this.dataset.productType;
    this.form = this.querySelector('#calculator-form');
    this.measurementsSelect = this.querySelector('#measurement');
    this.inchInputsContainer = this.querySelector('.wall-size__inch-inputs');
    this.centimeterInputsContainer = this.querySelector('.wall-size__centimeter-inputs');
    this.inchInputs = this.inchInputsContainer?.querySelectorAll('input');
    this.centimeterInputs = this.centimeterInputsContainer?.querySelectorAll('input');
    this.addWallButton = this.querySelector('.calculator__add-wall-button');
    this.resultsElement = this.querySelector('.calculator__results.calculator-results');
    this.errorElement = this.querySelector('.calculator-errors');

    this.wallWidth = 0;
    this.wallHeight = 0;
    // Wallpapers all have width 24in
    this.wallpaperPanelHeights = [48, 72, 96, 108, 120];
  }

  hideResults() {
    this.resultsElement?.setAttribute('hidden', true);
    this.errorElement?.setAttribute('hidden', true);
  }

  changeMeasurements() {
    if (this.measurementsSelect.value === 'in') {
      this.inchInputsContainer?.classList.add('wall-size__inch-inputs--active');
      this.centimeterInputsContainer?.classList.remove('wall-size__centimeter-inputs--active');
      this.inchInputs?.forEach(inchInput => {
        inchInput.removeAttribute('disabled')
      });
      this.centimeterInputs?.forEach(centimeterInput => {
        centimeterInput.setAttribute('disabled', true)
      });
    } else {
      this.inchInputsContainer?.classList.remove('wall-size__inch-inputs--active');
      this.centimeterInputsContainer?.classList.add('wall-size__centimeter-inputs--active');
      this.inchInputs?.forEach(inchInput => {
        inchInput.setAttribute('disabled', true);
      });
      this.centimeterInputs?.forEach(centimeterInput => {
        centimeterInput.removeAttribute('disabled');
      });
    }
  }

  // Realize "add wall" functionality for inches and centimeters

  addInchWall() {
    const originalElement = document.getElementById('wall-inch-base-input');
    const clonedElement = originalElement.cloneNode(true);
    const uniqueSuffix = new Date().getTime(); // Use a timestamp for unique IDs
    clonedElement.removeAttribute('id');

    const ftInput = clonedElement.querySelector('input[name="width-ft"]');
    ftInput.value = '';
    ftInput.id = 'width-ft-' + uniqueSuffix;
    ftInput.name = 'width-ft-' + uniqueSuffix;

    const ftLabel = clonedElement.querySelector('label[for="width-ft"]');
    ftLabel.setAttribute('for', 'width-ft-' + uniqueSuffix);

    const inInput = clonedElement.querySelector('input[name="width-in"]');
    inInput.value = '';
    inInput.id = 'width-in-' + uniqueSuffix;
    inInput.name = 'width-in-' + uniqueSuffix;

    const inLabel = clonedElement.querySelector('label[for="width-in"]');
    inLabel.setAttribute('for', 'width-in-' + uniqueSuffix);

    // Create a remove button and append it to the cloned element
    const removeButton = document.createElement('button');
    removeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm4.242 13.829a1 1 0 1 1-1.414 1.414L12 13.414l-2.828 2.829a1 1 0 0 1-1.414-1.414L10.586 12 7.758 9.171a1 1 0 1 1 1.414-1.414L12 10.586l2.828-2.829a1 1 0 1 1 1.414 1.414L13.414 12z" data-name="Layer 2" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>
    `;
    removeButton.className = 'wall-size__width-remove';
    removeButton.setAttribute('type', 'button');
    removeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      clonedElement.remove();
      this.hideResults();
    });
    clonedElement.appendChild(removeButton);

    originalElement.insertAdjacentElement('afterend', clonedElement);
  }

  addCentimeterWall() {
    const originalElement = document.getElementById('wall-centimeter-base-input');
    const clonedElement = originalElement.cloneNode(true);
    const uniqueSuffix = new Date().getTime(); // Use a timestamp for unique IDs
    clonedElement.removeAttribute('id');

    const cmInput = clonedElement.querySelector('input[name="width-cm"]');
    cmInput.value = '';
    cmInput.id = 'width-cm-' + uniqueSuffix;
    cmInput.name = 'width-cm-' + uniqueSuffix;

    const cmLabel = clonedElement.querySelector('label[for="width-cm"]');
    cmLabel.setAttribute('for', 'width-cm-' + uniqueSuffix);

    // Create a remove button and append it to the cloned element
    const removeButton = document.createElement('button');
    removeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm4.242 13.829a1 1 0 1 1-1.414 1.414L12 13.414l-2.828 2.829a1 1 0 0 1-1.414-1.414L10.586 12 7.758 9.171a1 1 0 1 1 1.414-1.414L12 10.586l2.828-2.829a1 1 0 1 1 1.414 1.414L13.414 12z" data-name="Layer 2" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>
    `;
    removeButton.className = 'wall-size__width-remove';
    removeButton.setAttribute('type', 'button');
    removeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      clonedElement.remove();
      this.hideResults();
    });
    clonedElement.appendChild(removeButton);

    originalElement.insertAdjacentElement('afterend', clonedElement);
  }

  // Update width and height from FormData for inches and centimeters

  updateSizes(formData) {
    if (this.measurementsSelect.value === 'in') {
      for (const pair of formData.entries()) {
        if (pair[0].includes('height-ft'))
        {
          this.wallHeight += +pair[1] * 12;
        }
        else if (pair[0].includes('height-in'))
        {
          this.wallHeight += +pair[1]
        }
        else if (pair[0].includes('width-ft'))
        {
          this.wallWidth += +pair[1] * 12;
        }
        else if (pair[0].includes('width-in'))
        {
          this.wallWidth += +pair[1]
        }
      }

      this.wallWidth = Math.abs(Math.round(this.wallWidth));
      this.wallHeight = Math.abs(Math.round(this.wallHeight));
    } else {
      // CM to IN (1in includes 2.54cm)
      for (const pair of formData.entries()) {
        if (pair[0].includes('height-cm'))
        {
          this.wallHeight += +pair[1] / 2.54;
        }
        else if (pair[0].includes('width-cm'))
        {
          this.wallWidth += +pair[1] / 2.54;
        }
      }

      this.wallWidth = Math.abs(Math.ceil(this.wallWidth));
      this.wallHeight = Math.abs(Math.ceil(this.wallHeight));
    }
  }

  // Calculate wallpapers data

  calculateWallpaperPanelsHeight() {
    return this.wallpaperPanelHeights.find((panelHeight) => panelHeight + 1 >= this.wallHeight);
  }

  calculateWallpaperPanelsCount() {
    return Math.ceil((this.wallWidth - 1) / 24);
  }

  // Calculate murals data

  calculateMuralsData() {
    // Define the ranges and corresponding matrix values
    const heightRanges = [[0, 49], [50, 73], [74, 97], [98, 109]];
    const widthRanges = [[0, 73], [74, 97], [98, 121], [122, 145], [146, 169]];
    const matrix = [
      [[72, 48], null, null, null],
      [null, [96, 72], [96, 96], null],
      [null, null, [120, 96], [120, 108]],
      [null, null, [144, 96], [144, 108]],
      [null, null, [168, 96], [168, 108]]
    ];

    // Find the index of the height range
    let heightIndex = -1;
    for (let i = 0; i < heightRanges.length; i++) {
        const [minHeight, maxHeight] = heightRanges[i];
        if (minHeight <= this.wallHeight && this.wallHeight <= maxHeight) {
            heightIndex = i;
            break;
        }
    }

    // Find the index of the width range
    let widthIndex = -1;
    for (let j = 0; j < widthRanges.length; j++) {
        const [minWidth, maxWidth] = widthRanges[j];
        if (minWidth <= this.wallWidth && this.wallWidth <= maxWidth) {
            widthIndex = j;
            break;
        }
    }

    // If both indexes are found, return the corresponding matrix value
    if (heightIndex !== -1 && widthIndex !== -1) {
        const size = matrix[widthIndex][heightIndex];
        if (size !== null) {
            return size;
        } else {
            return null;
        }
    } else {
        return null;
    }
  }
}

class CalculatorForm extends Calculator {
  constructor() {
    super();

    this.isShowAddCartButton = false;
    this.resultsMainInfo = this.querySelector('.results-main-info');
    this.contactForm = this.querySelector('.calculator-contact-form');
  }

  connectedCallback() {
    this.addWallButton?.addEventListener('click', () => {
      if (this.measurementsSelect.value === 'in') this.addInchWall();
      if (this.measurementsSelect.value === 'cm') this.addCentimeterWall();

      this.hideResults();
    })
    this.measurementsSelect?.addEventListener('change', this.changeMeasurements.bind(this));
    this.form?.addEventListener('input', () => {
      this.hideResults();
    })
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.wallWidth = 0;
      this.wallHeight = 0;
      const formData = new FormData(this.form);

      this.updateSizes(formData);
      if (this.wallWidth <= 0 || this.wallHeight <= 0) {
        this.errorElement?.removeAttribute('hidden');
        return
      }

      if (this.productType == 'wallpaper')
      {
        const panels = this.calculateWallpaperPanelsCount();
        const height = this.calculateWallpaperPanelsHeight();
        this.isShowAddCartButton = !!height;

        this.changeSelectedVariantWallpaper(24, height);
        this.changeQuantityWallpaper(panels, height);
        this.renderMarkupWallpaper(height, panels);
        this.showPrimaryButton();
      }
      else if (this.productType == 'wall-mural')
      {
        const muralSize = this.calculateMuralsData();
        this.isShowAddCartButton = !!muralSize;

        this.changeSelectedVariantMural(muralSize);
        this.renderMarkupMural(muralSize);
        this.showPrimaryButton();
      }
    })
  }

  hideResults() {
    super.hideResults();
    this.isShowAddCartButton = false;
    this.contactForm?.setAttribute('hidden', true);
    this.showPrimaryButton();
  }

  // Render markup

  renderMarkupWallpaper(wallpaperHeight, wallpaperPanelsCount) {
    const countText = wallpaperPanelsCount > 1 ? `${wallpaperPanelsCount} rolls` : `${wallpaperPanelsCount} roll`
    if (!wallpaperHeight) {
      this.resultsMainInfo.innerHTML = `
        <p class="results-main-info__custom-size">
          Custom size, please email us to request
        </p>
      `
      this.contactForm?.removeAttribute('hidden');
    } else {
      this.resultsMainInfo.innerHTML = `
        <p class="results-main-info__intro">According to your measurements you'll need:</p>
        <p class="results-main-info__main-text">${countText} of 24in x ${wallpaperHeight}in wallpaper</p>
      `
    }

    this.resultsElement?.removeAttribute('hidden');
  }

  renderMarkupMural(size) {
    if (!size) {
      this.resultsMainInfo.innerHTML = `
        <p class="results-main-info__custom-size">
          Custom size, please email us to request
        </p>
      `
      this.contactForm?.removeAttribute('hidden');
    } else {
      this.resultsMainInfo.innerHTML = `
        <p class="results-main-info__intro">We think you'll need:</p>
        <p class="results-main-info__main-text">${size[0]}in x ${size[1]}in wall mural</p>
      `
    }

    this.resultsElement?.removeAttribute('hidden');
  }

  // Pick correct variant logic
  changeSelectedVariantWallpaper(width, height) {
    if (!height) return;

    const sizeSelect = document.querySelector('.variant-input-wrap[data-handle="size"] select');

    for (let i = 0; i < sizeSelect.options.length; i++) {
      let option = sizeSelect.options[i];
      // Extract the dimensions from the option's value
      let match = option.value.match(/(\d+\.?\d*)”?\s*wide\s*x\s*(\d+\.?\d*)”?\s*high/);

      if (match) {
        let optionWidth = parseFloat(match[1]);
        let optionHeight = parseFloat(match[2]);

        // Compare with the provided width and height
        if (optionWidth === width && optionHeight === height) {
            // Set this option as selected
            sizeSelect.selectedIndex = i;
            sizeSelect?.dispatchEvent(new Event('change'));
            break;
        }
      }
    }
  }

  changeSelectedVariantMural(muralSize) {
    if (!muralSize) return;

    const [width, height] = muralSize;

    const sizeSelect = document.querySelector('.variant-input-wrap[data-handle="size"] select');

    for (let i = 0; i < sizeSelect.options.length; i++) {
      let option = sizeSelect.options[i];
      // Extract the dimensions from the option's value
      let match = option.value.match(/(\d+\.?\d*)['”"]?\s*wide\s*x\s*(\d+\.?\d*)['”"]?\s*high/);

      if (match) {
        let optionWidth = parseFloat(match[1]);
        let optionHeight = parseFloat(match[2]);

        // Compare with the provided width and height
        if (optionWidth === width && optionHeight === height) {
            // Set this option as selected
            sizeSelect.selectedIndex = i;
            sizeSelect?.dispatchEvent(new Event('change'));
            break;
        }
      }
    }
  }

  // Pick correct quantity (only for wallpaper) logic
  changeQuantityWallpaper(panels, height) {
    if (!height) return

    let quantityInput = document.querySelector(`#${this.dataset.productQuantityId}`);
    quantityInput.value = panels;
    quantityInput?.dispatchEvent(new Event('change'));
  }

  // Show calculate or addToCart
  showPrimaryButton() {
    const addCartButton = document.querySelector('.calculator__add-to-cart');
    const calculateButton = document.querySelector('.calculator-popup__submit');

    addCartButton?.setAttribute('hidden', !this.isShowAddCartButton);
    calculateButton?.setAttribute('hidden', this.isShowAddCartButton);
  }
}

customElements.define('calculator-from', CalculatorForm);


class CalculatorFormPage extends Calculator{
  constructor() {
    super();

    this.productTypeSelectElement = this.querySelector('#product-type');
    this.productType = this.productTypeSelectElement.value;
    this.resultDynamicTextElement = this.querySelector('.results-main-info .dynamic-text');
    this.clearButtons = this.querySelectorAll('.calculator__clear-button');
    this.wallpaperResultCollection = this.querySelector('#results-collection-wallpaper');
    this.muralResultCollection = this.querySelector('#results-collection-mural');
  }


  connectedCallback() {
    this.addWallButton?.addEventListener('click', () => {
      if (this.measurementsSelect.value === 'in') this.addInchWall();
      if (this.measurementsSelect.value === 'cm') this.addCentimeterWall();

      this.hideResults();
    })
    this.measurementsSelect?.addEventListener('change', this.changeMeasurements.bind(this));
    this.productTypeSelectElement?.addEventListener('change', this.changeProductType.bind(this));
    this.form?.addEventListener('input', () => {
      this.hideResults();
    })
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.wallWidth = 0;
      this.wallHeight = 0;
      const formData = new FormData(this.form);

      this.updateSizes(formData);
      console.log(this.wallWidth, this.wallHeight);
      if (this.wallWidth <= 0 || this.wallHeight <= 0) {
        this.errorElement?.removeAttribute('hidden');
        return
      }

      if (this.productType == 'wallpaper')
      {
        const panels = this.calculateWallpaperPanelsCount();
        const height = this.calculateWallpaperPanelsHeight();
        this.isShowAddCartButton = !!height;

        this.wallpaperResultCollection?.removeAttribute('hidden');
        this.renderMarkupWallpaper(height, panels);
      }
      else if (this.productType == 'wall-mural')
      {
        const muralSize = this.calculateMuralsData();
        this.isShowAddCartButton = !!muralSize;

        this.muralResultCollection?.removeAttribute('hidden');
        this.renderMarkupMural(muralSize);
      }
    })

    this.clearButtons.forEach(clearButton => {
      clearButton.addEventListener('click', super.hideResults.bind(this));
    })
  }

  changeProductType() {
    this.productType = this.productTypeSelectElement.value;
    this.hideResults();
  }

  hideResults() {
    super.hideResults();
    this.muralResultCollection?.setAttribute('hidden', true);
    this.wallpaperResultCollection?.setAttribute('hidden', true);
  }

  // Render markup

  renderMarkupWallpaper(wallpaperHeight, wallpaperPanelsCount) {
    const countText = wallpaperPanelsCount > 1 ? `${wallpaperPanelsCount} rolls` : `${wallpaperPanelsCount} roll`
    if (!wallpaperHeight) {
      this.resultDynamicTextElement.innerText = `Custom size, please email us to request`
    } else {
      this.resultDynamicTextElement.innerText = `${countText} of 24in x ${wallpaperHeight}in wallpaper`
    }

    this.resultsElement?.removeAttribute('hidden');
  }

  renderMarkupMural(size) {
    if (!size) {
      this.resultDynamicTextElement.innerText = `Custom size, please email us to request`
    } else {
      this.resultDynamicTextElement.innerText = `${size[0]}in x ${size[1]}in wall mural`
    }

    this.resultsElement?.removeAttribute('hidden');
  }

}

customElements.define('calculator-from-page', CalculatorFormPage);
