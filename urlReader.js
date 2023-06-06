const readline = require('readline');
const https = require('https');


let paused = false; //True = text print is paused
let speed = 1000// speed of printing lines

//Gets the next keystroke and proccesses it
function handleKeyPress() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (_, key) => {
    if (key.sequence === '\u0003') {
      process.exit();
    }else if (key.name === 'space') {
      paused = !paused;
      // console.log('Spacebar pressed. Pausing...');
    }else if(key.sequence === '+'){
      
      if(speed != 0){
        speed -= 100;
      }
      // console.log('+ has been pressed increasing speed to ',speed);
    }else if(key.sequence === '-'){
      speed += 100;
      // console.log('- has been pressed decreasing speed to ',speed);
    }
    // console.log(key)
  });
}

//function to create delays 
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//prints each line of text in the specified format
async function printTextResource(text) {
  const lines = text.split('\n');
  let timer;
  let index = 0;
  handleKeyPress()
  
  while(index < lines.length){
    await delay(speed);
    if(!paused){
      console.log(`${index + 1}: ${lines[index]}`);
      index++
    }
  }
  process.exit(0)
}

//Function prints the data as a hexadecimal in the specified format
async function printBinaryResource(data) {
  let offset = 0;
  handleKeyPress()

  while (offset < data.length) {
    const hexLine = [];
    await delay(speed); 

    if(!paused){
      for (let i = 0; i < 16 && offset + i < data.length; i += 2) { // Increment i by 2 to process two characters at a time
        const byte = parseInt(data.substr(offset + i, 2), 16); // Parse two characters as a hexadecimal byte
        hexLine.push(byte.toString(16).padStart(2, '0'));
      }
      console.log(`${offset.toString(16).padStart(8, '0')} ${hexLine.join(' ')}`);
      // Increment offset by 16 to process two characters per iteration
      offset += 16;
    }
     
  }
  process.exit(0)
}



function main() {
  const url = process.argv[2];
  if (!url) {
    console.log('Please provide a URL as an argument.');
    return;
  }

  https.get(url, (response) => {
    const chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk)
    });

    response.on('end', () => {
      const contentType = response.headers['content-type'] || '';
      if (contentType.startsWith('text')) {
        const buffer = Buffer.concat(chunks);
        const textData = buffer.toString();
        // console.log(textData)
        printTextResource(textData);
      } else {
        // converts the chunks to hex 
        const buffer = Buffer.concat(chunks);
        const hexData = buffer.toString('hex');
        // console.log(hexData)
        printBinaryResource(hexData);   
      }
      
    });

    response.on('error', (error) => {
      console.log(`Failed to fetch resource from ${url}. Error: ${error.message}`);
      process.exit(1)
    });
  });
 

}

main();

//cd C:\Users\Wescj\Documents\School\Atla Coding\
// node urlReader.js https://example.com/
// node urlReader.js https://picsum.photos/200/300
// node urlReader.js https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI
