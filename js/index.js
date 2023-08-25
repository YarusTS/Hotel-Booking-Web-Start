const swiper = new Swiper(".swiper", {
  // Optional parameters
  // direction: "vertical",
  // hashNavigation: true,
  direction: "horizontal",
  loop: true,
  // autoplay: {
  //   delay: 5000,
  // },

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    // clickable: true,
    // type: "bullets",
    clickable: false,
    type: false,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    // el: ".swiper-scrollbar",
    el: false,
  },
});


/* ________________________________________JustValidate__________________________________________ */
let form = document.querySelector('.js-form');
let telSelector = form.querySelector('input[type="tel"]');
let inputMask = new Inputmask('+7 (999) 999-99-99');
inputMask.mask(telSelector);

const validation = new JustValidate('.js-form',
{
  errorFieldCssClass: 'is-invalid',
  errorLabelCssClass: 'is-label-invalid',
  errorLabelStyle: { color: '#d11616', },
  errorFieldStyle: { border: '1px solid red',},
},);

validation
  .addField('.input-name', [
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Введено мало символов, от 2-х',
    },
    {
      rule: 'maxLength',
      value: 10,
      errorMessage: 'Введено более 10 символов!',
    },
    {
      rule: 'required',
      value: true,
      errorMessage: 'Введите имя!',
    }
  ])
  .addField('.input-tel', [
    {
      rule: 'required',
      value: true,
      errorMessage: 'Телефон обязателен',
    },
    {
      rule: 'function',
      validator: function () {
        const phone = telSelector.inputmask.unmaskedvalue();
        return phone.length === 10;
      },
      errorMessage: 'Введите корректный телефон!',
    },
  ]);

function submitform() {
  if (validation.isValid) {
    form.submit();
  }
};

const burger = document.querySelector(".burger");
const menu = document.querySelector(".header__nav");
const body = document.body;

burger.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("burger--active");
  menu.classList.toggle("header__nav--active");
  body.classList.toggle("stop-scroll");
});
// ________________________________________________________________________________
// Модальное окно
class Modal {
  constructor(options) {
    let defaultOptions = {
      isOpen: () => { }
    }
    this.options = Object.assign(defaultOptions, options);
    this.modal = document.querySelector('.modal');
    this.speed = false;
    this.animation = false;
    this.isOpen = false;
    this.modalContainer = false;
    this.previousActiveElement = false;
    this.fixBlocks = document.querySelectorAll('.fix-block');
    this.focusElements = [
      'a[href]',
      'input',
      'button',
      'select',
      'textarea',
      '[tabindex]'
    ];
    this.events();
  }
  events() {
    if (this.modal) {
      document.addEventListener('click', function (e) {
        const clickedElement = e.target.closest('[data-path]');
        if (clickedElement) {
          let target = clickedElement.dataset.path;
          let animation = clickedElement.dataset.animation;
          let speed = clickedElement.dataset.speed;
          this.animation = animation ? animation : 'fade';
          this.speed = speed ? parseInt(speed) : 700;
          this.modalContainer = document.querySelector(`[data-target="${target}"]`);
          this.open();
          return;
        }
        if (e.target.closest('.modal-close')) {
          this.close();
          return;
        }
      }.bind(this));
      window.addEventListener('keydown', function(e) {
        if (e.keyCode == 27) {
          if (this.isOpen) {
            this.close();
          }
        }

        // console.log(e.keyCode == 9)

        if (e.keyCode == 9 && this.isOpen) {
          this.focusCatch(e);
          return;
        }
      }.bind(this));

      this.modal.addEventListener('click', function(e) {
        if (!e.target.classList.contains('modal__container') && !e.target.closest('.modal__container') && this.isOpen) {
          this.close();
        } 
        
      }.bind(this));
    }
  }
  open() {
    this.previousActiveElement = document.activeElement;
    this.modal.style.setProperty('$transition-time', `${this.speed / 1000}s`);
    this.modal.classList.add('is-open');
    this.disableScroll();
    this.modalContainer.classList.add('modal-open');
    this.modalContainer.classList.add(this.animation);

    setTimeout(() => {
      this.options.isOpen(this);
      this.modalContainer.classList.add('animate-open');
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }

  close() {
    if (this.modalContainer) {
      this.modalContainer.classList.remove('animate-open');
      this.modalContainer.classList.remove(this.animation);
      this.modal.classList.remove('is-open');
      this.modalContainer.classList.remove('modal-open');

      this.enableScroll();
      this.isOpen = false;
      this.focusTrap();
    }
  }

  focusCatch(e) {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    const focusArray = Array.prototype.slics.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if(e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if(!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const focusable = this.modalContainer.querySelectorAll(this.focusElements);
    if (this.isOpen) {
      focusable[0].focus();
    } else {
      this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    let pagePosition = window.scrollY;
    this.lockPadding();
    document.body.classList.add('disable-scroll');
    document.body.dataset.position = pagePosition;
    document.body.style.top = -pagePosition + 'px';
  }

  enableScroll() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    this.unlockPadding();
    document.body.style.top = 'auto';
    document.body.classList.remove('disable-scroll');
    window.scroll({ top: pagePosition, left: 0 });
    document.body.removeAttribute('data-position');
  }

  lockPadding() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    document.body.style.paddingRight = paddingOffset;
  }

  unlockPadding() {
    this.fixBlocks.forEach((el) => {
      el.style.paddingRight = '0px';
    });
    document.body.style.paddingRight = '0px';
  }
}

const modal = new Modal({
  isOpen: (modal) => {
    console.log(modal);
    // modal.modalContainer.classList.add('asd')
    console.log('opened');
  },
});

// console.log('asd')

// ________________________________________________________________________________
/* ________________________________________JustValidate1__________________________________________ */
let form1 = document.querySelector('.js-form1');
let telSelector1 = form1.querySelector('input[type="tel"]');
let inputMask1 = new Inputmask('+7 (999) 999-99-99');
inputMask1.mask(telSelector1);

const validation1 = new JustValidate('.js-form1',
{
  errorFieldCssClass: 'is-invalid',
  errorLabelCssClass: 'is-label-invalid',
  errorLabelStyle: { color: '#d11616', },
  errorFieldStyle: { border: '1px solid red',},
},);

validation1
  .addField('.input-name1', [
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Введено мало символов, от 2-х',
    },
    {
      rule: 'maxLength',
      value: 10,
      errorMessage: 'Введено более 10 символов!',
    },
    {
      rule: 'required',
      value: true,
      errorMessage: 'Введите имя!',
    }
  ])
  .addField('.input-tel1', [
    {
      rule: 'required',
      value: true,
      errorMessage: 'Телефон обязателен',
    },
    {
      rule: 'function',
      validator: function () {
        const phone1 = telSelector.inputmask.unmaskedvalue();
        return phone1.length === 10;
      },
      errorMessage: 'Введите корректный телефон!',
    },
  ]);

function submitform1() {
  if (validation.isValid) {
    form1.submit();
  }
};
// ________________________________________________________________________________
