import * as Utils from '/utils.js';

let map = new Utils.Map(50, 30);
const app = new PIXI.Application();
await app.init({ background: Utils.settings.backgroundColor, width:window.innerWidth, height:window.innerHeight-32 });

document.getElementById("canvas-container").appendChild(app.canvas);

//Make it looks pixelated and make PIXIJS render everything correctly
PIXI.TextureStyle.defaultOptions.scaleMode = "nearest"
//Load everything
await PIXI.Assets.load('texture.png');
const spriteSheetData = await PIXI.Assets.load('texture.json')

// Create the SpriteSheet from data and image
const spritesheet = new PIXI.Spritesheet(
	PIXI.Texture.from('texture.png'),
	spriteSheetData.data
);

// Generate all the Textures asynchronously
await spritesheet.parse();
// Create the sprite and add it to the stage
console.log(spritesheet)

let drawContainer = new PIXI.Container();
drawContainer.x = 0;
drawContainer.y = 0;
drawContainer.interactive = true
drawContainer.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight-32)
drawContainer.eventMode = "dynamic";
drawContainer.scale.set(5);
console.log(drawContainer)
app.stage.addChild(drawContainer);

let drawBlock = "BedrockBlock";
let isDrawing = false;

drawContainer.on("mousedown", (event) => {
	isDrawing = true;
	draw(event.client.x, event.client.y);
});
drawContainer.on("touchstart", (event) => {
	isDrawing = true;
	draw(event.client.x, event.client.y);
});
drawContainer.on("mousemove", (event) => {
	if(isDrawing){
		draw(event.client.x, event.client.y);
	}
});
drawContainer.on("touchmove", (event) => {
	if(isDrawing){
		draw(event.client.x, event.client.y);
	}
});
drawContainer.on('mouseup', (event) => {
	isDrawing = false;
});
drawContainer.on( "touchend", (event) => {
	isDrawing = false;
});

app.ticker.add((ticker) => {
	
});



function startDrawing(evt) {
	isDrawing = true;
	draw(evt);
}

function stopDrawing() {
	isDrawing = false;
}

let palette = new PIXI.Application();
await palette.init({ background: '#fff', width: 380, height:48*9 });
document.getElementById("palette").appendChild(palette.canvas);
function createPalette(){
	for(let i = 0; i < Utils.palette.length; i++){
		let element = new PIXI.Sprite(spritesheet.textures[Utils.palette[i].label])
		element.x=i*48-((48*8)*Math.floor(i/8));
		element.y=Math.floor(i/8)*48;
		element.scale.set(5);
		element.interactive = true;
		element.eventMode = "dynamic";
		element.on("mousedown", (event) => {
			drawBlock = Utils.palette[i].label;
			console.log(Utils.palette[i].label);
		});
		element.on("touchstart", (event) => {
			drawBlock = Utils.palette[i].label;
			console.log(Utils.palette[i].label);
		});
		palette.stage.addChild(element);
	}
}

createPalette();

function clearCanvas() {
	drawContainer.removeChildren();
}

function saveCanvas() {
	const dataURL = canvas.toDataURL('image/png');
	const link = document.createElement('a');
	link.download = 'bitmap-image.png';
	link.href = dataURL;
	link.click();
}

const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', clearCanvas);

const saveButton = document.getElementById('save');
saveButton.addEventListener('click', saveCanvas);

function draw(x, y){
	let xPos = Math.floor(x/(Utils.settings.pixelScale*8))
	let yPos = Math.floor((y-32)/(Utils.settings.pixelScale*8))
	console.log(xPos, yPos);
	if(xPos >= 0 && xPos < map[0].length && yPos >= 0 && yPos < map.length){
		let block = new PIXI.Sprite(spritesheet.textures[drawBlock]);
		block.x = xPos*8;
		block.y = yPos*8;
		if(map[yPos][xPos] === 0){
			drawContainer.addChild(block);
		}
	}
}
