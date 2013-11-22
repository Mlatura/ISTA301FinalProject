var previousTag;

function init(){
    fetch_images();
    $("#load_button").click( function(){
        if( previousTag != $("#tag_input").val() ){
            fetch_images();
        } else{
            console.log("Tag has not changed since last request");
        }
    });
}

function fetch_images(){
    tag = $("#tag_input").val();
    previousTag = tag;

    var feed = new Instafeed({
        get: 'tagged',
        tagName: tag, 
        sortBy: 'random',
        links: false,
        limit: 10,
        resolution: 'low_resolution',
        clientId: 'ef0bbd19aa4547dbaca0fa96ef0b30dd',
        template: '<img class="feed-image" src="{{image}}" />',
        after: rotateImages
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
