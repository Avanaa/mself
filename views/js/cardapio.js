let bdRef =  require('../../dao/bd.js');
const disponivel = require('../../admin/disponivel');

bdRef.DatabaseReference.child('/ITEM').on('child_added', function(snapshot) {
    $('#lista').append(cria_cartao_item(snapshot));
});

bdRef.DatabaseReference.child('/ITEM').on('child_added', function(snapshot) {
    $('#' + snapshot.key).replaceWith(cria_cartao_item(snapshot));
});

bdRef.DatabaseReference.child('/ITEM').on('child_removed', function(snapshot) {
    $('#' + snapshot.key).remove();
});

bdRef.DatabaseReference.child('/ITEM').on('child_moved', function(){
    $('#' + snapshot.key).remove();
});

function pushItem(item){
    
    item.disponivel = 'SIM';
    item.categoria  = item.categoria.toUpperCase();

    let image = item.image;
    item.image = null;

    key = bdRef.DatabaseReference.child('/ITEM').push(item).key;
    
    if(image){
        bdRef.StorageReference.upload(image, {destination : '/IMAGES/' + key + '/foto.jpg'})
            .then(function(snapshot){
                item.image = snapshot[1].mediaLink;
                console.log(item);
                bdRef.DatabaseReference.child('/ITEM/' + key).update(item);
                inicio();
            });
    }
}

$.getJSON('../admin/categoria.json', function(data){
    $.each(data, function( key, val ) {
        let option = $('<option></option>').text(transformTextCase(val));
        $('#categoria-item').append(option);
      });
});

$('#valor-item').on('keyup', calculaPreco);

$('#desconto-item').on('keyup', calculaPreco);

salvar = function(){
    let item = {
        titulo : $('#titulo-item').val(),
        descricao : $('#descricao-item').val(),
        valor : parseFloat($("#valor-item").val()),
        desconto : parseFloat($('#desconto-item').val()),
        preco : parseFloat($('#preco-item').val()),
        categoria : $('#categoria-item').val()
    };
    
    var inputFile = $("#img-item");

    if(inputFile){
        let file = inputFile[0].files[0];
        item.image = file.path;
    }
    console.log(item);
    pushItem(item);
}

function calculaPreco(){

    let valor = parseFloat($('#valor-item').val());
    let desconto = parseFloat($('#desconto-item').val());

    let descontoReal = (( valor * desconto ) / 100);
    let preco = valor - descontoReal;

    $('#desconto-item-real').attr('value', String(descontoReal));
    $('#preco-item').attr('value', String(preco));
}

inputImagem = function(){
    var inputFile = $("#img-item")[0].files[0];
    $('#img-item-label').text(inputFile.name);
}

function cria_cartao_item(snapshot){

    console.log(snapshot);

    let img       = $('<img>').addClass('card-img-top').attr('src', snapshot.val().image);
    let titulo    = $('<h3></h3>').addClass('card-title').text(snapshot.val().titulo);
    let descricao = $('<p></p>').addClass('card-text').text(snapshot.val().descricao);
    let categoria = $('<p></p>').addClass('card-text').text('Categoria: ' + transformTextCase(snapshot.val().categoria));
    let preco     = $('<p></p>').addClass('card-text text-danger').text('R$ ' + String(snapshot.val().preco));
    let body      = $('<div></div>').addClass('card-body').append(titulo, descricao, categoria, preco);

    let col1      = $('<div></div>').addClass('col-sm').append(img);
    let col2      = $('<div></div>').addClass('col-sm').append(body);
    let row1      = $('<div></div>').addClass('row').append(col1, col2);

    let card      = $('<div></div>').addClass('card').append(row1).attr('id', snapshot.key);
   
    return card;
}

function transformTextCase(texto){
    return (texto) ? texto.substring(0,1).toUpperCase().concat(texto.substring(1,texto.length).toLowerCase()) : "";
}
