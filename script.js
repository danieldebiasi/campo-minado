
var jogador;
var linhas;
var colunas;
var numBombas;
var campo;
var semBomba;

function tempo(){

}

function limpar() {
	var t = document.getElementById("tabela");
	if(t != null){
		t.parentNode.removeChild(t);
	}
}

function inicializarCelulas() {

	campo = new Array();
	semBomba = new Array();

/*

Legenda da célula:
VALOR:
-1 : com bomba
0 : em branco
>0 : número de bombas

ESTADO:
false: fechada
true: aberta

*/

	//Criar matriz representando campo
	for(var i = 0; i < linhas; i++) {
		campo[i] = new Array();
		for(var j = 0; j < colunas; j++) {
			var celula = new Object();
			celula.valor = 0;
			celula.estado = false;
			celula.linha = i;
			celula.coluna = j;
			semBomba[(i*colunas) + j] = celula;
			campo[i][j] = celula;
		}
	}

	//Colocar bombas aleatoriamente no campo
	for(var i = 0; i < numBombas; i++) {
		indice = Math.floor(Math.random()*semBomba.length);
		(campo[semBomba[indice].linha][semBomba[indice].coluna]).valor = -1;
		semBomba.splice(indice, 1);
	}

	//Definir valor das demais células sem bomba
	for(var i = 0; i < linhas; i++) {
		for(var j = 0; j < colunas; j++) {
			if(campo[i][j].valor != -1) {
				var totBombas = 0;
				/*
					célula esquerda abaixo: [i+1][j-1]
					célula esquerda: [i][j-1]
					célula esquerda acima: [i-1][j-1]
					célula acima: [i-1][j]
					célula direita acima: [i-1][j+1]
					célula direita: [i][j+1]
					célula direita abaixo: [i+1][j+1]
					célula abaixo: [i+1][j]
				*/

				var coord = [[i+1, j-1], [i, j-1], [i-1, j-1], [i-1, j], 
							[i-1, j+1], [i, j+1], [i+1, j+1], [i+1, j]];

				for(var k = 0; k < 8; k++){
					if(((coord[k][0] >= 0) && (coord[k][1] >= 0))&&((coord[k][0] < linhas) && (coord[k][1] < colunas))) 
						if(campo[coord[k][0]][coord[k][1]].valor == -1)
							totBombas++;
				}

				campo[i][j].valor = totBombas;

			}
		}
	}
}

function novoJogo(n, x, y, b) {
	limpar();

	jogador = n;
	linhas = x;
	colunas = y;
	numBombas = b;

	inicializarCelulas();

	//Criar tabela com as células no HTML
	var p = document.createElement("table");
	p.setAttribute("id", "tabela");
	for(i = 0; i < linhas; i++) {
		var r = document.createElement("tr");
		for(var j = 0; j < colunas; j++) {
			var d = document.createElement("td");
			d.setAttribute("id", i.toString()+"-"+j.toString());
			d.setAttribute("onclick", "clickCelula(this.id)");

			if(campo[i][j].valor != 0) {
				var img = document.createElement("img");
				img.setAttribute("src", "imagens/"+campo[i][j].valor.toString()+".png");
				img.setAttribute("id", "i"+i.toString()+"-"+j.toString());
				img.style.visibility = "hidden";
				d.appendChild(img);
			}

			r.appendChild(d);
		}
		p.appendChild(r);
	}
	
	document.getElementById("campo").appendChild(p);
}

function clickCelula(idCelula) {
	var coord = idCelula.split("-");
	var linha = parseInt(coord[0]);
	var coluna = parseInt(coord[1]);

	if(!campo[linha][coluna].estado){
		verificarCelula(linha, coluna);
	}
}

function verificarCelula(i, j) {
	//Verificar se a célula possui bombas em volta para saber se deve abrir mais células
	if(!campo[i][j].estado){

		abrirCelula(i, j);

		campo[i][j].estado = true;

		if(campo[i][j].valor == 0){
			var coord = [[i+1, j-1], [i, j-1], [i-1, j-1], [i-1, j], 
						[i-1, j+1], [i, j+1], [i+1, j+1], [i+1, j]];

			for(var k = 0; k < 8; k++){
				if(((coord[k][0] >= 0) && (coord[k][1] >= 0))&&((coord[k][0] < linhas) && (coord[k][1] < colunas))){ 
					verificarCelula(coord[k][0], coord[k][1]);
				}
			}
		}
	}

	return;
}

function abrirCelula(linha, coluna) {
	var celula = document.getElementById(linha.toString()+"-"+coluna.toString());

	if(campo[linha][coluna].valor != 0) {
		var img = document.getElementById("i"+linha.toString()+"-"+coluna.toString());
		img.style.visibility = "visible";
	}

	switch (campo[linha][coluna].valor) {
		case -1:
			celula.style.background = "red";
			break;
		case 0:
			celula.style.background = "#77afff";
			break;
		default:
			celula.style.background = "rgb(36, 150, 241)";
			break;
	}

	return;
}

function fecharCelula(linha, coluna) {
	var celula = document.getElementById(linha.toString()+"-"+coluna.toString());
	celula.style.background = "gray";

	if(campo[linha][coluna].valor != 0){
		var img = document.getElementById("i"+linha.toString()+"-"+coluna.toString());
		img.style.visibility = "hidden";
	}
}

function mostrar() {
	for(var i = 0; i < linhas; i++) {
		for(var j = 0; j < colunas; j++) {
			abrirCelula(i, j);
		}
	}
}

function restaurar() {
	for(var i = 0; i < linhas; i++) {
		for(var j = 0; j < colunas; j++) {
			if(!campo[i][j].estado)
				fecharCelula(i, j);
		}
	}
}