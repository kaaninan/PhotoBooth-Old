var NodeWebcam = require("node-webcam");
var fs = require("fs");
// var easyimg = require('easyimage');


// ---- WEBCAM ---- //
var video = document.getElementById('video');
var track; // Kamerayı durdurmak için
var Webcam = NodeWebcam.create(opts);


// Webcam.capture işlem yapıyor mu
var inProcess = false;


// Kameranın Çekim Opsiyonları
var opts = {
    width: 1280,
    height: 800,
    delay: 0,
    device: false,
    quality: 100,
    output: "jpeg",
    verbose: false
}


console.log("Opened");
openCamera();
readyCapture = true;



function openCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            track = stream.getTracks()[0];
        });
    }
}

setTimeout(function(){
	console.log("ok");
	Webcam.capture("/home/pi/PhotoBooth/test.jpg", function(err,data){});
}, 8000);

function capture(count) {

    // İşlem yapılıyor true yap, tuşa çok basarsa işlem yapmasın
    inProcess = true;


    // Resim çek
    Webcam.capture(count + ".jpg");
        
    // İşlem yapılmıyor olarak ayarla
    inProcess = false;

    if (count == 1) {
        // Process Barı güncelle
        $("#process1").hide();
        $("#okey1").show();
        interval2 = setInterval(function() {
            blink2()
        }, 500);
    } else if (count == 2) {
        // Process Barı güncelle
        $("#process2").hide();
        $("#okey2").show();
        interval3 = setInterval(function() {
            blink3()
        }, 500);
    }

    // Kamerayı durdur
    track.stop();


    // Resimleri kırp
    cropImage();


    d = new Date();

    // Viewdaki resimleri güncelle
    $('#img1').attr('src', '1.jpg?'+d.getTime());
    $('#img2').attr('src', '2.jpg?'+d.getTime());
    $('#img3').attr('src', '3.jpg?'+d.getTime());

    // Resim seçme ekranını aç
    $('#process').hide();
    $('#resim_sec').show();


    // Keyevent için değerler
    readyCapture = false;
    readySelectPicture = true;
}


// // Klavyeden bir tuşa basıldığında
// $(document).keypress(function(e) {

//     // Tuşun kodunu göster DEBUG
//     console.log(e.keyCode);

//     // Tanıtım Ekranında Para Gelince
//     if (e.keyCode == 113 || e.keyCode == 119) {
//         if (readyProgram == true) {
//             readyProgram = false;
//             // 113 -> Q -> 10 TL
//             // 119 -> W -> 20 TL
//             if (e.keyCode == 113) {
//                 kac_fotograf = 10;
//             } else if (e.keyCode == 119) {
//                 kac_fotograf = 20;
//             };

//             readySelectCategory = true;

//             // Kategori Ekranına Geç ve Sesi Oynat
//             $('#giris').slideUp(500);
//             $('#kategori_sec').slideDown(500);
//             audioKategori.play();
//         }
//     }

//     // Kategori Secme Ekranı ve Çekilen Resimleri Seçme Ekranı
//     if (e.keyCode == 101 || e.keyCode == 114 || e.keyCode == 116) {

//         // Kategori seçme
//         if (readySelectCategory == true) {
//             readySelectCategory = false;

//             // Kategori için çalan bilgilendirmeyi durdur
//             audioKategori.pause();

//             if (e.keyCode == 101) {
//                 kategori_secimi = "vesikalik";
//                 $('.secenek1-bos').hide(500);
//                 $('.secenek1').show(500);
//                 setTimeout(function() {
//                     $('#kategori_sec').slideUp(500);
//                     $('#tanitim_vesikalik').slideDown(500);
//                     audioVesikalik.play();
//                     readyAcceptCategory = true;
//                 }, 1000);
//             }
//             if (e.keyCode == 114) {
//                 kategori_secimi = "pasaport";
//                 $('.secenek2-bos').hide(500);
//                 $('.secenek2').show(500);
//                 setTimeout(function() {
//                     $('#kategori_sec').slideUp(500);
//                     $('#tanitim_pasaport').slideDown(500);
//                     audioPasaport.play();
//                     readyAcceptCategory = true;
//                 }, 1000);
//             }
//             if (e.keyCode == 116) {
//                 kategori_secimi = "sportif";
//                 $('.secenek3-bos').hide(500);
//                 $('.secenek3').show(500);
//                 setTimeout(function() {
//                     $('#kategori_sec').slideUp(500);
//                     $('#tanitim_sportif').slideDown(500);
//                     audioSportif.play();
//                     readyAcceptCategory = true;
//                 }, 1000);
//             }
//         }

//         // Kategori uyarılarını onaylama
//         else if (readyAcceptCategory == true) {
//             readyAcceptCategory = false;
//             audioVesikalik.pause();
//             audioPasaport.pause();
//             audioSportif.pause();
//             $('#tanitim_vesikalik').slideUp(500);
//             $('#tanitim_pasaport').slideUp(500);
//             $('#tanitim_sportif').slideUp(500);

