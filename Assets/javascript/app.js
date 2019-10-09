var fireConfig = {
  apiKey: "AIzaSyDBqIHv9cDq_hd1_-bflLm5Pm7XEbWaz8M",
  authDomain: "trainhw-91db5.firebaseapp.com",
  databaseURL: "https://trainhw-91db5.firebaseio.com",
  projectId: "trainhw-91db5",
  storageBucket: "",
  messagingSenderId: "273897384686",
  appId: "1:273897384686:web:4acbf4a15b89bcd171e1ff",
  
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();


  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = 0;


$(".form-feild").on("keyup", function(){
  var traintemp = $("#train-name").val().trim();
  var traintemp = $("#destination").val().trim();
  var traintemp = $("#first-train").val().trim();
  var traintemp = $("#frequency").val().trim();

  sessionStorage.setItem("train", traintemp);
  sessionStorage.setItem("city", traintemp);
  sessionStorage.setItem("time", traintemp);
  sessionStorage.setItem("freq", traintemp);
});

$("#train-name").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));

$("#submit").on("click", function(event) {
    event.preventDefault();

if ($("#train-name").val().trim() === "" ||
    $("#destination").val().trim() === "" ||
    $("#first-train").val().trim() === "" ||
    $("#frequency").val().trim() === "") {
        alert("complete the forms to add a new train");
    }else {

        trainName= $("#train-name").val().trim();
        destination= $("#destination").val().trim();
        startTime= $("#first-train").val().trim();
        trainName= $("#frequency").val().trim();

        $(".form-field").val("");

        database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            startTime: startTime,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        sessionStorage.clear();
    }

});

database.ref().on("child_added", function(childSnapshot) {
    var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm:ss").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;

    var newrow = $("<tr>");
    newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LTS") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

    if (minToArrival < 6) {
        newrow.add.addClass("info");
    }

        $("#Tablerows").append(newrow);

});

$(document).on("click", ".arrival", function() {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
  });
  
  setInterval(function() {
    window.location.reload();
  }, 60000);
  



