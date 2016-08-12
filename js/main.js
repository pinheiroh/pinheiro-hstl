
// Criar banco de dados se não existir.
// O banco será criado no próprio browser, com WEB SQL.
var db = openDatabase('hostelDb', '1.0', 'hostelDb', 2 * 1024 * 1024); 

// Comandos referentes a manipulação de banco de dados         
db.transaction(function (tx) {
	
	// Cria tabela login no banco de dados e insere o usuário e senha padrao.
   	tx.executeSql('CREATE TABLE IF NOT EXISTS usuario (username TEXT PRIMARY KEY, password TEXT, nome TEXT, tipo TEXT)'); 
   	tx.executeSql('INSERT INTO usuario (username, password, nome, tipo) VALUES ("admin", "1234", "administrador", "0")');
});


	// Cria tabela cliente no banco de dados
db.transaction(function (tx) {   	
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS cliente (email TEXT PRIMARY KEY, nome TEXT, telefone TEXT, cidade TEXT)');
	tx.executeSql('INSERT INTO cliente (email, nome, telefone, cidade) VALUES ("pinheiroh@hotmail.com", "hilderson", "22222222", "rio de janeiro")');    
    
});

    // Cria tabela quartos
//db.transaction(function (tx) {
 
    //  tx.executeSql('CREATE TABLE IF NOT EXISTS quartos (nome TEXT PRIMARY KEY, leitos TEXT, valor INT');
    // tx.executeSql('INSERT INTO quartos (nome, leitos, valor) VALUES ("Presidente", "4", "150")');
    // Esse comando foi usado para apagar a tabela após os testes e erros
    //tx.executeSql('DROP TABLE cliente'); 
    //tx.executeSql('DROP TABLE quartos'); 
    // });        
          



// Ler os campos usuario e senha
function Validar() {
	
	// Pega o nome de usuario e senha
	var chave = document.getElementById('username').value;
	var txtSenha = document.getElementById('password').value;

	// Usuário e senha padra do sistema é admin e 1234. Esses valores estão definidos no banco de dados.
	// Após cadastro de um usuário administrador, ela será excluída.	
	if (chave === "admin" && txtSenha === "1234") {

		// Transforma o OBJETO com as informações do usuário em string e guarda no sessionstorage
		sessionStorage.setItem("userLogado",JSON.stringify({'username':"admin",'nome':"Administrador",'tipo':0}));
		window.location.href = "sistema.html";


	}else{
		// Executa operações com banco de dados.
		// Validar qualquer outro usuário cadastrado no banco de dados
		db.transaction(function(tx) {
			
			// Filtra o banco de dados com os valores fornecidos no input do login, se estiver cadastrado 
			// entra no sistema. o campo tipo define se é um administrador ou um usuario comum.					
			tx.executeSql("SELECT username, nome, tipo FROM usuario WHERE username = '"+chave+"' AND password = '"+txtSenha+"' ", [], function (tx, results){
				
				// Se tam for maior que 0 encontrou o usuario no banco de dados e valida a senha. Se não da mensagem
				// de usuario ou senha incorreto.
				var tam = results.rows.length;	
				if (tam > 0) {
										
					// Transforma o OBJETO com as informações do usuário em string e guarda no sessionstorage
					// do navegador.							
					sessionStorage.setItem("userLogado",JSON.stringify({'username':results.rows.item(0).username,'nome':results.rows.item(0).nome,'tipo':results.rows.item(0).tipo}));
					

					window.location.href = "sistema.html";

				}else{
					alert("Usuario ou senha incorreto");

				};

			});
		});	
		

	};
	
	
};
// Essa função restaura do sessionStorage as informações de quem está logado.
function Login(){	
	var logado = JSON.parse(sessionStorage.getItem("userLogado"));
	
	document.getElementById("nomelogado").innerHTML = "Seja bem vindo " +logado.nome; 
};