//             // Capture ekranındaki process bardaki birinci yuvarlağın toggle ı
//             interval1 = setInterval(function() {
//                 blink1()
//             }, 500);

//             openCamera();

//             $('#capture').slideDown(500);
//             audioCapture.play();
//             readyCapture = true;
//         }


//         // Çekilen resimleri seçme
//         else if (readySelectPicture == true) {

//             audioCapture.pause();
//             audioResimSec.pause();
//             audioYazdirma.play();

//             if (e.keyCode == 101) {
//                 $('.secenek11-bos').hide(500);
//                 $('.secenek11').show(500);
//                 setTimeout(function() {
//                     print(1);
//                     $('#resim_sec').slideUp(500);
//                     $('#yazdirma').slideDown(500);
//                 }, 1000);
//             } else if (e.keyCode == 114) {
//                 $('.secenek22-bos').hide(500);
//                 $('.secenek22').show(500);
//                 setTimeout(function() {
//                     print(2);
//                     $('#resim_sec').slideUp(500);
//                     $('#yazdirma').slideDown(500);
//                 }, 1000);
//             } else if (e.keyCode == 116) {
//                 $('.secenek33-bos').hide(500);
//                 $('.secenek33').show(500);
//                 setTimeout(function() {
//                     print(3);
//                     $('#resim_sec').slideUp(500);
//                     $('#yazdirma').slideDown(500);
//                 }, 1000);
//             }

//             readySelectPicture = false;
//         }

//     }

//     // Resim Çekme Tuşuna Basınca
//     if (e.keyCode == 121) {
//         if (readyCapture == true && inProcess == false) {
//             capture(photoCount);
//             photoCount++;
//         }
//     }

//     //
// });



// // Capture ekranındaki process bardaki yuvarlağın yanıp sönmesi
// function blink1() {
//     $("#sira1").toggle();
// }

// function blink2() {
//     $("#sira2").toggle();
// }

// function blink3() {
//     $("#sira3").toggle();
// }





// function cropImage() {
//     easyimg.rescrop({
//         src: '1.jpg',
//         dst: './1.jpg',
//         width: 1280,
//         height: 720,
//         cropwidth: 550,
//         cropheight: 720,
//         x: 0,
//         y: 0
//     }).then(
//         function(image) {
//             console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
//         },
//         function(err) {
//             console.log(err);
//         });

//     easyimg.rescrop({
//         src: '2.jpg',
//         dst: './2.jpg',
//         width: 1280,
//         height: 720,
//         cropwidth: 550,
//         cropheight: 720,
//         x: 0,
//         y: 0
//     }).then(
//         function(image) {
//             console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
//         },
//         function(err) {
//             console.log(err);
//         });

//     easyimg.rescrop({
//         src: '3.jpg',
//         dst: './3.jpg',
//         width: 1280,
//         height: 720,
//         cropwidth: 550,
//         cropheight: 720,
//         x: 0,
//         y: 0
//     }).then(
//         function(image) {
//             console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
//         },
//         function(err) {
//             console.log(err);
//         });
// }

// function print(choose) {
//     console.log(choose);
//     console.log(kategori_secimi);
//     console.log(kac_fotograf);
//     // Yazdırma İşlemleri
//     //
//     // Sistemi sıfırla
//     setTimeout(function() {

//         $('#yazdirma').hide();
//         $('#giris').show();
//         resetSystem();

//     }, 6000);
// }

// function resetSystem() {
//     audioResimSec.currentTime = 0;
//     audioYazdirma.currentTime = 0;
//     audioCapture.currentTime = 0;
//     audioSportif.currentTime = 0;
//     audioPasaport.currentTime = 0;
//     audioVesikalik.currentTime = 0;
//     audioKategori.currentTime = 0;

//     // Resim tipi ve resim seçme ekranındaki tikleri gizle
//     console.log("Duzeltmeler yapılıyor");
//     $('.secenek1').hide();
//     $('.secenek2').hide();
//     $('.secenek3').hide();
//     $('.secenek1-bos').show();
//     $('.secenek2-bos').show();
//     $('.secenek3-bos').show();

//     $('.secenek11').hide();
//     $('.secenek22').hide();
//     $('.secenek33').hide();
//     $('.secenek11-bos').show();
//     $('.secenek22-bos').show();
//     $('.secenek33-bos').show();

//     $("#sira1").hide();
//     $("#sira2").hide();
//     $("#sira3").hide();
//     $("#okey1").hide();
//     $("#okey2").hide();
//     $("#okey3").hide();
//     $("#process1").hide();
//     $("#process2").hide();
//     $("#process3").hide();

//     kac_fotograf = 0; // Paraya göre değişir
//     kategori_secimi = ""; // vesikalik, pasaport, sportif

//     readyProgram = true;
//     readySelectCategory = false;
//     readyCapture = false;
//     photoCount = 1;
//     readySelectPicture = false;

//     // Çekilmiş Resimleri Sil
//     var list_of_files = ["1.jpg", "2.jpg", "3.jpg"]
//     list_of_files.forEach(function(filename) {
//         fs.unlink(filename);
//     });
// }
