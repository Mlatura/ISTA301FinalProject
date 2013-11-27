var DEFAULT_TAG = "Love" 
var tag;

function init(){
    tag = (retrieve_get_params()['tag']) ? retrieve_get_params()['tag'] : DEFAULT_TAG;
    $('#tag_input').val(tag);
    fetch_images();
    $("#load_button").click( function(){
        if( tag != $("#tag_input").val() ){
            add_get_param('tag', $("#tag_input").val());
        } else{
            console.log("Tag has not changed since last request");
        }
    });
}

function setup_popovers(){
    $("#contribute-popover").popover('destroy');
    $(function (){ 
        $("#contribute-popover").popover({
            content: 'Upload your images to Instagram with the tag ' + ('#' + tag).bold() + ', it\'s that simple!',
            placement: 'top',
            html: 'true'
        });
    });

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

    $("#public-collages-popover").popover('destroy');
    $(function (){
        $("#public-collages-popover").popover({
            content: function() {
                return $('#public-collages-content').html();
            },
            placement: 'top',
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
        limit: 10,
        resolution: 'low_resolution',
        clientId: 'ef0bbd19aa4547dbaca0fa96ef0b30dd', template: '<img class="feed-image" src="{{image}}" />',
        after: function(){ rotateImages(); setup_popovers(); }
    });
    feed.run();
    console.log("fetching images with tag: " + $("#tag_input").val());
}

function rotateImages(){
    $('img').each( function(i, img){
        var rotation = Math.floor((Math.random()*100)-50);
        var rotation_string = 'rotate(' + rotation + 'deg)';
                
        img.style.setProperty('transform', rotation_string);
        img.style.setProperty('-webkit-transform', rotation_string);
        img.style.setProperty('-ms-transform', rotation_string);
    });
}
