class MagnifyZoomer {
  constructor(magnifyDiv, smallImage) {
    this.magnifyDiv = magnifyDiv;
    this.smallImage = smallImage;
  }

  // Methods (potentially lead with static for class-level like Math.Pow())
  // init() {}; hoisted
  // --OR--
  // init = function() {}; No hoisting
  // --OR--
  init = () => { // Doesn't reset 'this' value; no hoisting
    this.nativeWidth = 0;
    this.nativeHeight = 0;
    this.imageObject = new Image();
    this.imageObject.src = this.smallImage.src;

    this.imageObject.onload = this.imageZoom;
  };

  imageZoom = () => {
    console.log(`The image is: ${this.imageObject.src}\nImage width = ${this.imageObject.width}\nImage height = ${this.imageObject.height}`)
    this.nativeWidth = this.imageObject.width;
    this.nativeHeight = this.imageObject.height;
    let glass = this.magnifyDiv.querySelector(`.large`),
        mouseX,
        mouseY,
        magnifyOffsetLeft,
        magnifyOffsetTop,
        halfGlassHeight,
        halfGlassWidth,
        posX,
        posY,
        backgroundX,
        backgroundY;

    this.nativeWidth = this.imageObject.width;
    this.nativeHeight = this.imageObject.height;
    
    this.magnifyDiv.addEventListener('mousemove', e => {
      if (glass.style.display != 'block') {
        glass.style.display = 'block';
      }
      if (glass.style.opacity != 1) {
        glass.style.opacity = 1;
      }
      if (glass.style.cursor != 'none') {
        glass.style.cursor = 'none';
      }
      magnifyOffsetLeft = e.currentTarget.offsetLeft;
      magnifyOffsetTop = e.currentTarget.offsetTop;
      mouseX = e.pageX - magnifyOffsetLeft;
      mouseY = e.pageY - magnifyOffsetTop;

      halfGlassWidth = glass.offsetWidth / 2;
      halfGlassHeight = glass.offsetHeight / 2;
      posX = mouseX - halfGlassWidth;
      posY = mouseY - halfGlassHeight;

      backgroundX = Math.round(halfGlassWidth - mouseX / this.smallImage.width * this.nativeWidth);
      backgroundY = Math.round(halfGlassHeight - mouseY / this.smallImage.height * this.nativeHeight);

      // glass.style.top = `${posY}px`;
      // glass.style.left = `${posX}px`;
      glass.style.inset = `${posY}px ${posX}px`
      glass.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`

      if (mouseX <= 0 || mouseX > this.smallImage.width || mouseY <= 0 || mouseY > this.smallImage.height) {
        glass.style.opacity = 0;
        glass.style.display = 'none';
      }
    });
  }
}

let getStarted = () => {
  const magnifier = new MagnifyZoomer(document.querySelector('.magnify'), document.querySelector('.small'));
  // console.log(`magnifyDiv.class = ${magnifier.magnifyDiv.className}`);
  // console.log(`smallImage.src = ${magnifier.smallImage.src}`)

  magnifier.init();
}

// if getStarted(), it will trigger when setting the event listner, not when it triggers
// document.addEventListener("DOMContentLoaded", getStarted);
window.onload = getStarted;