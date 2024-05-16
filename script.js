let texture = new Image();
texture.src = "textures.png";
let map = [];
settings = {
	mapWidth: 32,
	mapHeight: 32,
};
let exportCanvas = document.getElementById("exportCanvas");
let exportCtx = exportCanvas.getContext("2d");
//Create canvas function
function createHiPPICanvas(width, height) {
	const ratio = window.devicePixelRatio;
	const canvas = document.createElement("canvas");

	canvas.width = width * ratio;
	canvas.height = height * ratio;
	canvas.style.width = width + "px";
	canvas.style.height = height + "px";
	canvas.getContext("2d").scale(ratio, ratio);

	return canvas;
}

const canvas = createHiPPICanvas(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(canvas);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let pixelSize = 8;
let scrollX, scrollY;
setScrollValues();
function setScrollValues() {
	scrollX = Math.floor(
		(window.innerWidth - pixelSize * settings.mapWidth) / 2,
	);
	scrollY = Math.floor(
		(window.innerHeight - pixelSize * settings.mapHeight) / 2,
	);
}
//let currentColor = "#353535";
let currentFrame = textures["frames"]["DirtBackgroundBlock"];
currentFrame.color = palette[7].color;

let isDrawing = false;

function startDrawing(evt) {
	isDrawing = true;
	addPixel(evt);
}
function addPixel(evt) {
	if (!isDrawing) return;
	const x = Math.floor((evt.offsetX - scrollX) / pixelSize);
	const y = Math.floor((evt.offsetY - scrollY) / pixelSize);
	console.log(x, y);
	if (x >= 0 && y >= 0 && x < settings.mapWidth && y < settings.mapHeight) {
		map[y][x] = currentFrame;
	}
	draw();
}

function stopDrawing() {
	isDrawing = false;
}

function draw(exportit) {
	if(exportit){
		exportCanvas.width = settings.mapWidth;
		exportCanvas.height = settings.mapHeight;
		exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
	}
	else{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//start drawing
		ctx.beginPath();
		ctx.fillStyle = "#111";
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = "#64aaff";
		ctx.rect(scrollX, scrollY, settings.mapWidth*pixelSize, settings.mapHeight*pixelSize);
		ctx.fill();
		ctx.closePath();
	}
	for (let i = 0; i < settings.mapHeight; i++) {
		for (let j = 0; j < settings.mapWidth; j++) {
			if (map[i][j] != undefined) {
				if(!exportit){
					let thisTexture = map[i][j];
					ctx.drawImage(
						texture,
						thisTexture.x,
						thisTexture.y,
						thisTexture.w,
						thisTexture.h,
						j * pixelSize + scrollX,
						i * pixelSize + scrollY,
						pixelSize,
						pixelSize,
					);
					console.log("t", thisTexture);
				}
				else{
					let thisTexture = map[i][j];
					exportCtx.beginPath();
					exportCtx.fillStyle = thisTexture.color;
					exportCtx.rect(j, i, 1, 1);
					exportCtx.fill();
					exportCtx.closePath();
				}
			}
		}
	}
}
function clearCanvas() {
	//clear the map
	for (let i = 0; i < settings.mapHeight; i++) {
		for (let j = 0; j < settings.mapWidth; j++) {
			map[i][j] = undefined;
		}
	}
	draw();
}

function saveCanvas() {
	draw(true);
	const dataURL = exportCanvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.download = "bitmap-image.png";
	link.href = dataURL;
	link.click();
}

function initializeMap() {
	map = [];
	for (let i = 0; i < settings.mapHeight; i++) {
		map.push([]);
		for (let j = 0; j < settings.mapWidth; j++) {
			map[i].push(undefined);
		}
	}
}
document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		canvas.addEventListener("mousedown", startDrawing);
		canvas.addEventListener("mouseup", stopDrawing);
		canvas.addEventListener("mousemove", addPixel);
		canvas.addEventListener("mouseleave", stopDrawing);
		document.getElementById("updateWH").addEventListener("click", function (){
			let sure = confirm("This will reset the your drawings. Do you want to continue?");
			if(sure){
				settings.mapWidth = document.getElementById("width").value;
				settings.mapHeight = document.getElementById("height").value;
				console.log("Width: ", settings.mapWidth, "Height: ", settings.mapHeight);
				initializeMap();
				setScrollValues();
				draw();
			}
		})

		const clearButton = document.getElementById("clear");
		clearButton.addEventListener("click", clearCanvas);

		const saveButton = document.getElementById("save");
		saveButton.addEventListener("click", saveCanvas);
		document.addEventListener("keydown", function (event) {
			const key = event.key; // "a", "1", "Shift", etc.
			console.log(key);
			if (key === "w" || key === "ArrowUp") {
				scrollY += 10;
			} else if (key === "s" || key === "ArrowDown") {
				scrollY -= 10;
			} else if (key === "a" || key === "ArrowLeft") {
				scrollX += 10;
			} else if (key === "d" || key === "ArrowRight") {
				scrollX -= 10;
			}
			draw();
		});
		document.getElementById("pixelRange").oninput = function () {
			pixelSize = this.value;
			console.log("YAY", pixelSize);
			setScrollValues();
			draw();
		}
		//setTimeout(() => {
		createPalette();
		//}, 1000);

		//initialise map
		initializeMap();
		//Draw
		draw();
	}
};

function createPalette() {
	//Create the canvas
	const paletteContainer = document.getElementById("palette");
	console.log("AAAAAA", paletteContainer.style.width);
	let paletteCanvas = createHiPPICanvas(380, 176);
	paletteCanvas.id = "paletteCanvas";
	paletteContainer.appendChild(paletteCanvas);
	//Get context
	const paletteCtx = paletteCanvas.getContext("2d");
	paletteCtx.imageSmoothingEnabled = false;
	//Add the icons.
	palette.forEach((item, i) => {
		let thisTexture = textures["frames"][item.label];
		paletteCtx.drawImage(
			texture,
			thisTexture.x,
			thisTexture.y,
			thisTexture.w,
			thisTexture.h,
			i * 48 - 48 * 8 * Math.floor(i / 8),
			Math.floor(i / 8) * 48,
			32,
			32,
		);
	});
	document.getElementById("palette").addEventListener("click", (e) => {
		e.preventDefault();
		//Check which button was clicked
		const x = e.clientX - e.target.getBoundingClientRect().left;
		const y = e.clientY - e.target.getBoundingClientRect().top;
		let textureIndex = Math.floor(x / 48) + Math.floor(y / 48) * 8;
		console.log(palette[textureIndex]);
		//currentColor = palette[textureIndex].color;
		currentFrame = textures["frames"][palette[textureIndex].label];
		currentFrame.color = palette[textureIndex].color;
		console.log("Current", currentFrame);
	});
}
