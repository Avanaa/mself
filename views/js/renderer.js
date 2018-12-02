require('./cardapio.js');
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

editarItem = function(snapshot){
    console.log(snapshot);
    ipcRenderer.send('editar-item', [snapshot]);
}

ipcRenderer.on('snapshot-edit', (e, snapshot) => {
    console.log('snapshot-edit');
    console.log(snapshot);
    preencheFormulario(snapshot);
});