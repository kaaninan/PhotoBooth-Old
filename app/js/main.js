var fs = require("fs");
var $ = require("jquery");
var Twitter = require('twitter');
var exec = require('child_process').exec;
var screenshot = require('screenshot-desktop');


// Tweet Content
var tweet = "Yaparak öğreniyorum! #learningbymaking";


// Local Variables
var questionCount = 17;
var currentQuestion = 1;
var waitingKey = true;
var userAnswer = null;
var userPressed = false;


// Timeouts
var timeout_answerSpinner = 2000; // Checking
var timeout_rightAnswer = 3000; // Correct
var timeout_processing = 3000; // Wait for capture
var timeout_nextQuestion = 3000; // Wait for changing question img


// Answers
var answers = [true, true, false, true, false, true, true, true, false, true, true, true, false, true, false, true, false];


// Webcam Settings
var video = document.getElementById('video');
var track;


	
// Twitter Settings
var obj;
var client;
fs.readFile('twitter.json', 'utf8', function (err, data) {
	// Read Twitter Api Settings
	if (err) throw err;
	obj = JSON.parse(data);
	client = new Twitter({
	  consumer_key: obj.consumer_key,
	  consumer_secret: obj.consumer_secret,
	  access_token_key: obj.access_token,
	  access_token_secret: obj.access_token_secret
	});
});


// Create pictures folder for captured pics (if does not exist)
exec("mkdir -p pictures");

// Starts From Here
openCameraView();
showQuestion(currentQuestion);
setTimeout(function(){
	// If does not open
	openCameraView();
}, 1000);




// STEP 1: Answer the Question
function answerQuestion(){
	// For enable keyboard event function
	waitingKey = false;
	// Show spinner overlay
	$('#s1').show();
	$('#s1text').html("Kontrol Ediliyor..");
	// Wait a little bit
	setTimeout(function(){
		// Hide spinner
		$('#s1').hide();

		// Right answer?
		if(answers[currentQuestion] == userAnswer){
			console.log("Correct");
			// Show successful screen
			$('#splash_correct').show();

			setTimeout(function(){
				// Take a photo
				takePhotoScreen();
			}, timeout_rightAnswer);

		}else{
			console.log("Wrong");
			// Sorry! Wrong answer, wait for 3 second
			$('#splash_wrong').show();
			// Pass next question
			nextQuestion();
		}
	}, timeout_answerSpinner);
		
};


// STEP 2: Take a Photo
function takePhotoScreen(){
	
	// Hide question screen
	$('#screen_question').hide();
	
	// Show webcam screen
	$('.counter').css({'display':'block'});
	$('#screen_takePhoto').show();

	// Counter
	counter = 5;
	$('.counter').html(counter);
	interval1 = setInterval(function(){
		counter--;
		$('.counter').html(counter);
		if(counter == 0){
			$('.counter').css({'display':'none'});
			console.log("Capture");
			clearInterval(interval1);
			var fileName = "pictures/"+getDateTime();
			
			// Wait for disappear counter
			setTimeout(function(){
				screenshot().then(function(img){
					fs.writeFile(fileName+".jpg", img, 'base64', function(err){
						if(!err){
							// Show spinner overlay
							$('#s2').show();
							$('#s2text').html("İşleniyor..");
							// Wait a little bit (unnecessary)
							setTimeout(function(){
								$('#s2text').html("Tweetleniyor..");
								postTweet(fileName+".jpg");
								
							}, timeout_processing);
						}else{
							console.log(err);
						}
					});
				});
			},1000);
		}
	}, 1000);
}



// STEP 3: Let's Tweet
function postTweet(imageName){
	// Load your image
	var data = fs.readFileSync(imageName);

	// Make post request on media endpoint. Pass file data as media parameter
	client.post('media/upload', {media: data}, function(error, media, response) {
	  	if (!error) {
		    // If successful, a media object will be returned.
		    console.log(media);

		    // Lets tweet it
		    var status = {
		    	status: tweet,
		    	media_ids: media.media_id_string // Pass the media id string
		    }
		    

			client.post('statuses/update', status, function(error, tweet, response) {
				if (!error) {
					console.log(tweet);
					// $('#splash_successful').show();
					// Show successful screen for three second
					nextQuestion();
		      	}else{
					console.log(error);
				}
		    });
		}else{
			console.log(error);
		}
	});
}



// STEP 4: Next Question
function nextQuestion(){
	// Which question? Increase or from start
	if(currentQuestion == questionCount){
		currentQuestion = 1;
	}else{
		currentQuestion++;
	}

	// Set new image to <img>
	showQuestion(currentQuestion);

	// Wait for changing question image
	setTimeout(function(){
		$('#s1').hide();
		$('#s2').hide();
		$('#splash_wrong').hide();
		$('#splash_correct').hide();
		// $('#splash_successful').hide();

		// Show first screen
		$('#screen_question').show();
		waitingKey = true;
	}, timeout_nextQuestion);
}


function showQuestion(number){
	// Change img's source
	$("#question_img").attr("src", "questions/q"+number+".png");
}




// NON STEP

// For Keyboard Events
$(document).keypress(function(e) {
	// Write key number
    // console.log(e.keyCode);

	if (e.keyCode == 100 || e.keyCode == 121) {
		if(e.keyCode == 100){userAnswer = true}
		else if(e.keyCode == 121){userAnswer = false}

		if(waitingKey == true){
			console.log("Next");
			answerQuestion();
		}else{
			console.log("Pressed wrong time");
		}
	}else{
		console.log("Pressed undefined key");
	}
});


// Open Camera View in Html
function openCameraView() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            track = stream.getTracks()[0];
        });
    }
}

// Datetime for captured filename
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "_" + month + "_" + day + "_" + hour + "_" + min + "_" + sec;
}
