const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const btnPause = document.getElementById('pause');
const btnForward = document.getElementById('forward');
const btnBack = document.getElementById('back');
const box = 20;//Ширина клетки
let life = false;//Состояние игры: пауза
let field = [];//Создание матрицы
let ms = 400;

function pause(){
	if(life == false){
		life = true
		btnPause.style.backgroundImage = 'url(pause.jpg)'
	}else{
		life = false
		btnPause.style.backgroundImage = 'url(play1.png)'
	}
}
function forward(){
	ms -= 200
}
function back(){
	ms += 200
}
function createField(){
	maxY = Math.round(canvas.height / box);
	maxX = Math.round(canvas.width / box);
	for(let i = 0; i < maxY; i++){
		field[i] = [];
		for(let j = 0; j < maxX; j++){
			field[i][j] = {
				life: false,
				neighbour: 0
			};	
		}
	}
}
function grid(width,height, box){
	ctx.lineWidth = 1;
	for(let i = 0; i <= Math.ceil(width / box); i++){
		ctx.beginPath();
			ctx.moveTo(i * box, 0);
			ctx.lineTo(i * box, height);
			ctx.strokeStyle = "white";
			ctx.stroke()
		ctx.closePath();
	}
	for(let i = 0; i <= Math.ceil(height / box); i++){
		ctx.beginPath();
			ctx.moveTo(0, i * box);
			ctx.lineTo(width, i * box);
			ctx.strokeStyle = "white";
			ctx.stroke()
		ctx.closePath();
	}
}
/*
	Определяем число живых соседей у
	каждой клетки
*/
function checkNeighbour(field){
	check = 0;
	for(let i = 0; i < field.length; i++){
		for(let j = 0; j < field[i].length; j++){
			let cell = field[i][j];
			for(let m = i - 1; m < i + 2; m++){
				if(typeof field[m] == 'object'){
					for(let n = j - 1; n < j + 2; n++){

						if(typeof field[m][n] == 'object'){
							if(m == i && n == j) continue;
							if(field[m][n].life){
								cell.neighbour++;
							}
						}
					}
				}
			}

		}
	}
}
/*
	По числу соседей определяем, жива клетка или нет
	2,3 соседа живая клетка продолжает жить
	3 соседа у мертвой клетки - клетка оживает
*/
function createLife(field){
	for(let i = 0; i < field.length; i++){
		for(let j = 0; j < field[i].length; j++){
			if(field[i][j].life == true){
				if(field[i][j].neighbour > 3 || field[i][j].neighbour <= 1){
					field[i][j].life = false
					ctx.beginPath();
						ctx.rect(j * box + 0.5, i * box + 0.5, box - 1, box - 1);
						ctx.fillStyle = "black";
						ctx.fill();
					ctx.closePath();
				}
			}else{
				if(field[i][j].neighbour == 3){
					field[i][j].life = true
					ctx.beginPath();
						ctx.rect(j * box + 0.5, i * box + 0.5, box - 1, box - 1);
						ctx.fillStyle = "white";
						ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
}

grid(canvas.width, canvas.height, box);
createField();
addEventListener("click", function(e){
	i = Math.floor(e.offsetY / box);
	j = Math.floor(e.offsetX / box);
	if(field[i][j].life == true){
		field[i][j].life = false;
		ctx.beginPath();
			ctx.rect(j * box + 0.5, i * box + 0.5, box - 1, box - 1);
			ctx.fillStyle = "black";
			ctx.fill();
		ctx.closePath();
	}else{
		field[i][j].life = true;
		ctx.beginPath();
			ctx.rect(j * box + 0.5, i * box + 0.5, box - 1, box - 1);
			ctx.fillStyle = "white";					ctx.fill();
		ctx.closePath();
	}

		
})

let time = setTimeout(function tick(){
	if(life == true){
		for(let i = 0; i < field.length; i++){
			for(let j = 0; j < field[i].length; j++){
				field[i][j].neighbour = 0
			}
		}

		checkNeighbour(field);
		createLife(field);
	}
	time = setTimeout(tick, ms)
}, ms)
