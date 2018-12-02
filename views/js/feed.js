let FirebaseReference = require('../../dao/bd.js');

let firebaseReference = FirebaseReference.DatabaseReference.child('/PEDIDO');

firebaseReference.on('child_added', function(snapshot) {
    if(snapshot.val().status != 'CRIADO'){
        $('#lista-pedidos').append(cria_cartao_pedido(snapshot));
    }
});

firebaseReference.on('child_changed', function(snapshot) {
    if(snapshot.val().status != 'CRIADO'){
        $('#' + snapshot.key).replaceWith(cria_cartao_pedido(snapshot));
    }
});

firebaseReference.on('child_moved', function(snapshot){
    $('#' + snapshot.key).remove();
});

firebaseReference.on('child_removed', function(snapshot){
    $('#' + snapshot.key).remove();
});

function proximoStatus(status){
    let proximo_status = {};
    switch (status){
        case 'CRIADO':
            proximo_status = 'ENVIADO'
            break;

        case 'ENVIADO':
            proximo_status = 'PREPARANDO'
            break;

        case 'PREPARANDO':
            proximo_status = 'PRONTO'
            break;

        case 'PRONTO':
            proximo_status = 'ENTREGUE';
            break;

        case 'ENTREGUE':
            proximo_status = 'FINALIZADO'
            break;

        case 'FINALIZADO':
            proximo_status = 'FINALIZADO'
            break;

        case 'CANCELADO':
            proximo_status = 'CANCELADO'
            break;

        default:
            proximo_status = status;
            break;
    }
    return proximo_status;
}

function alteraStatus(snapshot){
    let pedido = snapshot.val();
    pedido.status = proximoStatus(snapshot.val().status);
    firebaseReference.child(snapshot.key).set(pedido);
}

function cancela(snapshot){
    console.log('cancelar pedido ' + snapshot.key);
}

function cria_cartao_pedido(snapshot){

    /** Título */
    let titulo      = $('<h3></h3>').addClass('card-title').text(snapshot.val().titulo);

    /** Quantidade */
    let quantidade  = $('<p></p>').addClass('card-text').text( "Quantidade: " + snapshot.val().quantidade);

    /** Observações */
    let observacoes = $('<p></p>').addClass('card-text text-danger').text(
        (snapshot.val().observacoes != undefined ? snapshot.val().observacoes : "" ));

    /** Data e hora */
    let data_hora = $('<p></p>').addClass('card-text').text('Pedido feito em: ');

    /** Corpo do cartão */
    let body      = $('<div></div>').addClass('card-body').append(titulo, quantidade, observacoes, data_hora);
    
    /** Botão alterar status */
    let btn_status  = $('<button></button>').addClass('btn btn-warning').text(
        'Mudar para ' + transformTextCase(proximoStatus(snapshot.val().status))).on('click', function(e){
            e.preventDefault();
            alteraStatus(snapshot);
        });

    /** Botão cancelar */
    let btn_cancela = $('<button></button>').addClass('btn btn-danger').text(
        'Cancelar Pedido').on('click', function(e){
            e.preventDefault();
            cancela(snapshot);
    });

    let col1_btn    = $('<div></div>').addClass('col-6 text-center').append(btn_status);
    let col2_btn    = $('<div></div>').addClass('col-6 text-center').append(btn_cancela);
    let row_button  = $('<div></div>').addClass('row').append(col1_btn, col2_btn);

    /** Rodapé do cartão */
    let footer      = $('<div></div>').addClass('card-footer').append(row_button);

    /** Cartão */
    let card        = $('<div></div>').addClass('card text-center').append(body, footer).attr('id', snapshot.key);

    return card;
}

function transformTextCase(texto){
    return (texto) ? texto.substring(0,1).toUpperCase().concat(texto.substring(1,texto.length).toLowerCase()) : "";
}