const { ipcRenderer } = require('electron');

novo = function(){
    ipcRenderer.send('abrir-novo');
}

cardapio = function(){
    ipcRenderer.send('abrir-cardapio');
}

inicio = function(){
    ipcRenderer.send('inicio');
}

editarItem = function(item){
    ipcRenderer.send('editar-item', [item]);
}
