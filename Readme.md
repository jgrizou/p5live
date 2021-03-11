# p5live

Sketches opened via https://p5live.jgrizou.repl.co/ will refresh automatically each time you save and run your sketches in the p5.js editor. 

## Video

Short demo (2min): https://youtu.be/_MkSuxJA6Rs
Longer demo (5min): https://youtu.be/h-FjfuE0gPc

## Use-case

This is useful when your work is hard to access but need to be debugged/tweaked interactively and iteratively. 

For example if your p5.js sketch is displayed on a networked TV, an interactive board or a tablet/smarthphone installed in a phsycial frame.

It is also very helful when debugging on multiple screen sizes e.g. tablet, smartphone, full- or half-screen. With p5live, you do not have to refresh every screen manually, they will all update at once remotely.

## Example

1. Open our demo p5.js sketch https://editor.p5js.org/jgrizou/sketches/Keik1He5v
2. If you go to https://p5live.jgrizou.repl.co/jgrizou/Keik1He5v, you will find the same sketch in full screen
3. Each time you click the PLAY button on the p5 editor, p5live version will auto-reload. 

*Note that only saved changes are propagated, so you will need to create an account and follow the steps below to get the full benefit. *

## Getting started

1. Create a p5.js account and start a sketch at https://editor.p5js.org/. 
2. Identify your `username` and `sketchID` in the editor url. For example, for https://editor.p5js.org/jgrizou/sketches/Keik1He5v, the username is `jgrizou`, and the sketchId is `Keik1He5v`
3. Load the socket.io v2.3.0 library in your p5.js project. In the header of `index.html` simply add the following:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js">
```
4. Add a small script at the top of your `sketch.js` file that will trigger the reload action. Simple copy the following code at the top of the file. 
```js
// we check if this is running in the editor
if (location.href == 'about:srcdoc') {
  // if yes, we connect ot the socket.io server
  const socket = io("https://p5live.jgrizou.repl.co/");
  socket.on('connect', () => {
    // on connect, we emit a reload message for our sketch
    socket.emit('reload', { username : YOUR_USERNAME, sketchId : YOUR_SKETCH_ID });
  });
}
```
5. Go to https://p5live.jgrizou.repl.co/, enter your username and sketchId. Or directly open https://p5live.jgrizou.repl.co/USERNAME/SKETCH_ID.
6. Test it, each time you save and click the PLAY button on the p5.js editor, the page at p5live will also be reloaded with the latest changes. Remember to save the sketch in p5.js (`CTRL+S`) otherwise it will not reload the latest version.

Hopefully this will be fully intergrated within the p5.js editor at some point and you will not need to do any of the step above. To help make this happen, please show your support at GITHUB_ISSUE.

## How it works

Technical details: https://youtu.be/jMjfwORo1RE

https://repl.it/@jgrizou/p5live