// Limpa o sessionStorage
function Logout(){
	sessionStorage.clear()
	window.location.href = "index.html";


};


// Classe servirá de modelo para todas as telas que precise realizar as operações do banco de dados.
var OperSql = function (username,password,nome,tipo){

	this.username = username;
	this.password = password;
	this.nome = nome;
	this.tipo = tipo;


	
};

OperSql.prototype.Gravar = function() {
	
	// Variáveis que recebem os dados dos formularios.
	// Declaradas assim, pois com o this, não vai para dentro da função tx
	var username = this.username; 
	var password = this.password;
	var nome = this.nome;
	var tipo = this.tipo;

	db.transaction(function (tx){
		
		tx.executeSql('SELECT username FROM usuario WHERE username = "'+username+'" ', [], function (tx, results){
			
			// Se tam for diferente de 0, encontrou um usuario com mesmo Email no banco. 
			var tam = results.rows.length; 
			if (tam === 0) {

				// Grava o usuario no banco
				tx.executeSql('INSERT INTO usuario (username, password, nome, tipo) VALUES ("'+username+'","'+password+'","'+nome+'","'+tipo+'")');
				alert("Usuario cadastrado com sucesso!")
				

			}else{
				alert("Já existe um usuario com esse Email!");

			};

		});	

						
	});
};

/**
OperSql.prototype.Ler = function() {
	
	// Variáveis que recebem os dados dos formularios.
	// Declaradas assim, pois com o this, não vai para dentro da função tx
	var username = this.username; 
	var password = this.password;
	var nome = this.nome;
	var tipo = this.tipo;

	db.transaction(function (tx){
		
		tx.executeSql('SELECT username FROM usuario WHERE username = "'+username+'" ', [], function (tx, results){
			
			// Se tam for diferente de 0, encontrou um usuario com mesmo Email no banco. 
			var tam = results.rows.length; 
			if (tam === 0) {

				// Grava o usuario no banco
				tx.executeSql('INSERT INTO usuario (username, password, nome, tipo) VALUES ("'+username+'","'+password+'","'+nome+'","'+tipo+'")');
				alert("Usuario cadastrado com sucesso!")
				

			}else{
				alert("Já existe um usuario com esse Email!");

			};

		});	

						
	});
};

OperSql.prototype.Excluir = function() {
	
	// Variáveis que recebem os dados dos formularios.
	// Declaradas assim, pois com o this, não vai para dentro da função tx
	var username = this.username; 
	var password = this.password;
	var nome = this.nome;
	var tipo = this.tipo;

	db.transaction(function (tx){
		
		tx.executeSql('SELECT username FROM usuario WHERE username = "'+username+'" ', [], function (tx, results){
			
			// Se tam for diferente de 0, encontrou um usuario com mesmo Email no banco. 
			var tam = results.rows.length; 
			if (tam === 0) {

				// Grava o usuario no banco
				tx.executeSql('INSERT INTO usuario (username, password, nome, tipo) VALUES ("'+username+'","'+password+'","'+nome+'","'+tipo+'")');
				alert("Usuario cadastrado com sucesso!")
				

			}else{
				alert("Já existe um usuario com esse Email!");

			};

		});	

						
	});

};

**/


function Salvar(){

	// Recebem os dados dos formulários .
	var username = document.getElementById('txtEmail').value;
	var password = document.getElementById('txtSenha').value;
	var nome = document.getElementById('txtNome').value;
	var tipo = document.getElementById('txtTipo').value;

	// Testa se as senhas digitadas coincidem e envia para o contrutor.
	if (password === document.getElementById('txtRpt').value){

		var userData = new OperSql(username,password,nome,tipo);
		userData.Gravar();
	
	}else{

		alert("Senha não confere!")
	};

	

};

// Vai ser para realizar funções de Exclusão do banco de dados.
function Excluir(){

};

// Vai ser para realizar funções de Leitura do banco de dados.
function Ler(){
	
};
