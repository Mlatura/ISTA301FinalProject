
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

function processLogin () {
	var username = $("#user").val();
	var password = $("#pass").val();

	var request = new XMLHttpRequest();
	request.open("GET", "processlogin.php?user="+username+"&pass="+password, true);

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			var wasSuccessful = JSON.parse(request.responseText);
			// valid login
			if (wasSuccessful == 1) {
				registerSuccess();

				// close panel & empty page content
				$(".afterNavBar").empty();
				$("#panel-right").panel("close");				

				// show form
				var form = "<div class='container'>"+
			    "  <form class='form-signin' id='newsform' action='javascript:addNews();'>"+
			    "    <h2 class='heading'>New Message!</h2>"+
			    "    <div class='alerts'></div>"+
			    "     <div class='control-group'>"+
			    "        <input type='text' id='newsTitle' class='input-block-level' name='newsTitle' placeholder='Title' required>"+
			    "        <textarea class='input-block-level' id='newsMessage' placeholder='Message' required></textarea>"+
			    "    </div>"+
			    "    <input type='submit' id='submitButton' class='btn btn-primary btn-large' value='Submit!'>"+
			    "  </form>"+
			    "</div>";				

		    	$(".afterNavBar").append(form);
			} 
			else{
				badPass();
			}
			// erase the user/pass fields
			$("#user").val("");
			$("#pass").val("");
		}
	}
	request.send();
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

