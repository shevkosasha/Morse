// Список компонент (from components.js)
const components = {
  header: Header,
  navbar: NavBar,
  // header: Header,
  content: Content,
  // footer: Footer,
};

// Список поддердживаемых роутов (from pages.js)
const routes = {
  main: HomePage,
  about: About,
  contacts: Contacts,
  explore: Explore,
  practice: Practice,
  default: HomePage,
  error: ErrorPage,
};

const mySPA = (function(){

  /* ------- begin view -------- */
  function ModuleView() {
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;
    let language = 'eng';

    this.init = function(container, routes) {
      myModuleContainer = container;
      routesObj = routes;
      menu = myModuleContainer.querySelector("#mainmenu");
      contentContainer = myModuleContainer.querySelector("#content");
    }

    this.renderContent = function(hashPageName) {
      let routeName = "default";
      // debugger;
      if (hashPageName.length > 0) {
        routeName = hashPageName in routes ? hashPageName : "error";
      }

      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = '';
      contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`,contentContainer);
      if (routeName === 'explore') {
        this.createMorseTable(`${routeName}-page`);
        this.createDecodeInputs(`${routeName}-page`);
        // routesObj[routeName].createDecodeInputs(`${routeName}-page`,contentContainer);
      }
      if (routeName === 'practice') {
       myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.startQuizPage;
      }
      
      // contentContainer.innerHTML += routesObj[routeName].createMorseTable(`${routeName}-page`);
      this.updateButtons(routesObj[routeName].id);
    },

    this.createMorseTable = (lang = 'eng') => {   

      let arr = (language == 'eng') ? morseCode : morseCodeRus;
      let div = myModuleContainer.querySelector('.alphabet');
      div.innerHTML = '';

      for (let [symbol, code] of Object.entries(arr)){
        let btn = document.createElement('button');
        btn.classList.add('alphabet-button');
        btn.innerHTML = `<span class ="alpha">${symbol.toUpperCase()}</span> 
                        <span class ="morse">${code}</span>`;                                  
        div.append(btn);
      }
    },

    this.createDecodeInputs = (className = "container") => {
      this.section = myModuleContainer.querySelector(`.${className}`);
      let inputSection = document.createElement('section');
      inputSection.classList.add('decode_inputs');
      inputSection.innerHTML = Explore.decodeInputs;      
      this.section.append(inputSection);  
    },

    this.setLanguage = (lang) => {
      language = lang;
      myModuleContainer.querySelector('#current_language').textContent = (language === 'eng') ? 'English' : 'Russian';
      this.createMorseTable(language);
    }

    this.updateButtons = function(currentPage) {
      const menuLinks = menu.querySelectorAll(".mainmenu__link");

      for (let link of menuLinks) {
        currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
      }
    }

    this.select = (elem) => {
      elem.classList.add('selected');
    }

    this.hideSelect = (elem) => {
      elem.classList.remove('selected');
    }

    this.printMorseOrStr = (morseStr,field) => {
      field.value = morseStr; 
    }

    this.clearInput = (tArea1, tArea2) => {
      tArea2.value = tArea1.value = '';
    }

    this.showQuestion = (question, options, index, score, userdata) => {
      console.log(question);
      console.log(options);
      // debugger;     

      myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.questionPage;

      if (userdata.context == 'audio') {
        myModuleContainer.querySelectorAll('.img_play').forEach(elem =>{
          (elem.classList.contains('answer')) ? elem.style.display = 'none' : elem.style.display = 'block';
        });
        myModuleContainer.querySelector('#display-question').style.display = 'none';
      }

      myModuleContainer.querySelectorAll('.how-many-questions').forEach(elem => elem.innerHTML = userdata.countQuestions);
      document.getElementById("question-number").innerHTML = index + 1;
      document.getElementById("player-score").innerHTML = score;
      document.getElementById("display-question").innerHTML = question.question.toUpperCase();
      document.getElementById("option-one-label").innerHTML = options[0];
      document.getElementById("option-two-label").innerHTML = options[1];
      document.getElementById("option-three-label").innerHTML = options[2];
      document.getElementById("option-four-label").innerHTML = options[3];  

    };

    this.setLabelBackground = (inner = '',className = '') => {
      let optionLabels = myModuleContainer.querySelectorAll('.option');
      if (inner && className) {
        optionLabels.forEach(label => {
          if (label.textContent == inner) label.parentNode.classList.add(className);
        });
      } else {        
        optionLabels.forEach(label =>  label.parentNode.className = 'options');
      }      
    };

    this.showCheckModal = () => {
      myModuleContainer.querySelector('#option-modal').style.display = "block";
      myModuleContainer.querySelector('#option-modal').style.display = "flex";
    }
    this.hideCheckModal = () => myModuleContainer.querySelector('#option-modal').style.display = "none";

    this.removeQuiz = () => {
      myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.startQuizPage;
    }

    this.showScoreModal = (result) => {
      
      myModuleContainer.querySelector('#remarks').innerHTML = result.remark;
      myModuleContainer.querySelector('#remarks').style.color = result.remarkColor;
      myModuleContainer.querySelector('#grade-percentage').innerHTML = result.grade;
      myModuleContainer.querySelector('#wrong-answers').innerHTML = result.wrong;
      myModuleContainer.querySelector('#right-answers').innerHTML = result.score;
      myModuleContainer.querySelector('#score-modal').style.display = 'block';
      myModuleContainer.querySelector('#score-modal').style.display = "flex";
    }

    this.closeScoreModal = () => {myModuleContainer.querySelector('#score-modal').style.display = 'none';}
    this.showWarning = () => {
      myModuleContainer.querySelector('#username_input').querySelector('h2').classList.add('wrong-name');
    }
    // this.hideWarning = () =>  myModuleContainer.querySelector('.wrong-name').style.display = 'none';

  };
  /* -------- end view --------- */

  /* ------- begin model ------- */
  function ModuleModel () {
    let myModuleView = null;
    let isQuizStarted = false;
    let sessionQuestions = {};
    let questions = null;
    let index = 0;
    let userdata = null;
    let answers = [];
    let curExpLanguage = 'eng';    
    
    let playerScore = 0 ; //holds the player score
    let wrongAttempt = 0 ;//amount of wrong answers picked by player

    this.init = function(view) {
      myModuleView = view;
    },

    this.updateState = function(pageName) {
      myModuleView.renderContent(pageName);
    },

    this.setLanguage = (lang) =>{
      curExpLanguage = lang;
      myModuleView.setLanguage(lang);
    }

    this.playMorse = function(str){
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new AudioContext();
      var dot = 1.2 / 15;

      var t = ctx.currentTime;

      var oscillator = ctx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = 600;

      var gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, t);
      str.split("").forEach((letter) => {
          switch(letter) {
              case ".":
                  gainNode.gain.setValueAtTime(1, t);
                  t += dot;
                  gainNode.gain.setValueAtTime(0, t);
                  t += dot;
                  break;
              case "-":
                  gainNode.gain.setValueAtTime(1, t);
                  t += 3 * dot;
                  gainNode.gain.setValueAtTime(0, t);
                  t += dot;
                  break;
              case " ":
                  t += 7 * dot;
                  break;
          }
      });
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      // return false;
    },

    this.strToMorse = (str, lang = '') => {
      let arr =[];
      if (lang) {
        arr = (lang == 'eng') ? morseCode : morseCodeRus;
      } else {
        arr = (curExpLanguage == 'eng') ? morseCode : morseCodeRus;
      }
      // let arr = (lang == 'eng') ? morseCode : morseCodeRus;
      let res = str.split('').map(i => {
        // debugger;
        i = i.toLowerCase();
        return (arr[i]) ? arr[i] : ( i === ' ') ? ' ' : '[?]';          
      }).join(' ');
      return res;
  }

    this.morseToStr = (str, lang = '') => {
      let arr =[];
      if (lang) {
        arr = (lang == 'eng') ? morseCode : morseCodeRus;
      } else {
        arr = (curExpLanguage == 'eng') ? morseCode : morseCodeRus;
      }
      let words = [];
      let i = 0;
      str.split('   ').forEach(word => {
        words[i] = word.split(' ').map(letter => {
          for (let [key, code] of Object.entries(arr)){
            if (letter === code) return key;
          }
        });
        i++;
      });
      return words.map(word => word.join('')).join(' ');
    }

    this.codeMorse = function(str,elem){
      let morseStr = this.strToMorse(str);
      myModuleView.printMorseOrStr(morseStr,elem);
    },
    
    this.decodeMorse = function(str,elem){
      let phrase = this.morseToStr(str);
      myModuleView.printMorseOrStr(phrase,elem);
    }

    this.clearInput = (tArea1, tArea2) => { myModuleView.clearInput(tArea1, tArea2);};

    this.createQuiz = (obj) => {
      userdata = obj; 
      let userJSON = JSON.stringify(userdata);
      // console.log(userJSON);
      
      this.addUser(userdata);
      // const dbRef = firebase.database().ref();
      let name = "my name";
      let value = "John Smith"
      // кодирует в my%20name=John%20Smith
      console.log(document.cookie);
      document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      console.log(document.cookie);
      
      if (!isQuizStarted) {
        isQuizStarted = true;
        this.setQuestions();
        console.log(sessionQuestions);
        questions = Object.values(sessionQuestions);
        this.getNextQuestion();        
      }     
    }

    this.addUser = function(obj) {

      let name = obj.name;

      myDB.ref("users/").once("value")
      .then(function(snapshot) {
          console.log("Users list:");
          console.log(snapshot.val());
      }).catch(function (error) {
          console.log("Error: " + error.code);
      });

      // myDBRef.child("users").child(name).get().then((snapshot) => {
      //   if (snapshot.exists()) {
      //     console.log(snapshot.val());
      //   } else {
      //     console.log("No data available");
      //   }
      // }).catch((error) => {
      //   console.error(error);
      // });

      var newPostKey = firebase.database().ref().child('users').push().key;
      console.log(newPostKey);
      
      // var ref = new Firebase("https://docs-examples.firebaseio.com/samplechat/users/fred");
      myDBRef.once("value", function(snapshot) {
        let a = snapshot.exists();
        console.log(a);
        // a === true
        let b = snapshot.child("users").exists(); 
        console.log(b);
        // b === true
        let c = snapshot.child("users/user_d265dd").exists();
        console.log(c);
        // c === true
        let d = snapshot.child("words/156").exists();
        console.log(d);
        // d === false (because there is no "rooms/room0" child in the data snapshot)
      }); 

      // myDB.ref('users/' + `user_${name.toLowerCase()}`).set({
      //       name: `${obj.name}`,
      //       context: `${obj.context}`,
      //       level: `${obj.level}`,
      //       language: `${obj.language}`,
      //   })
      //   .then(function (name) {
      //       console.log("Пользователь добавлен в коллецию users");
      //   })
      //   .catch(function (error) {
      //       console.error("Ошибка добавления пользователя: ", error);
      //   });

        // this.updateUsersList();
    }

    this.setQuestions = function(){
      // debugger;
      let level = userdata.level;
      let lang = userdata.language;
      let context = userdata.context;
      // count of questions for current quiz according to level
      let num = userdata.countQuestions = (level === 'easy') ? 10 : (level === 'medium') ? 15 : 20;

      let codeArr = [];
      let values = [];
      let letters = [];
      switch(level){
        case 'easy':
          codeArr = (lang === 'eng') ? Object.entries(morseCode) : Object.entries(morseCodeRus);
          letters = (lang === 'eng') ? Object.keys(morseCode) :  Object.keys(morseCodeRus);
          values = (lang === 'eng') ? Object.values(morseCode) :  Object.values(morseCodeRus);
          break;
        case 'medium':
          codeArr = values = (lang === 'eng') ? words : wordsRus;          
          break;
        case 'hard':
          console.log('hard is coming soon');
          break;
      }
      // console.log(codeArr);
      for (let i=0; i < num; i++) {
        let random = codeArr[Math.floor(Math.random() * codeArr.length)]; //get symbol for qeuestion         
        let correct = Math.floor(Math.random() * 4); //get number of correct answer in option list
        let itemQ, itemA; //current question and correct answer
       
        switch(level){
          case 'easy':
            // itemQ = random[0];
            // itemA = random[1];    
            itemQ = (context === 'writing') ? random[0].toUpperCase() : random[1];
            itemA = (context === 'writing') ? random[1] : random[0].toUpperCase();         
            break;
          case 'medium':
            // itemQ = random;
            // itemA = this.strToMorse(random, lang);
            itemQ = (context === 'writing') ? random.toUpperCase() : this.strToMorse(random, lang);
            itemA = (context === 'writing') ? this.strToMorse(random, lang) : random.toUpperCase();
            break;
          case 'hard':
            console.log('hard is coming soon');
            break;
        }
        console.log(itemQ, itemA, correct);

        if (sessionQuestions.hasOwnProperty(`Q_${itemQ}`)) {
            i--; console.log('double i');
        } else {
          sessionQuestions[`Q_${itemQ}`] = {};
          sessionQuestions[`Q_${itemQ}`]['question'] = {question: `${itemQ}`,
                                                            answer: `${itemA}`, 
                                                            num: correct};                                                            
          let options = sessionQuestions[`Q_${itemQ}`]['options'] = [];
          for( let j=0; j < 4; j++) {
            // debugger;
            let item = (context === 'writing') ? values[Math.floor(Math.random() * values.length)] :
                                                 letters[Math.floor(Math.random() * letters.length)].toUpperCase();
            // let item = values[Math.floor(Math.random() * values.length)];

            if (level === 'medium') item = (context === 'writing') ? this.strToMorse(item, lang) : item.toUpperCase();    
            if (!options.includes(item) && (item !== itemA)){
              options[j] = (j == correct) ? itemA : item;
              // console.log(item);
            } else {
              j--;
              console.log('double j');
            }        
          }

        }

      }

    }

    this.getNextQuestion = () => {
      // let questions = Object.keys(sessionQuestions);
      if (index < questions.length) {
        let question = questions[index].question;
        let options = questions[index].options; 
        myModuleView.showQuestion(question, options, index, playerScore, userdata);   
      } else {
        this.handleEndQuiz();
        console.log(answers);
      }
    }

    this.handleEndQuiz = () => {
      let remark, remarkColor;
      if (playerScore <= 3) {
        remark = "Bad Grades, Keep Practicing."
        remarkColor = "red"
      }
      else if (playerScore >= 4 && playerScore < 7) {
          remark = "Average Grades, You can do better."
          remarkColor = "orange"
      }
      else if (playerScore >= 7) {
          remark = "Excellent, Keep the good work going."
          remarkColor = "green"
      }
      let playerGrade = (playerScore / 10) * 100;
      let name = userdata.name;
      
      // myDB.ref('users/' + `user_${name.toLowerCase()}`).push({
      //   score: `${playerScore}`,
      //   wrong: `${wrongAttempt}`,
      // })

      let result = {
        score: playerScore,
        wrong: wrongAttempt,
        remark: remark,
        remarkColor: remarkColor,
        grade: playerGrade,
      }

      // function writeNewPost(uid, username, picture, title, body) {
      //   // A post entry.
      //   var postData = {
      //     author: username,
      //     uid: uid,
      //     body: body,
      //     title: title,
      //     starCount: 0,
      //     authorPic: picture
      //   };
      
      //   // Get a key for a new Post.
      //   var newPostKey = firebase.database().ref().child('posts').push().key;
      
      //   // Write the new post's data simultaneously in the posts list and the user's post list.
      //   var updates = {};
      //   updates['/posts/' + newPostKey] = postData;
      //   updates['/user-posts/' + uid + '/' + newPostKey] = postData;
      
      //   return firebase.database().ref().update(updates);
      // }

      myModuleView.showScoreModal(result);
    }

    this.select = (elem) => myModuleView.select(elem);

    this.hideSelect = (elem) => myModuleView.hideSelect(elem);
    
    this.checkAnswer = (curAnswer) => {
      let okAnswer = questions[index].question.answer;

      answers[index] = {};
      answers[index].ok = okAnswer.toUpperCase();
      answers[index].cur = curAnswer.toUpperCase();  
      
      if (okAnswer == curAnswer) {
        console.log('right');
        playerScore++;
        answers[index].result = true;
        myModuleView.setLabelBackground(curAnswer,'ok');        
      } else {
        console.log('wrong');
        wrongAttempt++;
        answers[index].result = false;
        myModuleView.setLabelBackground(okAnswer,'ok');
        myModuleView.setLabelBackground(curAnswer,'wrong'); 
      } 

      index++;
      setTimeout(() => {
        myModuleView.setLabelBackground();
        this.getNextQuestion();
      }, 2000);
      // console.log(playerScore + ', ' + wrongAttempt);
    };

    this.showCheckModal = () => myModuleView.showCheckModal();
    this.hideCheckModal = () => myModuleView.hideCheckModal();    
    this.showWarning = () => myModuleView.showWarning();
    this.hideWarning = () => myModuleView.hideWarning();

    this.closeScoreModal = () => {
      myModuleView.closeScoreModal();
    }

    this.stopQuiz = () => {
       isQuizStarted = false;
       sessionQuestions = {};
       questions = null;
       index = 0;
      //  debugger;
       myModuleView.removeQuiz();
    };

  }
  /* -------- end model -------- */

  /* ----- begin controller ---- */
  function ModuleController (){
    let myModuleContainer = null;
    let myModuleModel = null;
    let str  = '';
    let morseStr = '';

    this.init = function(container, model) {
      myModuleContainer = container;
      myModuleModel = model;

      const update = () => {
        // debugger;
        if (myModuleContainer.querySelector('main')) {          
          myModuleContainer.querySelector('main').removeEventListener('click',this.quizHandler);
          myModuleModel.stopQuiz();
        }
        const hashPageName = location.hash.slice(1).toLowerCase();
        this.updateState(hashPageName); //первая отрисовка
        this.addListeners(hashPageName);
      }

      window.addEventListener("hashchange", update);
      update();
    },

    
    this.updateState = function(page) {        
      myModuleModel.updateState(page);        
    },   

    this.addListeners = function(page){
      console.log(page); 

      if (page === 'explore') this.addExplorePageListeners();
      if (page === 'practice') this.addPracticePageListeners();
    },

    this.addPracticePageListeners = function(){

      myModuleContainer.querySelector(`.content`).addEventListener('click', (e) => {

        let userdata = {};
        const inputs = myModuleContainer.querySelectorAll('input');
        if (e.target.className === 'start-quiz-button') {
          // e.preventDefault();
          // e.stopPropagation();

          inputs.forEach(input => {
            if (input.type === 'text' && input.name === 'user') {
              userdata.name = input.value;
            }
            if (input.type === 'radio'){
              if (input.checked) {                
                switch (input.name) {
                  case "context": userdata.context = input.value; break;
                  case "level": userdata.level = input.value; break;
                  case "language": userdata.language = input.value; break;
                }                               
              }              
            }
          })
          // console.log(userdata);
          if (!userdata.name) {
            myModuleModel.showWarning();
          } else {
            // myModuleModel.hideWarning();
            myModuleModel.createQuiz(userdata);
            myModuleContainer.querySelector('main').addEventListener('click',this.quizHandler);
          }

        }

      })

    }

    this.quizHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let parentDiv = myModuleContainer.querySelector('.game-options-container'); 
      // debugger;
      // console.log(e.target);
      let selectedOption = parentDiv.querySelector('.selected');
      
      if (e.target.className === 'next-button'){
        if (selectedOption){
          let currentAnswer = selectedOption.querySelector('label').textContent;
          // console.log(currentAnswer);
          myModuleModel.checkAnswer(currentAnswer);
          // debugger;
        } else {
          console.log('nothing selected');
          myModuleModel.showCheckModal();
        }
      }

      if (e.target.className == 'option' && e.target.tagName == 'LABEL') {
        if (selectedOption) { 
          myModuleModel.hideSelect(selectedOption);          
        }         
        myModuleModel.select(e.target.parentNode);
      }

      if (e.target.className == 'close-checkModal-button'){
        myModuleModel.hideCheckModal();
      }

      if (e.target.classList.contains("img_play")) {
        // debugger;
        let str = (e.target.classList.contains("answer")) ? e.target.parentNode.querySelector('.option').textContent :
                                                            e.target.parentNode.querySelector('#display-question').textContent;
        myModuleModel.playMorse(str);
      }

      if (e.target.className === 'close-btn' || e.target.className === 'closeScoreModal'){
        myModuleContainer.querySelector('main').removeEventListener('click',this.quizHandler);
        myModuleModel.stopQuiz();
        if (e.target.className == 'closeScoreModal') {
          myModuleModel.closeScoreModal();
        }       
      }

      // if (e.target.className == 'closeScoreModal') {
      //   myModuleModel.closeScoreModal();
      // }
    }

   

    this.addExplorePageListeners = function(){
      const alphabetBtns = content.querySelectorAll('.alphabet-button'),
            textareas = document.querySelectorAll('textarea'),

            clearBtns = document.querySelectorAll('.clear'),
            playBtns = document.querySelectorAll('.play');

      const changeLangInputs = myModuleContainer.querySelectorAll('.lang');
      changeLangInputs.forEach(input => {
          input.addEventListener('click', (e) => {            
            myModuleModel.setLanguage(input.value);
          })
      })

      alphabetBtns.forEach(btn => {
        btn.addEventListener('click',(e) => {
            // e.preventDefault();
            let inner;               
            switch (e.target.className) {                        
                case 'morse': inner = e.target.innerHTML; break;
                case 'alpha': inner = e.target.parentNode.querySelector('.morse').innerHTML; break;
                case 'alphabet-button': inner = e.target.querySelector('.morse').innerHTML; break;
            }
            myModuleModel.playMorse(inner);                
        })
      })
      
      textareas.forEach(tArea => {
        if (tArea.classList.contains('code-word')) {
          tArea.addEventListener('input', (e) => { 
            myModuleModel.codeMorse(tArea.value, myModuleContainer.querySelector('#decode_morse'));       
          });
        }
        else {
          tArea.addEventListener('input', (e) => {
            myModuleModel.decodeMorse(tArea.value, myModuleContainer.querySelector('#code_word'));            
          });
        }
      })

      clearBtns.forEach(btn => {
        btn.addEventListener('click',(e) => {
          e.preventDefault();
          myModuleModel.clearInput(myModuleContainer.querySelector('.code-word'), myModuleContainer.querySelector('.decode-morse'));
        })           
      })

      playBtns.forEach(btn => {
        btn.addEventListener('click',(e) => {
          e.preventDefault();
          let inner = myModuleContainer.querySelector('.decode-morse').value;
          myModuleModel.playMorse(inner);
        })           
      })

    }

  }

  return {
    init: function({container, routes, components}) {
      this.renderComponents(container, components);

      const view = new ModuleView();
      const model = new ModuleModel();
      const controller = new ModuleController();

      //связываем части модуля
      view.init(document.getElementById(container), routes);
      model.init(view);
      controller.init(document.getElementById(container), model);     
    },

    renderComponents: function (container, components) {
      const root = document.getElementById(container);
      const componentsList = Object.keys(components);
      for (let item of componentsList) {
        root.innerHTML += components[item].render("component");
      }
    },
};

}());

// *** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "spa",
  routes: routes,
  components: components
}));
