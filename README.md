# urlReader
node urlReader.js https://example.com/
● If the resource is text, it prints one line of that text per second, preceded by line numbers,
then exits.
● If the resource is not text, it prints 16 bytes of the resource per line, in hexadecimal with a
space between each byte, preceded by file offset in hex, one line per second (similar to
the output of "od -t x1" on Linux)

#Controls
"+" increases the speed by 100 milliseconds
"-" decreases the speed by 100 milliseconds
" " pauses printing until it is pressed again

## Usage
```sh
node urlReader.js https://example.com/
```
