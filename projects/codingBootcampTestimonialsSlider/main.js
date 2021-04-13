let elements = {
  nextBtn: document.querySelector('.nextBtn'),
  prevBtn: document.querySelector('.prevBtn'),
  slides: document.querySelectorAll('.slide'),
  slidesContainer: document.querySelector('.slidesContainer')
};
/** To clone last element in beginning of slides container 
    and clone first element in the end of slides container. 
    All this is done to create the effect of infinite loop
    in slider.
*/
cloneDom(elements.slides, elements.slidesContainer);
// To display initial first slide
var slideNum = 1;
// Calculate the width of user window in order to use in transformation of slidesContainer
let slideWidth = elements.slides[0].clientWidth;
elements.slidesContainer.style.transform = `translateX(-${slideWidth * slideNum}px)`;

function changeSlideNum(num) {
  slideNum = slideNum + num;
  if(slideNum >= elements.slides.length+2) {
    slideNum = 2;
  } else if(slideNum < 0) {
    slideNum = elements.slides.length;
  }
}


function showSlide(slideNum) {
  elements.slidesContainer.style.transform = `translateX(-${slideWidth * slideNum}px)`;
  console.log(slideNum);
}

// Event listener for click
window.addEventListener('click', (e) => {
  let target = e.target.className;
  if(target === 'nextBtn') {
    elements.slidesContainer.style.transition = 'transform .4s ease-in-out';
    changeSlideNum(1);
    showSlide(slideNum);
  } else if(target === 'prevBtn') {
    elements.slidesContainer.style.transition = 'transform .4s ease-in-out';
    changeSlideNum(-1);
    showSlide(slideNum);
  }
});


// Event listener for user to change slide via keyboard
// or event listener for right/left arrow key
window.addEventListener('keyup', (e) => {
  let targetKey = e.keyCode ? e.keyCode : e.which;
  if(targetKey === 39) {
    elements.slidesContainer.style.transition = 'transform .4s ease-in-out';
    changeSlideNum(1);
    showSlide(slideNum);
  } else if(targetKey === 37) {
    elements.slidesContainer.style.transition = 'transform .4s ease-in-out';
    changeSlideNum(-1);
    showSlide(slideNum);
  }
});

function cloneDom(slides, container) {
  const firstElementMarkup = slides[0].outerHTML.toString();
  const lastElementMarkup = slides[slides.length-1].outerHTML.toString();
  
  container.insertAdjacentHTML('beforeend', firstElementMarkup);
  container.insertAdjacentHTML('afterbegin', lastElementMarkup);
  
  container.children[0].id = 'last';
  container.children[container.children.length-1].id = 'first';
}

elements.slidesContainer.addEventListener('transitionend', () => {
  if(slideNum === elements.slides.length+1) {
    elements.slidesContainer.style.transition = 'none';
    slideNum = 1;
    showSlide(slideNum);
  } else if(slideNum === 0) {
    elements.slidesContainer.style.transition = 'none';
    slideNum = elements.slides.length;
    showSlide(slideNum);
  }
});
