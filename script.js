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
const ctx = canvas.getContext('2d');

const pixelSize = 10;

let currentColor = '#000000';

let isDrawing = false;

function startDrawing(evt) {
	isDrawing = true;
	draw(evt);
}

function stopDrawing() {
	isDrawing = false;
}

function draw(evt) {
	if (!isDrawing) return;

	const x = Math.floor(evt.offsetX / pixelSize);
	const y = Math.floor(evt.offsetY / pixelSize);

	ctx.fillStyle = currentColor;
	ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}


function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
	const dataURL = canvas.toDataURL('image/png');
	const link = document.createElement('a');
	link.download = 'bitmap-image.png';
	link.href = dataURL;
	link.click();
}

function setCurrentColor(color) {
	currentColor = color;
}

const palette = [
	{ label: 'AirBlock', color: '#87ceeb' },
	{ label: 'BackgroundBlock', color: '#015c1d' },
{ label: 'BedrockBlock', color: '#353535' },
{ label: 'BerryBushBlock', color: '#840b0b' },
{ label: 'Block', color: '#ffffff' },
{ label: 'BrickBackgroundBlock', color: '#222222' },
{ label: 'BrickBlock', color: '#444444' },
{ label: 'CoalBlock', color: '#0e0e0e' },
{ label: 'CreepBlock', color: '#2a2e2b' },
{ label: 'DirtBackgroundBlock', color: '#271e03' },
{ label: 'DirtBlock', color: '#85480f' },
{ label: 'FarmingBlock', color: '#c7a231' },
{ label: 'GoldBlock', color: '#fdc53b' },
{ label: 'Grass', color: '#659d00' },
{ label: 'IronBlock', color: '#8c7054' },
{ label: 'IronSpikeBlock', color: '#888999' },
{ label: 'LadderBlock', color: '#97865d' },
{ label: 'MithrilBlock', color: '#23a7d9' },
{ label: 'PlatformBlock', color: '#aa621f' },
{ label: 'ShingleBlock', color: '#3367a1' },
{ label: 'Snow', color: '#d7ded8' },
{ label: 'SpikeBlock', color: '#48849f' },
{ label: 'StairBlock', color: '#4b5a81' },
{ label: 'StairWoodBlock', color: '#9b6518' },
{ label: 'SteelBlock', color: '#a0a0a0' },
{ label: 'StoneBackgroundBlock', color: '#2f552d' },
{ label: 'StoneBlock', color: '#999497' },
{ label: 'StructureBlock', color: '#767676' },
{ label: 'TorchBlock', color: '#edbb4f' },
{ label: 'TreeLeaves', color: '#2f7b32' },
{ label: 'TreeSapling', color: '#c6843c' },
{ label: 'TreeTrunk', color: '#7b3c14' },
{ label: 'WaterBlock', color: '#365cab' },
{ label: 'WoodBackgroundBlock', color: '#47200b' },
{ label: 'WoodBlock', color: '#aa761f' },
{ label: 'WoodSpikeBlock', color: '#aa5a1a' },
	{ label: 'WoodSpikeBlock', color: '#aa5a1a' }
];

function createPalette() {
	const paletteContainer = document.getElementById('palette');
	palette.forEach(item => {
		const button = document.createElement('button');
		button.style.backgroundColor = item.color;
		button.style.width = '40px';
		button.style.height = '40px';
		button.title = item.label; 
		button.addEventListener('click', () => setCurrentColor(item.color));
		paletteContainer.appendChild(button);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	createPalette();
	canvas.addEventListener('mousedown', startDrawing);
	canvas.addEventListener('mouseup', stopDrawing);
	canvas.addEventListener('mousemove', draw);
	canvas.addEventListener('mouseleave', stopDrawing);

	const clearButton = document.getElementById('clear');
	clearButton.addEventListener('click', clearCanvas);

	const saveButton = document.getElementById('save');
	saveButton.addEventListener('click', saveCanvas);
});


function createPalette() {
	const paletteContainer = document.getElementById('palette');
	palette.forEach(item => {
		const colorButton = document.createElement('button');
		colorButton.style.backgroundColor = item.color;
		colorButton.addEventListener('click', () => setCurrentColor(item.color));

		const colorLabel = document.createElement('span');
		colorLabel.textContent = item.label;

		colorButton.appendChild(colorLabel);
		paletteContainer.appendChild(colorButton);
	});
}
