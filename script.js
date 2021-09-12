// // var cars = [11,2,3,4,5,6,7];
// // for (var b = 0; b<cars.length; b++){
// // 	console.log(cars[b])
// // 	// console.log(b)
// // }
// // // console.log(cars.length);

// $.ajax({
// 	url: "https://opentdb.com/api.php?amount=1",
// 	type: 'GET',
// 	dataType: "json",
// 	success: function(data){
// 		present_question(data);
// 	},
// 	error: function(){
// 		console.log('there is an a error')
// 	}

// });

// function present_question(data){
// 	var question = data.results[0].question;
// 	var answer = data.results[0].incorrect_answers;
// 	answer.push(data.results[0].correct_answer);
// 	let shuffled = answer
//   		.map((value) => ({ value, sort: Math.random() }))
//   		.sort((a, b) => a.sort - b.sort)
//   		.map(({ value }) => value)
// 	$('#question').text(question);
// 	for (var a = 0; a < shuffled.length; a++){
// 		var button =  "<input type='radio' id='" + shuffled[a] + "'name = 'QA' >" + '<label for = ' + shuffled[a] + '>' + shuffled[a]
// 		$("#buttons").append(button);
// 		var correctans = [data.results[0].correct_answer];
// 		var c =  $('input[name=QA].checked')
// 		// console.log('2',c)
// 		// console.log('1',correctans)
// 	}
// 	var v = 0
// 	while(c > v){
// 		if (c == correctans){
// 			console.log('correct')
// 		}
// 		v++
// 	}
// }

const question = document.getElementById("question");
const choice = Array.from(document.getElementsByClassName("choice-text"));
const scores = document.getElementById("scoretext");
// const loader_ = document.getElementById("loader--");
const loader = document.getElementById("loader");
const game = document.getElementById("container");
// let display_none = document.getElementById("content").style.display = "none";

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestion) => {
    questions = loadedQuestion.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };
      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    startGame();
  })
  .catch((err) => {
    console.log(err);
  });

const CORRECT_BONUS = 10;
const MAX_QUESTION = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
  // loader_.classList.add(" hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length == 0 || questionCounter > MAX_QUESTION) {
    document.getElementById("container").style.display = "none";
    document.getElementById("score").style.display = "block";
    return;
  }

  questionCounter = 0;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choice.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choice.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }
    let score = document.getElementById("result");
    score.innerHTML =
      "<h3 id = 'answer'>You are answer:" +
      classToApply +
      "<br> Correct Answer : " +
      currentQuestion.answer +
      "</h3>";
    setTimeout(() => {
      score.innerHTML = "<h3> </h3>";
      getNewQuestion();
    }, 2000);
  });
});

incrementScore = (num) => {
  score += num;
  scores.innerText = score;
};

play_again = () => {
  location.reload();
};
