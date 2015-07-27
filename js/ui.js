// JavaScript Document

var ui_helper = new Ui_helper();

function Ui_helper(){
    this.img_load = function(parameters){
        var imgs            = parameters.imgs;
        var completeHandler = parameters.completeHandler;
        imgs.each(function(){
            var img     = $(this);
            var img_src = img.attr('src');
            img
                .load(function(){ completeHandler(img); })
                .attr('src', img_src);
            if(this.complete){
                img.load();
            }
        });
    }
    this.img_cover_parent = function(parameters){
        // note: img should be "position:absolute;" already
        var imgs = parameters.imgs;
        imgs.each(function(){
            var img               = $(this);
            var img_width         = img.width();
            var img_height        = img.height();
            var img_parent        = img.parent();
            var img_parent_width  = img_parent.width();
            var img_parent_height = img_parent.height();
            if(img_width/img_height > img_parent_width/img_parent_height){
                img.css({
                    width  : 'auto',
                    height : img_parent_height,
                    top    : 0,
                    left   : -(((img_width * (img_parent_height/img_height)) - img_parent_width)/2)
                });
            }else{
                img.css({
                    width  : img_parent_width,
                    height : 'auto',
                    top    : -(((img_height * (img_parent_width/img_width)) - img_parent_height)/2),
                    left   : 0
                });
            }
        });
    }
}