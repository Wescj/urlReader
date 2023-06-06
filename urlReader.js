const readline = require('readline');
const https = require('https');


let paused = false; //True = text print is paused
let speed = 1000// speed of printing

//Gets the next keystroke and proccesses it
function handleKeyPress() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (_, key) => {
    if (key.sequence === '\u0003') {
      process.exit();
    }else if (key.name === 'space') {
      paused = !paused;
      console.log('Spacebar pressed. Pausing...');
    }else if(key.sequence === '+'){
      
      if(speed != 0){
        speed -= 100;
      }
      console.log('+ has been pressed increasing speed to ',speed);
    }else if(key.sequence === '-'){
      speed += 100;
      console.log('- has been pressed decreasing speed to ',speed);
    }
    // console.log(key)
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
}


function printBinaryResource(data) {
  let offset = 0;
  while (offset < data.length) {
    const hexLine = [];
    for (let i = 0; i < 16 && offset + i < data.length; i++) {
      const byte = data.charCodeAt(offset + i); // Get the ASCII value of the character
      hexLine.push(byte.toString(16).padStart(2, '0'));
    }
    setTimeout(() => {
      console.log(`${offset.toString(16).padStart(8, '0')} ${hexLine.join(' ')}`);
    }, offset * 1000);
    offset += 16;
  }
}



function main() {
  const url = process.argv[2];
  if (!url) {
    console.log('Please provide a URL as an argument.');
    return;
  }

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const contentType = response.headers['content-type'] || '';
      if (contentType.startsWith('text')) {
        printTextResource(data);
      } else {
        console.log("testing printBinary")
        console.log(data.length)
        printBinaryResource([...data].map((char) => char.charCodeAt(0)));
      }
      
      
    });

    response.on('error', (error) => {
      console.log(`Failed to fetch resource from ${url}. Error: ${error.message}`);
    });
  });
  

}

main();
// process.exit(0);

//cd C:\Users\Wescj\Documents\School\Atla Coding\
// node urlReader.js https://example.com/
// node urlReader.js https://picsum.photos/200/300
