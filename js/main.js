// JavaScript Document

jQuery(document).ready(function($){
    people_html_set();
    $('.tessellation').each(function(){
        Tessellation({
            tessellation          : $(this),
            tilesOnCells_complete : function(){  ui_helper.img_cover_parent({imgs : $('.tile img')}); }
        });
    });
    img_load(); // it has to be called after img parent's dimension change
    spin();
});

function people_html_set(){
    var html = '';
    html += people('hosts');
    html += people('guests');
    $("#people").html(html);
    function people(identity){
        var html = '<ul class="'+identity+'">';
        for(var i in data_people[identity]){
            html += person(data_people[identity][i]);
        }
        return html+'<div class="clear"></div></ul>';
    }
    function person(person){
        return '<li class="person tile raw">'+
                '<img src="../image/people/'+person.image+'" />'+
                '<div class="info">'+
                    '<div class="name">'+person.name+'</div>'+
                    (person.title === undefined ? '' : '<div class="title">'+person.title+'</div>')+
                    (person.age   === undefined ? '' : '<div class="age">'+person.age+'</div>')+
                    '<div class="subjects">'+person.subjects+'</div>'+
                    '<div class="description">'+person.description_oneLine+'</div>'+
                '</div>'+
            '</li>';
    }
}
function img_load(){
    var imgs = $('.tile img');
    ui_helper.img_load({
        imgs            : imgs,
        completeHandler : function(){
            ui_helper.img_cover_parent({imgs : imgs});
        }
    });
}
function spin(){
    $('.tile').hover(
        function(){
            var tile = $(this);
            if(!tile.hasClass('spin')){
                tile.addClass('spin');
                setTimeout(function(){ tile.removeClass('spin'); }, 5000);
            }
        },
        function(){}
    );
}