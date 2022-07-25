import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <input id="height"></input>
        <input id="width"></input>
        <button id="btn" onClick={() => generate()}>Generate</button>
      </header>
    </div>
  );
}

function generate() {
  console.log(document.getElementById("width").value + " " + document.getElementById("height").value)
  var randomImage = URL.createObjectURL(CreateFile(document.getElementById("width").value, document.getElementById("height").value))
  console.log("image generated! URL: " + randomImage)
  render(
    <div className="App">
      <header className="App-header">
        <div className='App-Image'>
          <img src={randomImage} height='200' alt="randomImage" />
        </div>
        <div>
          <a download="random image.bmp" href={randomImage} id="link">Download</a>
        </div>
      </header>
    </div>
  )
}

function CreateFile(width, height) {
  var pixelArraySize = width * height * 4
  var fileSize = 122 + pixelArraySize
  let fileSizeArray = cutToByteArray(fileSize)
  let heightArray = cutToByteArray(height)
  let widthArray = cutToByteArray(width)

  var byteArray = generateHeaderAndDIB(fileSizeArray, widthArray, heightArray)

  //This loop randomly generates bytes to represent the pixels in the generated image.
  for (var h = 0; h < pixelArraySize; h++) {
    byteArray.push(Math.floor(Math.random() * 256))
  }

  var newFile = new Blob([new Uint8Array(byteArray)], { type: 'image/bmp' })
  return newFile
}

function generateHeaderAndDIB(fileSizeArray, widthArray, heightArray) {
  return [
    //Code for BMP file types
    0x42, 0x4D,
    //File size (BMP Header + DIB Header + Pixels size)
    fileSizeArray[0], fileSizeArray[1], fileSizeArray[2], fileSizeArray[3],
    //Filler bits
    0x00, 0x00,
    //Filler bits
    0x00, 0x00,
    //Location of the pixel array
    0x7A, 0x00, 0x00, 0x00,

    //Number of bytes in this header only (doesn't include BMP Header)
    0x6C, 0x00, 0x00, 0x00,
    //Width of pixels
    widthArray[0], widthArray[1], widthArray[2], widthArray[3],
    //Height of pixels
    heightArray[0], heightArray[1], heightArray[2], heightArray[3],
    //Number of color planes
    0x01, 0x00,
    //Number of bits per pixel
    0x20, 0x00,
    //BI_BITFIELDS???
    0x03, 0x00, 0x00, 0x00,
    //Size of the raw bitmap data (with padding)
    0x20, 0x00, 0x00, 0x00,
    //Print resolution of the image
    0x13, 0x0B, 0x00, 0x00,
    0x13, 0x0B, 0x00, 0x00,
    //Number of colors in the pallete
    0x00, 0x00, 0x00, 0x00,
    //Number of important colors
    0x00, 0x00, 0x00, 0x00,
    //Red channel bit mask
    0x00, 0x00, 0xFF, 0x00,
    //Green channel bit mask
    0x00, 0xFF, 0x00, 0x00,
    //Blue channel bit mask
    0xFF, 0x00, 0x00, 0x00,
    //Alpha channel bit mask
    0x00, 0x00, 0x00, 0xFF,
    //LCS_WINDOWS_COLOR_SPACE
    0x20, 0x6E, 0x69, 0x57,
    //Unused for LCS "Win" or "sRGB"
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    //Unused for LCS Red Gamma
    0x00, 0x00, 0x00, 0x00,
    //Unused for LCS green Gamma
    0x00, 0x00, 0x00, 0x00,
    //Unused for LCS blue Gamma
    0x00, 0x00, 0x00, 0x00
  ]
}

function cutToByteArray(numInput) {
  var remainderArray = []
  var remainder
  while (numInput >= 256) {
    remainder = parseInt(numInput % 256)
    remainderArray.push(remainder)
    numInput = parseInt(numInput / 256)
  }
  remainder = parseInt(numInput % 256)
  remainderArray.push(remainder)
  var hexArray = []
  var padding = 4 - remainderArray.length
  var remainderLength = remainderArray.length
  for (var i = 0; i < remainderLength; i++) {
    hexArray.push((remainderArray.shift()))
  }
  for (var j = 0; j < padding; j++) {
    hexArray.push(0)
  }
  return hexArray
}

export default App;
