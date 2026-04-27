const
  sliderDiv = document.querySelector('.slider'),
  slide = sliderDiv.querySelector('.slide'),
  prevButton = sliderDiv.querySelector('.prev'),
  nextButton = sliderDiv.querySelector('.next');
let
  slideIndex = 0,
  intervalId = null;
  picFileNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  captions = ['Juneau, Alaska from Douglas Island', 'Juneau, Alaska at night', 'Float plane', 'Western Columbine', 'Franklin Street Barbers', 'Totem', 'Saint Theresa', 'The Shrine', 'Foggy Mountains', 'Black Capped Chickadee'],
  dotSpans = [],
  picCaption = document.querySelector('.slides > p:last-child'),
  dotsNav = document.createElement('nav');

let nextSlide = () => {
  clearInterval(intervalId);
  slideIndex = (slideIndex + 1) % picFileNames.length;
  showSlide();
};

let prevSlide = () => {
  clearInterval(intervalId);
  slideIndex = (slideIndex - 1 + picFileNames.length) % picFileNames.length;
  showSlide();
};

let indexSlide = e => {
  clearInterval(intervalId);
  slideIndex = parseInt(e.target.id);
  showSlide();
};

let showSlide = () => {
  let currentDotSpan = document.querySelector('.currentDot');
  if (currentDotSpan) {
    currentDotSpan.classList.remove('currentDot');
  }
  
  dotSpans[slideIndex].classList.add('currentDot');
  slide.classList.remove('displaySlide');
  setTimeout(() => {
    slide.src = `images/pics/pic${picFileNames[slideIndex]}.jpg`;
    picCaption.textContent = captions[slideIndex];
    slide.classList.add('displaySlide');
  }, 25);
  intervalId = setInterval(nextSlide, 2000);
};

let initializeSlider = () => {
  slide.classList.add('displaySlide');
  dotSpans[slideIndex].classList.add('currentDot');
  intervalId = setInterval(nextSlide, 2000);
};

dotsNav.classList.add('dots');

for (let i = 0; i < picFileNames.length; i++) {
  dotSpans[i] = document.createElement('span');
  dotSpans[i].id = i;
  dotSpans[i].addEventListener('click', indexSlide);
  dotsNav.append(dotSpans[i]);
}
sliderDiv.append(dotsNav);

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

document.addEventListener('DOMContentLoaded', initializeSlider);
