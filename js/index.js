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
// ________________________________________________________________________________
const burger = document.querySelector(".burger");
const menu = document.querySelector(".header__nav");
const body = document.body;

burger.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("burger--active");
  menu.classList.toggle("header__nav--active");
  body.classList.toggle("stop-scroll");
});

