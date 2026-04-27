class NorthShoreGallery {
  // These two arrays are indexed; map 1:1 to each other.
	static picFileNames = new Array('Lighthouse', 'Trail', 'BeachRock', 'Breakers', 'HotelBeach', 'SurfSpray', 'RedRock', 'Sunset', 'GooseberryFalls', 'Cascades', 'Temperance', 'FallColors');
	
	static captions = ["Split Rock Lighthouse", "Superior Trail", "Beach Rock", "Breakers", "AmericInn Beach", "Surf Spray", "Superior Red Rock", "Superior Sunset", "Gooseberry Falls", "Cascades at Squatch Rock", "The Temperance", "Fall Colors"];

  static picCaption = document.querySelector('.picCaption');

  constructor(northShoreImage) {
    this.northShoreImage = northShoreImage;
  }

  init = () => {
    this.northShoreImage.addEventListener('mouseleave', () => {
      this.northShoreImage.src = `images/pic${NorthShoreGallery.picFileNames[0]}.jpg`;
      NorthShoreGallery.picCaption.textContent = NorthShoreGallery.captions[0];
    });
    this.northShoreImage.addEventListener('mouseenter', this.showRandomImage);
  };

  showRandomImage = e => {
    let imageNum = Math.floor(Math.random() * (NorthShoreGallery.picFileNames.length - 1)) + 1;
    e.target.src = `images/pic${NorthShoreGallery.picFileNames[imageNum]}.jpg`;
    NorthShoreGallery.picCaption.textContent = NorthShoreGallery.captions[imageNum];
  };
}

imageGallery = () => {
  let galleryInstance = new NorthShoreGallery(document.querySelector('#northShorePic'));
  galleryInstance.init();
};

window.onload = imageGallery;
