const canvas = document.getElementById("frame"); // Select the canvas by ID
const frames = {
  currentFrames: 0, // Start from the first available frame
  maxIndex: 1345, // Update to the highest index you have
};

let imagesLoaded = 0;
const images = [];

function preloadImages() {
  for (let i = 0; i <= frames.maxIndex; i++) {
    const imgUrl = `./frames/frame_${i.toString().padStart(4, "0")}.jpg`;
    console.log(`Loading image: ${imgUrl}`); // Log URL for debugging
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === frames.maxIndex + 1) {
        loadImage(frames.currentFrames);
        startAnimation(); // Start the animation after all images are preloaded
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${imgUrl}`);
      // Optional: Remove failed images from array if necessary
      // images[i] = null;
    };
    images.push(img);
  }
}

function loadImage(index) {
  index = Math.round(index);

  if (index >= 0 && index <= frames.maxIndex) {
    const img = images[index];

    if (img) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;

      const scale = Math.max(scaleX, scaleY);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      frames.currentFrames = index;
    } else {
      console.error(`Image at index ${index} is undefined.`);
    }
  }
}

function startAnimation() {
  gsap.to(frames, {
    currentFrames: frames.maxIndex,
    scrollTrigger: {
      trigger: ".parent",
      start: "top top",
      scrub: 2,
      markers: true,
      onUpdate: () => {
        loadImage(frames.currentFrames);
      },
    },
  });
}

// Start preloading images when the script loads
preloadImages();
