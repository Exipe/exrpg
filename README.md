# ExRPG 

A base for a browser based, online RPG.

### Technologies used
 * TypeScript
 * Node.js
 * WebGL
 * WebSocket
 * Electron
 * React

# Features
 * Map editor
   * Import/export (JSON format)
   * Place tiles and attributes
   * Resize, with an anchor point
 * Register / log in
 * Day / night system
 * Path finding
 * Inventory / equipment
 * NPC:s, with basic dialogues
 * Interact with the world
   * Put down - / pick up items
   * Cut down trees
   * Mine rocks
 * Chat box
 * Command system

### In-game
![in-game screenshot](https://www.dropbox.com/s/m2z9s2upakvztv5/in-game.png?raw=1)

### Menu
![menu screenshot](https://www.dropbox.com/s/sju8p0r4czhifbl/menu.png?raw=1)

### Map editor
![map editor screenshot](https://www.dropbox.com/s/bamb40x0eva7apa/mapedit.png?raw=1)


# Set up

### Building game / mapedit

To build either the game or the map editor, you must first build the engine.
Install the TypeScript compiler, if you have not already;

```npm install -g typescript```

Then, run the compiler from the engine package; ```tsc```

When you have done so, you must create a [symlink](https://docs.npmjs.com/cli/link) to the engine package.
Navigate to the game or mapedit package. Then, simply run;

```npm link ../engine``` (or which ever path to the engine package)

You can now build this package normally, using webpack.

### Running the server

To start the server, you must first tell it where to find certain resource files.
To do this, edit the ```"resPath"``` field in exconfig.json.
This path must point to the app/res directory, found in the game package.

I recommend setting up a local web server, with the app directory as its root.
I use [http-server](https://www.npmjs.com/package/http-server) for this purpose.
