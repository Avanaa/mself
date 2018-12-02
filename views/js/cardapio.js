require('./renderer.js');

let bdRef =  require('../../dao/bd.js');
let firebaseReference = bdRef.DatabaseReference.child('/ITEM');    

firebaseReference.on('child_added', function(snapshot) {
    $('#lista-itens').append(cria_cartao_item(snapshot));
});

firebaseReference.on('child_added', function(snapshot) {
    $('#' + snapshot.key).replaceWith(cria_cartao_item(snapshot));
});

firebaseReference.on('child_removed', function(snapshot) {
    $('#' + snapshot.key).remove();
});

firebaseReference.on('child_moved', function(){
    $('#' + snapshot.key).remove();
});

function pushItem(item, file){

    item.disponivel = 'SIM';
    item.categoria  = item.categoria.toUpperCase();

    key = bdRef.DatabaseReference.child('/ITEM').push(item).key;
    
    if(file){
        bdRef.StorageReference.upload(file, {destination : '/IMAGES/' + key + '/foto.jpg'})
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
    
    let inputFile = $("#img-item");
    let file;

    if(inputFile){
        file = inputFile[0].files[0];
    }
    pushItem(item, file);
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
    if(inputFile){
        $('#img-item-label').text(inputFile.name);
    }
}

function cria_cartao_item(snapshot){

    let img       = $('<img>').addClass('card-img-top').attr('src', snapshot.val().image);
    let titulo    = $('<h3></h3>').addClass('card-title').text(snapshot.val().titulo);
    let descricao = $('<p></p>').addClass('card-text').text(snapshot.val().descricao);
    let categoria = $('<p></p>').addClass('card-text').text('Categoria: ' + transformTextCase(snapshot.val().categoria));
    let preco     = $('<p></p>').addClass('card-text text-danger').text('R$ ' + String(snapshot.val().preco));
    let texto     = $('<div></div>').addClass('card-body').append(titulo, descricao, categoria, preco);

    let col_img   = $('<div></div>').addClass('col-sm').append(img);
    let col_texto = $('<div></div>').addClass('col-sm').append(texto);
    let body      = $('<div></div>').addClass('row').append(col_img, col_texto);
    
    /** Botão editar */
    let btn_status  = $('<button></button>').addClass('btn btn-warning').text('Editar item').on('click', function(e){
            e.preventDefault();
            editar(snapshot.val());
        });

    /** Botão remover */
    let btn_cancela = $('<button></button>').addClass('btn btn-danger').text('Remover item').on('click', function(e){
            e.preventDefault();
            remover(snapshot);
    });

    let col1_btn    = $('<div></div>').addClass('col-6 text-center').append(btn_status);
    let col2_btn    = $('<div></div>').addClass('col-6 text-center').append(btn_cancela);
    let row_button  = $('<div></div>').addClass('row').append(col1_btn, col2_btn);

    /** Rodapé do cartão */
    let footer      = $('<div></div>').addClass('card-footer').append(row_button);

    let card      = $('<div></div>')
                        .addClass('card shadow p-3 mb-5 bg-white rounded')
                        .append(body, footer)
                        .attr('id', snapshot.key);

    return card;
}

function transformTextCase(texto){
    return (texto) ? texto.substring(0,1).toUpperCase().concat(texto.substring(1,texto.length).toLowerCase()) : "";
}

function editar(snapshot){
    editarItem(snapshot);
}

function remover(snapshot){
    firebaseReference.child(snapshot.key).remove();
}

preencheFormulario = function(snapshot){
    $('#titulo-item').val(snapshot.titulo);
    $('#descricao-item').val(snapshot.descricao);
    $('#valor-item').val(parseFloat(snapshot.valor));
    $('#desconto-item').val(parseFloat(snapshot.desconto));
    calculaPreco();
    //$('#img-item-label').text(snapshot.image);
}