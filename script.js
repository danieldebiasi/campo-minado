
var jogador;
var linhas;
var colunas;
var numBombas;
var campo;
var semBomba;
var totCelulas;
var tempo;
var cronometro;
var partida;

function tempo(){

	clearInterval(cronometro);
	cronometro = setInterval(function() {
		if(totCelulas >= 1 && partida){
		var tempo = document.getElementById("tempo").innerHTML;
		tempo = tempo.split(":");

		tempo[0] = parseInt(tempo[0]);
		tempo[1] = parseInt(tempo[1]);

		if(++tempo[1] == 60){
			tempo[1] = 0;
			tempo[0] += 1;
		}

		if(tempo[0] < 10) tempo[0] = "0"+tempo[0];
		if(tempo[1] < 10) tempo[1] = "0"+tempo[1];

		document.getElementById("tempo").innerHTML = tempo[0]+":"+tempo[1];
	}
	}, 1000);		

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
	if(x*y < b) {
		alert("Número de bombas maior que o número de células!");
	}else {
		limpar();

		jogador = n;
		linhas = x;
		colunas = y;
		numBombas = b;
		totCelulas = 0;
		partida = false;

		inicializarCelulas();

		//Criar tabela com as células no HTML
		var p = document.createElement("table");
		p.setAttribute("id", "tabela");
		for(i = 0; i < linhas; i++) {
			var r = document.createElement("tr");
			for(var j = 0; j < colunas; j++) {
				var d = document.createElement("td");
				d.setAttribute("id", i.toString()+"-"+j.toString());
				d.setAttribute("onclick", "clickCelula(this.id); tempo();");

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

		document.getElementById("restantes").innerHTML = (linhas*colunas-numBombas-totCelulas).toString()+"/"+(linhas*colunas-numBombas).toString();

		document.getElementById("tempo").innerHTML = "00:00";
	}

}

function clickCelula(idCelula) {
	var coord = idCelula.split("-");
	var linha = parseInt(coord[0]);
	var coluna = parseInt(coord[1]);

	if(!campo[linha][coluna].estado){
		partida = true;
		verificarCelula(linha, coluna);
	}
}

function clickFimDeJogo() {
	alert("Fim de Jogo! Para jogar novamente, clique em 'Novo Jogo'.")
}

function verificarCelula(i, j) {
	//Verificar se a célula possui bombas em volta para saber se deve abrir mais células
	if(!campo[i][j].estado){

		abrirCelula(i, j);
		totCelulas++;

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

		if(campo[i][j].valor == -1) {
			partida = false;
			clearInterval(cronometro);
			fimDeJogo(false);
		}

	}

	if((totCelulas == linhas*colunas - numBombas) && campo[i][j].valor != -1) {
		partida = false;
		clearInterval(cronometro);
		fimDeJogo(true);
	}

	document.getElementById("restantes").innerHTML = (linhas*colunas-numBombas-totCelulas).toString()+"/"+(linhas*colunas-numBombas).toString();

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
	celula.style.background = "#999999";

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

function fimDeJogo(vitoria) {
	var msg;

	if(vitoria) {
		msg = "Vitória";
	}else {
		msg = "Derrota";
	}

	for(var i = 0; i < linhas; i++) {
		for(var j = 0; j < linhas; j++) {
			var celula = document.getElementById(i.toString()+"-"+j.toString());
			celula.setAttribute("onclick", "clickFimDeJogo()");
			if((campo[i][j].valor == -1) && (!vitoria))
				abrirCelula(i, j);
		}
	}
	
	alert("Fim de Jogo! "+msg);

	var hist = document.createElement("div");
	var pjogador = document.createElement("p");
	pjogador.appendChild(document.createTextNode("Jogador: "+jogador));
	var pdimensoes = document.createElement("p");
	pdimensoes.appendChild(document.createTextNode("Dimensões: "+linhas.toString()+"x"+colunas.toString()));
	var pbombas = document.createElement("p");
	pbombas.appendChild(document.createTextNode("Bombas: "+numBombas.toString()));
	var ptempo = document.createElement("p");
	ptempo.appendChild(document.createTextNode("Tempo gasto: "+ document.getElementById("tempo").innerHTML));
	var pcelulas = document.createElement("p");
	pcelulas.appendChild(document.createTextNode("Células abertas: "+totCelulas.toString()+" de "+(linhas*colunas).toString()));
	var presultado = document.createElement("p");
	var sresultado = document.createElement("span");
	sresultado.appendChild(document.createTextNode(msg));
	sresultado.style.fontWeight = "bold";
	vitoria ? sresultado.style.color = "green" : sresultado.style.color = "red";
	presultado.appendChild(document.createTextNode("Resultado: "));
	presultado.appendChild(sresultado);

	hist.appendChild(pjogador);
	hist.appendChild(pdimensoes);
	hist.appendChild(pbombas);
	hist.appendChild(ptempo);
	hist.appendChild(pcelulas);
	hist.appendChild(presultado);

	document.getElementById("registros").prepend(hist);

	hist.style.border = "1px solid black";
	hist.style.borderRadius = "20px";
	hist.style.marginTop = "20px";
	hist.style.width = "30%";
	hist.style.marginRight = "auto";
	hist.style.marginLeft = "auto";
}
