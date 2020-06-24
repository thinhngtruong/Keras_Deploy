//========================================================================
// Drag and drop image handling
//========================================================================
  $('#pred-result').hide();
  var fileDrag = document.getElementById("file-drag");
  var fileSelect = document.getElementById("file-upload");

// Add event listeners
  fileDrag.addEventListener("dragover", fileDragHover, false);
  fileDrag.addEventListener("dragleave", fileDragHover, false);
  fileDrag.addEventListener("drop", fileSelectHandler, false);
  fileSelect.addEventListener("change", fileSelectHandler, false);

  var isMobile = false; //initiate as false
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
  }

  if(isMobile){
      $('#title').css("font-size", "25px")
  }

  function fileDragHover(e) {
    // prevent default behaviour
    e.preventDefault();
    e.stopPropagation();

    fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
  }

  function fileSelectHandler(e) {
    // handle file selecting
    var files = e.target.files || e.dataTransfer.files;
    fileDragHover(e);
    for (var i = 0, f; (f = files[i]); i++) {
      previewFile(f);
    }
  }

//========================================================================
// Web page elements for functions to use
//========================================================================

  var imagePreview = document.getElementById("image-preview");
  var imageDisplay = document.getElementById("image-display");
  var uploadCaption = document.getElementById("upload-caption");
  var predResult = document.getElementById("pred-result");
  var loader = document.getElementById("loader")
  var audio = document.getElementById("audio")
//========================================================================
// Main button events
//========================================================================

  function submitImage() {
    // action for the submit button
    if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
      window.alert("Please select an image before submit.");
      return;
    }

    loader.classList.remove("hidden");
    imageDisplay.classList.add("loading");

    // call the predict function of the backend
    predictImage(imageDisplay.src);
  }

  function clearImage() {
    // reset selected files
    fileSelect.value = "";

    // remove image sources and hide them
    imagePreview.src = "";
    imageDisplay.src = "";
    predResult.innerHTML = "";

    hide(loader);
    hide(audio);
    $('#audio').hide();
    show(uploadCaption);
    $('#pred-result').hide();
    imageDisplay.classList.remove("loading");
  }

  function previewFile(file) {
    // show the preview of the image
    var fileName = encodeURI(file.name);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      imagePreview.src = URL.createObjectURL(file);
      $('#image-preview').hide()
      $('#image-preview').fadeIn(650)
      $('#pred-result').hide();
      hide(uploadCaption);
      hide(audio)
      $('#audio').hide();
      // reset
      predResult.innerHTML = "";
      imageDisplay.classList.remove("loading");
      displayImage(reader.result, "image-display");
    };
  }

//========================================================================
// Helper functions
//========================================================================

  function predictImage(image) {
    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(image)
    })
        .then(resp => {
          if (resp.ok)
            resp.json().then(data => {
              displayResult(data);
            });
        })
        .catch(err => {
          console.log("An error occured", err.message);
          window.alert("Oops! Something went wrong.");
        });
  }

  function displayImage(image, id) {
    // display image on given id <img> element
    let display = document.getElementById(id);
    display.src = image;
    $('#image-display').hide()
    $('#image-display').fadeIn(650)
    show(display);
  }

  function displayResult(data) {
    // display the result
    imageDisplay.classList.remove("loading");
    hide(loader);
    predResult.innerHTML = "Description: " + data.result;
    $('#audio').attr("src","/static/speech" + data.key + ".wav");
    $('#pred-result').hide();
    $('#pred-result').fadeIn(650);
    $('#audio').hide();
    $('#audio').fadeIn(650);
    show(audio);
    audio.play();
  }

  function hide(el) {
    // hide an element
    el.classList.add("hidden");
  }

  function show(el) {
    // show an element
    el.classList.remove("hidden");
  }
