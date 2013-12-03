var DEFAULT_TAG = "Love" 
var tag;

function init(){
    tag = (retrieve_get_params()['tag']) ? retrieve_get_params()['tag'] : DEFAULT_TAG;
    setup_buttons();
    $('#tag_input').val(tag);
    fetch_images();
}

function setup_buttons(){
    init_description_accordion();
    init_instruction_popover();
    init_create_theme_popover();
    init_gen_collage_button();
}

function init_gen_collage_button(){
    $("#load_button").click( function(){
        if( tag != $("#tag_input").val() ){
            //add_get_param('tag', $("#tag_input").val());
            window.location.href = '/?tag=' + encodeURIComponent($("#tag_input").val());
        } else{
            console.log("Tag has not changed since last request");
        }
    });
}

function init_description_accordion(){
    if( retrieve_get_params()['description'] ){
        $('#description-content').collapse({
            toggle: true
        });
        $('#description-button').click( function(){
            $('#description-content').collapse('toggle');
        });
        $('#description-content').on('hidden.bs.collapse', function(){
            $('#description-button').html('Show Description');
        });
        $('#description-content').on('shown.bs.collapse', function(){
            $('#description-button').html('Hide Description');
        });
    } else{
        $('#description-button').hide();
    }
}

function init_instruction_popover(){
    $("#contribute-popover").popover('destroy');
    $(function (){ 
        $("#contribute-popover").popover({
           content: '<p style="font-size: 10;">You choose the <b>#Tag</b> and Collage Creator will fetch related images from Instagram for you to position and arrange to your heart\'s content. <br><br>Click and drag to reposition a photo and use the left and right arrow keys while dragging to rotate!</p>',
            placement: 'top',
            html: 'true'
        });
    });
}

function init_create_theme_popover(){
    $("#create-theme-popover").popover('destroy');
    $(function (){
        $("#create-theme-popover").popover({
            content: function() {
                return $('#create-theme-content').html();
            },
            placement: 'bottom',
            html: 'true'
        });
    });
}

function retrieve_get_params(){
    var param_string = window.location.search.substr(1);
    var param_array = param_string.split("&");
    var params = {};
    for ( var i = 0; i < param_array.length; i++ ){
        var temp_array = param_array[i].split("=");
        params[temp_array[0]] = temp_array[1];
    }
    return params;
}

function add_get_param(key, value){
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    var kvp = document.location.search.substr(1).split('&');
    if( kvp == ''){
        document.location.search = '?' + key + '=' + value;
    } else{
        var i = kvp.length; 
        var x; 
        while( i-- ){
            x = kvp[i].split('=');
            if( x[0] == key){
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }
        if ( i < 0 ){ kvp[kvp.length] = [key, value].join('='); }
        document.location.search = kvp.join('&');
    }
}

function fetch_images(){
    var feed = new Instafeed({
        get: 'tagged',
        tagName: tag, 
        sortBy: 'random',
        links: false,
        limit: 25,
        resolution: 'low_resolution',
        clientId: 'ef0bbd19aa4547dbaca0fa96ef0b30dd', template: '<img class="feed-image" src="{{image}}" />',
        after: function(){ $('img').drags(); init_instruction_popover(); }
    });
    feed.run();
    console.log("fetching images with tag: " + $("#tag_input").val());
}

(function() {
    var highest = 1;
    $.fn.bringToTop = function() {
        this.css('z-index', ++highest); // increase highest by 1 and set the style to the new highest  
    }
})();

// Simple JQuery Draggable Plugin
// https://plus.google.com/108949996304093815163/about
// Usage: $(selector).drags();
// Options:
// handle            => your dragging handle.
//                      If not defined, then the whole body of the
//                      selected element will be draggable
// cursor            => define your draggable element cursor type
// draggableClass    => define the draggable class
// activeHandleClass => define the active handle class
//
// Update: 26 February 2013
// 1. Move the `z-index` manipulation from the plugin to CSS declaration
// 2. Fix the laggy effect, because at the first time I made this plugin,
//    I just use the `draggable` class that's added to the element
//    when the element is clicked to select the current draggable element. (Sorry about my bad English!)
// 3. Move the `draggable` and `active-handle` class as a part of the plugin option
// Next update?? NEVER!!! Should create a similar plugin that is not called `simple`!

(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({
            handle: "",
            cursor: "move",
            draggableClass: "draggable",
            activeHandleClass: "active-handle"
        }, opt);

        var $selected = null;
        var $elements = (opt.handle === "") ? this : this.find(opt.handle);

        $(document).keydown(function(e){
            var code = e.which;
            console.log(e);
            if(code == 37){
                if(!$selected[0].rotation){
                    $selected[0].rotation = -2.5; 
                } else{
                    $selected[0].rotation -= 2.5;
                }
            } else if( code == 39){
                if(!$selected[0].rotation){
                    $selected[0].rotation = +2.5; 
                } else{
                    $selected[0].rotation += 2.5;
                }
            }
            $selected.rotate($selected[0].rotation);
        });

        $elements.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                $selected = $(this);
                $selected.addClass(opt.draggableClass);
            } else {
                $selected = $(this).parent();
                $selected.addClass(opt.draggableClass).find(opt.handle).addClass(opt.activeHandleClass);
            }
            $selected.bringToTop();
            var drg_h = $selected.outerHeight(),
                drg_w = $selected.outerWidth(),
                pos_y = $selected.offset().top + drg_h - e.pageY,
                pos_x = $selected.offset().left + drg_w - e.pageX;
            $(document).on("mousemove", function(e) {
                $selected.offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                });
            }).on("mouseup", function() {
                $(this).off("mousemove"); // Unbind events from document
                if ($selected !== null) {
                    $selected.removeClass(opt.draggableClass);
                    $selected = null;
                }
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $selected.removeClass(opt.draggableClass);
            } else {
                $selected.removeClass(opt.draggableClass)
                    .find(opt.handle).removeClass(opt.activeHandleClass);
            }
            $selected = null;
        });

        return this;

    };
})(jQuery);
