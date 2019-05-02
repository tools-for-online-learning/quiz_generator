
$.get('output.json').done(function (myQuestions) {
  const quizContainer = document.getElementById("quiz");
  const feedbackContainer = document.getElementById("feedback");
  const allQuestions = Object.entries(myQuestions);
  let numberCorrect = 0;
  let answeredQuestions = [];
  buildQuiz(allQuestions);


  // display quiz right away


  const checkButton = document.getElementById("check");
  const retakeButton = document.getElementById("retake");
  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  let currentQuestion = 0;
  showSlide(0, slides);

  function buildQuiz(allQuestions) {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    allQuestions.forEach((currentQuestion, questionNumber) => {
      // console.log(allQuestions);
      // we'll want to store the list of option choices
      const options = [];

      // const optionItems = (currentQuestion[1].a, currentQuestion[1].b, currentQuestion[1].c, currentQuestion[1].d);
      const optionItems = {
        a: currentQuestion[1].a || currentQuestion[1].A,
        b: currentQuestion[1].b || currentQuestion[1].B,
        c: currentQuestion[1].c || currentQuestion[1].C,
        d: currentQuestion[1].d || currentQuestion[1].D
      };

      // and for each available option...
      for (letter in optionItems) {
        
        // ...add an HTML radio button
        if (currentQuestion[1].correct.length === 1) {
          options.push(
            `<label>
                       <input type="radio" id="${currentQuestion[1].id}${letter}" name="question${questionNumber}" value="${letter}">
                        ${letter} :
                        ${optionItems[letter]}
            </label>`
          );
        } else {
          options.push(
            `<label>
                       <input type="checkbox" name="question${questionNumber}" value="${letter}">
                        ${letter}:
                        ${optionItems[letter]}
                     </label>`
          );
                        // ${currentQuestion[1].letter}
        }
      }


      // add this question and its options to the output
      output.push(
        `<div class="slide">
                    <div class="question">${Math.floor(questionNumber/2)+1}) ${currentQuestion[1].question}</div>
                    <div class="options"> ${options.join("")}</div>
                    <div class="feedback question${questionNumber}"> ${currentQuestion[1].feedback} </div>
          </div>`
      );

      // finally combine our output list into one string of HTML and put it on the page
      quizContainer.innerHTML = output.join("");

    });
  }


  // check answer
  function checkAnswer() {
    answeredQuestions.push(currentQuestion);
    checkButton.style.display = "none";
    // get corresponding feedback
    const answerContainer = quizContainer.querySelectorAll(".options")[currentQuestion];
    const selector = `input[name=question${currentQuestion}]:checked`;

    const checkedList = (answerContainer.querySelectorAll(selector) || {});
    let userAnswerList = [];
    for (let choice of checkedList) {
      userAnswerList.push(choice.value);
    }
    const userAnswer = userAnswerList.join(',');
    // if answer is correct
    if (userAnswer.toLowerCase() === allQuestions[currentQuestion][1].correct.toLowerCase()) {
      tmp_feedback = 'Correct. Possible answer: ' + allQuestions[currentQuestion][1].feedback;
      numberCorrect++;
    } // if answer is incorrect
    else {
      tmp_feedback = 'Incorrect. Possible answer: ' + allQuestions[currentQuestion][1].feedback;
    }

    const thisFeedback = document.querySelector(`.question${currentQuestion}`);
    thisFeedback.innerHTML = tmp_feedback;
    thisFeedback.style.display = "block";

    if (currentQuestion % 2 === 1) {
      retakeButton.style.display = "none";
    } else {
      // retakeButton.style.display = "inline-block";
    }

    if (answeredQuestions.length == slides.length/2) {
      $('#scoreContainer').html(`<p>You scored ${numberCorrect}/${allQuestions.length/2}</p>`);
      checkButton.style.display = "none";
      previousButton.style.display = "none";
      if (currentQuestion % 2 == 0) {
        retakeButton.style.display = "inline-block";
      } else if (currentQuestion == slides.length - 1) {
        alert("You're all done; way to go!");
      }
    }
  }


  function showSlide(n) {
    //console.log(slides);
    slides[currentQuestion].classList.remove("active-slide");
    slides[n].classList.add("active-slide");
    currentQuestion = n;

    if (currentQuestion < 2) {
      previousButton.style.display = "none";
    } else {
      previousButton.style.display = "inline-block";
    }

    if (currentQuestion >= slides.length - 2) {
      console.log("Hiding slides at end");
      nextButton.style.display = "none";
    } else {
      nextButton.style.display = "inline-block";
    }
    if (answeredQuestions.indexOf(n) >= 0) {
      checkButton.style.display = "none";
    } else {
      checkButton.style.display = "inline-block";
    }
  }


  function retakeQuiz() {
    $('.slide').show();
    numberCorrect = 0;
    answeredQuestions = [];
    $('#scoreContainer').html('')
    retakeButton.style.display = "none";
    nextButton.style.display = "inline-block";
    checkButton.style.display = "inline-block";
    showSlide(1);
  }

  function showNextQuestion() {
    if (currentQuestion < slides.length - 2) {
      showSlide(currentQuestion + 2)
    } else {
      $('.slide').hide();
    }
  }

  function showPreviousQuestion() {
    if (currentQuestion > 1) {
      showSlide(currentQuestion - 2)
    } else {
      $('.slide').hide();
    }
  }


  // on check answer, show feedback
  // submitButton.addEventListener("click", showResults);
  checkButton.addEventListener("click", checkAnswer);
  retakeButton.addEventListener("click", retakeQuiz);
  nextButton.addEventListener("click", showNextQuestion);
  previousButton.addEventListener("click", showPreviousQuestion);

}) 
