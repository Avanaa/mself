let FirebaseReference = require('../../dao/bd.js');

FirebaseReference.DatabaseReference.child('/PEDIDO').on('child_added', function(snapshot) {
    $('#lista').append(cria_cartao_pedido(snapshot));
});
    
FirebaseReference.DatabaseReference.child('/PEDIDO').on('child_changed', function(snapshot) {
    $('#' + snapshot.key).replaceWith(cria_cartao_pedido(snapshot));
});

FirebaseReference.DatabaseReference.child('/PEDIDO').on('child_moved', function(snapshot){
    $('#' + snapshot.key).remove();
});

FirebaseReference.DatabaseReference.child('/PEDIDO').on('child_removed', function(snapshot){
    $('#' + snapshot.key).remove();
});

function cria_cartao_pedido(snapshot){

    let titulo      = $('<h3></h3>').addClass('card-title').text(snapshot.val().item.titulo);
    let quantidade  = $('<p></p>').addClass('card-text').text( "Quantidade: " + snapshot.val().quantidade);
    let observacoes = $('<p></p>').addClass('card-text text-danger').text('Observações: ' +
        (snapshot.val().observacoes != undefined ? snapshot.val().observacoes : "-" ));
    let body        = $('<div></div>').addClass('card-body').append(titulo, quantidade, observacoes);
    let footer      = $('<div></div>').addClass('card-footer text-muted').text('Data e hora: 29.10.2018 - 14:23');
    let card        = $('<div></div>').addClass('card text-center').append(body, footer).attr('id', snapshot.key);

    return card;
}