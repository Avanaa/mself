const { ipcRenderer } = require('electron');

    /** RENDERER */
novo = function(){
    ipcRenderer.send('abrir-novo');
}

cardapio = function(){
    ipcRenderer.send('abrir-cardapio');
}

inicio = function(){
    ipcRenderer.send('inicio');
}
