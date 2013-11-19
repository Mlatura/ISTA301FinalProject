
function getGalleryFeed () {
    var feed = new Instafeed({
    	clientId: 'ef0bbd19aa4547dbaca0fa96ef0b30dd',
        get: 'tagged',
        tagName: 'Nog4Jesus',
        pages: instafeedPages,
        limit: 30,
        template: '<a href="{{link}}"><img class="feed-image" src="{{image}}"/></a>',
        after: function () {
		    var images = $("#instafeed").find('a');
		    $.each(images, function(index, image) {
		      var delay = (index * 75) + 'ms';
		      $(image).css('-webkit-animation-delay', delay);
		      $(image).css('-moz-animation-delay', delay);
		      $(image).css('-ms-animation-delay', delay);
		      $(image).css('-o-animation-delay', delay);
		      $(image).css('animation-delay', delay);
		      $(image).addClass('animated flipInX');
    		});
  		}
    });
    feed.run();
}

var instafeedPages = 1;
function getMoreImages () {
	instafeedPages += 1;
	$("#instafeed").empty();
	getGalleryFeed();
}

function badPass () {
	$(".control-group").attr("class", "control-group error");
	var alert = $("#form-alert");
	alert.empty();
	alert.attr("class", "alert alert-block alert-error fade in");
	alert.append('<h4 class="alert-heading">Invalid Login!</h4>Bad username and password combination!');
}

function registerSuccess () {
	// reset sign in form
	$("#form-alert").empty();
	$("#form-alert").attr("class", "alerts");
	
	// all alerts
	var alert = $(".alerts");
	alert.empty();
	alert.attr("class", "alert alert-block alert-success fade in");
	alert.append('<h4 class="alert-heading">Success!</h4>Your action was completed successfully!');
}

