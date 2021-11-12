// Список компонент (from components.js)
const components = {
  header: Header,
  navbar: NavBar,
  content: Content,
  // footer: Footer,
};

// Список поддердживаемых роутов (from pages.js)
const routes = {
  main: HomePage,
  login: LoginForm,
  explore: Explore,
  practice: Practice,
  results: Results,
  challenge: Challenge,
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
      if (hashPageName.length > 0) {
        routeName = hashPageName in routes ? hashPageName : "error";
      }

      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = '';
      contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`,contentContainer);
      if (routeName === 'explore' || routeName === 'challenge') {
        this.createMorseTable(routeName);        
      }
      if (routeName === 'challenge') this.disableBtns();

      if (routeName === 'practice') {
       myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.startQuizPage;
      }      
      this.showLoginForm();
      this.updateButtons(routesObj[routeName].id);
    },

    this.showLoginForm = () => {LoginForm.render()}
    this.sayHi = (user) => {
      myModuleContainer.querySelector('.hi-section').textContent = `Hi ${user}`;
      document.querySelector('.log-in').textContent = 'Log out';
      document.querySelector('.log-out').classList.replace('log-in','log-out');
    }

    this.logOut = () => {
      document.querySelector('.hi-section').textContent = 'Bye';
      document.querySelector('.log-out').textContent = 'Log in';
      document.querySelector('.log-out').classList.replace('log-out','log-in');
    }

    this.logIn = () => {
      document.querySelector('.hi-section').textContent = 'Hi';
      document.querySelector('.log-in').textContent = 'Log out';
      document.querySelector('.log-out').classList.replace('log-in','log-out');
    }

    this.disableBtns = () => {
      myModuleContainer.querySelectorAll('.alphabet-challenge-btn').forEach(btn => { btn.classList.add('disabled')})
    }

    this.createMorseTable = (routeName = 'explore') => {   
      console.log(routeName);
      let arr = (language == 'eng') ? morseCode : morseCodeRus;
      let div = (routeName === 'explore') ? myModuleContainer.querySelector('.alphabet') :
                                            myModuleContainer.querySelector('.alphabet_challenge');
      // if (routeName === 'explore') 
      div.innerHTML = '';

      for (let [symbol, code] of Object.entries(arr)){
        let btn = document.createElement('button');
        (routeName === 'explore') ? btn.classList.add('alphabet-button') :
                                    btn.classList.add('alphabet-challenge-btn');
        btn.innerHTML = (routeName === 'explore') ? 
                        `<span class ="alpha">${symbol.toUpperCase()}</span> <span class ="morse">${code}</span>` :
                        `<span class ="alpha-challenge">${symbol.toUpperCase()}</span>`;    
        // debugger;                              
        div.append(btn);
      }
    },

    this.switchForm = (elem) => {
      if (elem.parentNode.classList.contains('is-active')) {return;}
      else {
        myModuleContainer.querySelectorAll('.form-wrapper').forEach(item => {
          item.classList.toggle('is-active');
        });
      }
    }
   
    this.setLanguage = (lang) => {
      language = lang;
      if (myModuleContainer.querySelector('#current_language')) {        
        myModuleContainer.querySelector('#current_language').textContent = (language === 'eng') ? 'English' : 'Russian';
        this.createMorseTable();
      } else {
        this.createMorseTable('challenge');
      }
      
    }

    this.updateButtons = function(currentPage) {
      const menuLinks = menu.querySelectorAll(".mainmenu__link");

      for (let link of menuLinks) {
        currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
      }
    }

    this.select = (elem) => elem.classList.add('selected');
    this.hideSelect = (elem) => elem.classList.remove('selected');    
    this.clearInput = (tArea1, tArea2) => tArea2.value = tArea1.value = '';

    this.showCorrectOrFalse = (isCorrect) => {
      myModuleContainer.querySelector('.current-result').innerHTML = ((isCorrect) ) ? '<span style="color: green"> CORRECT! </span>' 
                                                                                    : '<span style="color: red"> FALSE! </span>';
    },

    this.challengeOver = () => {
      myModuleContainer.querySelector('.current-result').innerHTML = '<span style="color: red"> Challenge is over! Try again </span>';
      myModuleContainer.querySelector('.gradient-button').classList.remove('disabled');      
      myModuleContainer.querySelector('#stop_challenge').classList.add('disabled');
    }

    this.deleteOneLive = () => {
      let heartSpans = myModuleContainer.querySelector('.lives').querySelectorAll('span');
      for (let i = heartSpans.length-1; i >= 0; i--) {
        console.log(heartSpans[i].classList);
        if (heartSpans[i].classList.contains('active')) {
          heartSpans[i].classList.remove('active');
          break;
        }
      }
    };

    this.makeBtnGreen = (inner) => {
      myModuleContainer.querySelectorAll('.alphabet-challenge-btn').forEach(btn => {
        let x = btn.querySelector('.alpha-challenge').textContent.toLowerCase();
        if (inner.toLowerCase() === x) {
          if (btn.classList.contains('right-1')) btn.classList.replace('right-1','right-2');
          else if (btn.classList.contains('right-2')) btn.classList.replace('right-2','right-3');
          else if (btn.classList.contains('right-3')) btn.classList.replace('right-3','right');
          else {btn.classList.add('right-1'); }          
        }
      })
    };

    this.startChallenge = (level) => {
      myModuleContainer.querySelectorAll('.alphabet-challenge-btn').forEach(btn => { 
        // debugger;
        let x = btn.querySelector('.alpha-challenge').textContent.toLowerCase();
        if (level.includes(x) ) {
          btn.classList.remove('disabled');
          btn.classList.remove('right');
        }
      });     
      myModuleContainer.querySelector('#start_challenge').classList.add('disabled');
      myModuleContainer.querySelector('#stop_challenge').className = 'gradient-button stop-challenge';
      myModuleContainer.querySelector('#next_level_challenge').classList.remove('unvisible');
      myModuleContainer.querySelector('#caption_challenge').classList.add('unvisible');  //

      myModuleContainer.querySelector('#challenge_question').classList.remove('unvisible');
      myModuleContainer.querySelector('#challenge_lives').classList.remove('unvisible');
      myModuleContainer.querySelector('.lives').classList.remove('unvisible');
      myModuleContainer.querySelector('.current-result').classList.remove('unvisible');
      myModuleContainer.querySelector('#alphabet_challenge').classList.remove('unvisible');
      
    }

    this.printMorseOrStr = (morseStr,field, str = '') =>{
      if (field) {
        field.value = morseStr;
      } else {
        myModuleContainer.querySelector('#decode_morse').value = morseStr;
        myModuleContainer.querySelector('#code_word').value = str;        
      }
      
    }, 

    this.showToTopBtn = () => {
      myModuleContainer.querySelector('.scrollup').style.display = (window.pageYOffset > 250) ? 'block' : 'none';
    },

    this.toTop = () => {
      window.scrollBy({
        top: -document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
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

    this.removeQuiz = () => myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.startQuizPage;

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
    this.showWarning = () => myModuleContainer.querySelector('#username_input').querySelector('h2').classList.add('wrong-name');


    this.printUser = function(userList) {
      let userListContainer = document.getElementById('users-list__container');

      if (!userListContainer) {
          document.getElementById('users').innerHTML += `
          <div class="columns">
              <div class="column">
                  <div class="users-list">
                      <h4 class="title is-4">Список пользователей:</h4>
                      <table id="users-list" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                          <thead>
                              <tr>
                                  <th>Пользователь</th>
                                  <th>email</th>
                                  <th></th>
                              </tr>
                          </thead>
                          <tbody id="users-list__container"></tbody>
                      </table>
                  </div>
              </div>
          </div>
          `;
          userListContainer = document.getElementById('users-list__container');
      } else {
          userListContainer.innerHTML = '';
      }

      for (let user in userList) {
          userListContainer.appendChild(createRow(user, userList));
      }
      

      function createRow(user, userList) {
          let row = document.createElement('tr'),
              td1 = document.createElement('td'),
              td2 = document.createElement('td'),
              td3 = document.createElement('td');
              td4 = document.createElement('td');
              td5 = document.createElement('td');
          row.setAttribute('data-id', user);
          td1.innerHTML = `<strong>${userList[user].name}</strong>`;
          td2.innerHTML = `${userList[user].context}`;
          td3.innerHTML = `${userList[user].level}`;
          td4.innerHTML = `${userList[user].language}`;
          td5.innerHTML = `<a href="#" class="delete is-medium" title="удалить пользователя">Удалить</a>`;
          row.appendChild(td1);
          row.appendChild(td2);
          row.appendChild(td3);
          row.appendChild(td4);
          row.appendChild(td5);

          return row;
      }
  }

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
    let audioData = {};    
    let o = null;
    let context = null;
    let isTransfer = true;
    let buffer = '';
    let isAudio = true;

    let morse = {};
    morse.ditMaxTime = 1200 / 15 * 0.3;
    morse.letterGapMinTime = morse.ditMaxTime*3;
    morse.wordGapMaxTime = morse.ditMaxTime*7;
    morse.morseHistorySize = 50;
    morse.charT = 0;
    morse.gapT = 0;
    morse.gapTimer = null;
    morse.charTimer = null;
    morse.buffer = '';
    morse.isRunning = false;

    let isChallengeStarted = false;
    let challengeData = {
      levelsComplited: [],
      learned:[],
      points: 0,
    };
    let challengeLevel = 0; 

    
    let playerScore = 0 ; //holds the player score
    let wrongAttempt = 0 ;//amount of wrong answers picked by player

    const that = this;

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

    // this.createAudioCtx = () => {
    //   var AudioContext = window.AudioContext || window.webkitAudioContext;
    //   audioData.ctx = new AudioContext();
    //   audioData.dot = 1.2 / 15;

    //   var t = ctx.currentTime;

    //   var oscillator = ctx.createOscillator();
    //   oscillator.type = "sine";
    //   oscillator.frequency.value = 600;

    //   var gainNode = ctx.createGain();
    // }

    this.playMorse = function(str,on){
      if (!on) on = isAudio;
      if (on){
        if (!str) str = this.strToMorse(challengeData.curQuestion); // for challenge
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
      }      
      // return false;
    },

    this.checkGapBetweenInputs = () => {
      if (morse.gapT >= morse.letterGapMinTime && morse.gapT < morse.wordGapMaxTime) {          
          morse.buffer += ' ';         
          clearInterval(morse.gapTimer);
          morse.gapT  = 0;
      }
    }

    this.startCharTimer = () => {
        morse.charTimer = setInterval(() => {
            morse.charT += 1;
        }, 1);
    }

    this.stopCharTimer = () => {
      clearInterval(morse.charTimer);
      morse.charTimer = 0;
      morse.charTime = 0;
    }

    this.startGapTimer = () => {
        morse.gapT = 0;
        morse.gapTimer = setInterval(() => {
          morse.gapT += 1;

            // Gap between words
            if (morse.gapT >= morse.wordGapMaxTime) {
                morse.buffer += '   ';
                clearInterval(morse.gapTimer);
                morse.gapTimer = 0;
                morse.gapT = 0;
            }
            else if (morse.gapT >= morse.letterGapMinTime) {
                morse.buffer += ' ';
                clearInterval(morse.gapTimer);
                morse.gapTimer = 0;
                morse.gapT = 0;
            }
        }, 1);
    }

    this.handleMorseTapEnd = (e) => {
      if (morse.isRunning) {
        if ((e.target.id !== "morse_button") || (e.repeat)) {return}

        morse.isRunning = false;
        
        if (morse.charT <= morse.ditMaxTime) {
          morse.buffer += '.';
        } else {
          morse.buffer += '-';
        }

        this.stopCharTimer();
        this.startGapTimer();
        console.log(morse.buffer);
        // myModuleView.printMorseOrStr(morse.buffer,'',this.morseToStr(morse.buffer))
        
        // Account for bug triggered when pressing paddle button (e.g.) outside of body, then clicking into body, and depressing key
        // if (o === undefined) { 
        //     return
        // }
        if (o.context.state === 'running') {
            g.gain.setTargetAtTime(0.0001, context.currentTime, 0.001)
            o.stop(context.currentTime + 0.05)
        }
      } else { return }
      
    }

    this.handleMorseTapStart = (e) => {  

      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new AudioContext();      
      context = ctx;
      // debugger;
      if (morse.isRunning) {return;} 
      else {
          morse.isRunning = true;
          if (( e.target.id !== "morse_button") || (e.repeat)) {return;}
          else {  
              if (context.state === 'interrupted') {
                context.resume();
              }              
              o = context.createOscillator();
              o.frequency.value = 600;
              o.type = "sine";
              
              g = context.createGain();
              g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime);
              o.connect(g);
              g.connect(context.destination);
              o.start();
              this.checkGapBetweenInputs();
              clearInterval(morse.gapTimer);  
              this.startCharTimer();
          }
      }
      
    }

    this.strToMorse = (str, lang = '') => {
      let arr =[];
      if (lang) {
        arr = (lang == 'eng') ? morseCode : morseCodeRus;
      } else {
        arr = (curExpLanguage == 'eng') ? morseCode : morseCodeRus;
      }
      let res = str.split('').map(i => {
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

    this.clearInput = (tArea1, tArea2) => { 
      buffer = morse.buffer = '';
      myModuleView.clearInput(tArea1, tArea2);
    };

    this.switchAudio = (checked) => {
      isAudio = checked;
      console.log(isAudio);
    };

    this.switchTransfer = (checked) => {
      isTransfer = checked;
      console.log(isTransfer);
    };

    this.sendToTArea = (inner,strTArea,codeTArea) => {
      if (isTransfer) {
        buffer += ' ' + inner;
        myModuleView.printMorseOrStr(buffer,codeTArea);
        myModuleView.printMorseOrStr(this.morseToStr(buffer),strTArea);
      }
    };

    this.createQuiz = (obj) => {
      userdata = obj; 
      // let userJSON = JSON.stringify(userdata);
      // // console.log(userJSON);
      
      // this.addUser(userdata);
      // // const dbRef = firebase.database().ref();
      // let name = "my name";
      // let value = "John Smith"
      // // кодирует в my%20name=John%20Smith
      // console.log(document.cookie);
      // document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      // console.log(document.cookie);
      
      if (!isQuizStarted) {
        isQuizStarted = true;
        this.setQuestions();
        console.log(sessionQuestions);
        questions = Object.values(sessionQuestions);
        this.getNextQuestion();        
      }     
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
            itemQ = (context === 'writing') ? random[0].toUpperCase() : random[1];
            itemA = (context === 'writing') ? random[1] : random[0].toUpperCase();         
            break;
          case 'medium':
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
      }, 3000);
      // console.log(playerScore + ', ' + wrongAttempt);
    };

    this.showCheckModal = () => myModuleView.showCheckModal();
    this.hideCheckModal = () => myModuleView.hideCheckModal();    
    this.showWarning = () => myModuleView.showWarning();
    this.hideWarning = () => myModuleView.hideWarning();
    this.showToTopBtn = () => myModuleView.showToTopBtn()
    this.toTop = () => myModuleView.toTop();
    this.switchForm = (elem) => myModuleView.switchForm(elem);

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

    this.getUsersList = function() {
      myDB.ref("users/").once("value")
      .then(function(snapshot) {
          console.log("Users list:");
          console.log(snapshot.val());
          // myModuleView.printUser(snapshot.val());
      }).catch(function (error) {
          console.log("Error: " + error.code);
      });
    }

    this.printUsersList = function() {
      myDB.ref("users/").on("value", function(snapshot) {
        myModuleView.printUser(snapshot.val());
      }, function (error) {
          console.log("Error: " + error.code);
      });
    }

    this.setNextChallengeQuestion = (level) => {      
      return question= level[Math.floor(Math.random() * level.length)];
    }

    this.startChallenge = () => {
      if (!isChallengeStarted) {
        // const array1 = ['a', 'b', 'c'];
        // const array2 = ['d', 'e', 'f'];
        // const array3 = array1.concat(array2);
        let level = challengeData.level = levels[challengeLevel].concat(challengeData.learned);
        // let level = challengeData.level = levels[challengeLevel].map((x) => x);
        challengeData.sample = levels[challengeLevel].map((x) => x);
        challengeData.points = 0;
        challengeData.lives = 4;
        let q = challengeData.curQuestion = this.setNextChallengeQuestion(challengeData.level);
        // challengeData[`${q}`] = 0;
        console.log(challengeData.level);
        myModuleView.startChallenge(level);
        this.playMorse(false,true);
        isChallengeStarted = true;
      }      
    }

    this.checkChallengeAnswer = (inner) => {
      // debugger;      
      console.log(challengeData.curQuestion, inner);
      console.log(inner.toLowerCase() == challengeData.curQuestion.toLowerCase());
      let q = challengeData.curQuestion;
      console.log(q);
      if (inner.toLowerCase() == challengeData.curQuestion.toLowerCase()) {
        if (challengeData.hasOwnProperty(`${q}`)) {          
          challengeData[`${q}`]++;
          if (challengeData[`${q}`] == 4) { 
            if (!challengeData.learned.includes(q)) challengeData.learned.push(q); 
            delete challengeData[`${q}`]; 
            challengeData.level = challengeData.level.filter((item) => item !== q);
            console.log(challengeData.level);
          }          
        } else {
          challengeData[`${q}`] = 1;
        }        
        myModuleView.showCorrectOrFalse(true);
        myModuleView.makeBtnGreen(inner);
      } else {         
        if (challengeData.lives > 0) {
          challengeData.lives--;
          myModuleView.showCorrectOrFalse(false);
          myModuleView.deleteOneLive();
        } else {
          myModuleView.deleteOneLive();
          myModuleView.challengeOver();
          myModuleView.disableBtns();
          isChallengeStarted = false;
        }        
      }
      console.log(challengeData);     
      if (challengeData.level.length > 0) {
        challengeData.curQuestion = this.setNextChallengeQuestion(challengeData.level);
        this.playMorse(false,true);
      } else {
        myModuleView.challengeOver();
        myModuleView.disableBtns();
        isChallengeStarted = false;
        challengeLevel++;
        let levelComplited = challengeData.sample.map(x => x);
        challengeData.levelsComplited.push(levelComplited);
        // debugger;
      }
      
    }; 
    this.stopChallenge = () => {
      myModuleView.challengeOver();
      isChallengeStarted = false;
    }

    ///** firebase functions **////
    // const that = this;
    this.login = function(userEmail, userPass) {
      
      if (userEmail && userPass) {
        firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
        .catch(function(error) {
          console.log("Error: " + error.message);
          // myModuleView.loginError("Неверный email или пароль. Введите корректные данные.");
          console.log("Неверный email или пароль. Введите корректные данные.");
        });
        
        firebase.auth().onAuthStateChanged(function(user) {
          let userData = null, userDataName = null, username = null;
          console.log('success');
          if (user) {
            console.log(user.email);
            myDBRef.child("users").orderByChild("email").equalTo(`${user.email}`).once("value",snapshot => {
              if (snapshot.exists()){
                userData = snapshot.val();
                userDataName = Object.keys(userData);
                username = userData[userDataName].username;
                // myModuleView.sayHi(username);
              }
            }).then(() => {
              console.log(userData);
              console.log(userDataName);
              console.log(username);
              myModuleView.sayHi(username);
            }).catch(function (error) {
                console.log("Error: " + error.code);
            });;
            
            
            // myDBRef.once("value", (snapshot) => {
            //   let a = snapshot.exists();
            //   console.log(a);
            //   // a === true
            //   let b = snapshot.child("users").exists(); 
            //   console.log(b);
            //   // b === true
            //   let c = snapshot.child("users/user_abc").exists();
            //   console.log(c);
            //   // c === true
            //   let d = snapshot.child("users/user_abc/email").exists();
            //   console.log(d);
            //   let e = snapshot.child("users/user_abc/email").val();
            //   console.log(e);
            //   // d === false (because there is no "rooms/room0" child in the data snapshot)
            // }); 

            // myDBRef.once('value', this.getData, errData);
            // console.log(user)
            // that.getData(snapshot);
            // var ref = firebase.database().ref();
            
            // console.log(myDBRef);
            // myDBRef
            // var a = snapshot.exists();
            // User is signed in.
            myModuleView.renderContent('explore');
            // that.getUsersList();
            // that.printUsersList();
          } else {
            // No user is signed in.
            // myAppView.hideForm();
            console.log('no user signed in')
          }
        });
      } else {
        console.log("Пустое поле Email или Password. Введите данные в указанные поля.");
      }
    }

    this.logout = function() {
      firebase.auth().signOut();      
      console.log("Пшёл вон! =)");
      myModuleView.logOut();
    }

    this.login = function() {     
      console.log("Hello user");
      myModuleView.logIn();
    }


    this.getData = (snapshot) => {
      myDBRef.child("users").orderByChild("email").equalTo(`${user.email}`).once("value",snapshot => {
        if (snapshot.exists()){
          const userData = snapshot.val();
          var userDataName = Object.keys(userData);
          var username = userData[userDataName].username;
          console.log(username);
          debugger;
          this.view.sayHi(username);
        }
      });
    }

  }
  /* -------- end model -------- */

  /* ----- begin controller ---- */
  function ModuleController (){
    let myModuleContainer = null;
    let myModuleModel = null;

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
        // this.addListeners(hashPageName);
      }

      window.addEventListener("hashchange", update);
      window.addEventListener('click',(e) => {
        if (e.target.classList.contains('log-out')) {
          // e.preventDefault();
          // e.stopPropagation();
          console.log('log out');
          myModuleModel.logout();
        }
      })
      this.addListeners();
      this.addScrollHandler();
      // this.addMenuCloseHandler();
      update();
    },

    this.loginHandler = (e) => {
      if (e.target.classList.contains('log-out')) {
        console.log('log out');
        myModuleModel.logout();
      }
      if (e.target.classList.contains('log-in')) {
        console.log('log in');
        myModuleModel.login();
      }
    }

    this.addScrollHandler = (e) => {
      let toTopBtn = myModuleContainer.querySelector('.scrollup');
      window.addEventListener('scroll', (e) => { myModuleModel.showToTopBtn();})     
      toTopBtn.addEventListener('click', () => { myModuleModel.toTop(); });
    },
    
    this.updateState = function(page) {        
      myModuleModel.updateState(page);        
    },   

    this.addListeners = function(){
      // console.log(page); 
      console.log(myModuleContainer.querySelector(`.content`)); 
      // if (page === 'results') myModuleModel.printUsersList();   

      /////*****   EXPLORE PAGE LISTENERS *****/////
      myModuleContainer.querySelector('.content').addEventListener('click', (e) => {
        // console.log(e.target);

        if (e.target.classList.contains('alphabet-button') || 
            e.target.classList.contains('morse') || 
            e.target.classList.contains('alpha')) {
          let inner;
          let checked = myModuleContainer.querySelector('.play_checkbox').checked;            
          switch (e.target.className) {                        
              case 'morse': inner = e.target.innerHTML; break;
              case 'alpha': inner = e.target.parentNode.querySelector('.morse').innerHTML; break;
              case 'alphabet-button': inner = e.target.querySelector('.morse').innerHTML; break;
          }
          myModuleModel.playMorse(inner,checked); 
          myModuleModel.sendToTArea(inner,myModuleContainer.querySelector('#code_word'), myModuleContainer.querySelector('#decode_morse'));          
        }

        if (e.target.classList.contains('clear')) {
          e.preventDefault();
          myModuleModel.clearInput(myModuleContainer.querySelector('.code-word'), myModuleContainer.querySelector('.decode-morse'));
        };

        if (e.target.classList.contains('play')){
          e.preventDefault();
          let inner = myModuleContainer.querySelector('.decode-morse').value;
          myModuleModel.playMorse(inner,true);
        }

        if (e.target.classList.contains('lang')){
          myModuleModel.setLanguage(e.target.value);
        }

        if (e.target.classList.contains('code-word')){          
          const inputHandler = (e) => {
            let value =  myModuleContainer.querySelector('.code-word').value;
            myModuleModel.codeMorse(value, myModuleContainer.querySelector('#decode_morse'));
          }
          myModuleContainer.querySelector('.code-word').addEventListener('input', inputHandler);
          myModuleContainer.querySelector('.code-word').addEventListener('blur', (e) => {
            myModuleContainer.querySelector('.code-word').removeEventListener('input', inputHandler);
          });
        }
        
        if (e.target.classList.contains('decode-morse')){          
          const inputHandler = (e) => {
            let value =  myModuleContainer.querySelector('.decode-morse').value;
            myModuleModel.decodeMorse(value, myModuleContainer.querySelector('#code_word'));
          }
          myModuleContainer.querySelector('.decode-morse').addEventListener('input', inputHandler);
          myModuleContainer.querySelector('.decode-morse').addEventListener('blur', (e) => {
            myModuleContainer.querySelector('.decode-morse').removeEventListener('input', inputHandler);
          });
        }

        if (e.target.classList.contains('transfer_checkbox') ) {          
          myModuleModel.switchTransfer(e.target.checked);
        }

        if (e.target.classList.contains('play_checkbox') ) {          
          myModuleModel.switchAudio(e.target.checked);
        }


        // myModuleContainer.querySelector('#morse_button').addEventListener('mousedown', myModuleModel.handleMorseTapStart);
        // myModuleContainer.querySelector('#morse_button').addEventListener('mouseup', myModuleModel.handleMorseTapEnd);

        /////*****   PRACTICE PAGE LISTENERS *****/////

        if (e.target.className === 'start-quiz-button') {
          const inputs = myModuleContainer.querySelectorAll('input');
          let userdata = {};
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
          if (!userdata.name) {
            myModuleModel.showWarning();
          } else {
            myModuleModel.createQuiz(userdata);
            myModuleContainer.querySelector('main').addEventListener('click',this.quizHandler);
          }

        }


        /////*****   CHALLENGE PAGE LISTENERS *****/////
        // let isStarted = false;
        if (e.target.id === 'start_challenge') {
          e.preventDefault();
          myModuleModel.startChallenge();
        }
        //stop_challenge
        if (e.target.id === 'stop_challenge') {
          e.preventDefault();
          myModuleModel.stopChallenge();
        }

        if (e.target.classList.contains('alpha-challenge') || e.target.classList.contains('alphabet-challenge-btn')) {
          if (e.target.classList.contains('alpha-challenge') && e.target.parentNode.classList.contains('disabled')) {
            return;
          } else if (e.target.classList.contains('disabled')){
            return;
          } else {
            e.preventDefault();
            let inner = (e.target.classList.contains('alpha-challenge')) ? 
                        e.target.innerHTML : e.target.querySelector('.alpha-challenge').innerHTML;
            console.log(inner);
            myModuleModel.checkChallengeAnswer(inner);        
          }
        }

        if (e.target.classList.contains("play-question")) {myModuleModel.playMorse(false,true);}


        /////*****   REGISTRATION PAGE LISTENERS *****/////

        if (e.target.classList.contains('switcher')){
          e.preventDefault();
          myModuleModel.switchForm(e.target);
        }

        // btn-login, btn-signup
        if (e.target.classList.contains('btn-login')) {
          e.preventDefault();
          e.stopPropagation();
          myModuleModel.login(
              myModuleContainer.querySelector("#login-email").value,
              myModuleContainer.querySelector("#login-password").value,
          );
        }

        if (e.target.classList.contains('log-out')) {
          // e.preventDefault();
          // e.stopPropagation();
          console.log('log out');
          myModuleModel.logout();
        }

        if (e.target.classList.contains('log-in')) {
          console.log('log in');
          myModuleModel.logout();
        }
        
      })        
      
    },

    this.quizHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let parentDiv = myModuleContainer.querySelector('.game-options-container'); 
      let selectedOption = parentDiv.querySelector('.selected');
      
      if (e.target.className === 'next-button'){
        if (selectedOption){
          let currentAnswer = selectedOption.querySelector('label').textContent;
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
        let str = (e.target.classList.contains("answer")) ? e.target.parentNode.querySelector('.option').textContent :
                                                            e.target.parentNode.querySelector('#display-question').textContent;
        myModuleModel.playMorse(str,true);
      }

      if (e.target.className === 'close-btn' || e.target.className === 'closeScoreModal'){
        myModuleContainer.querySelector('main').removeEventListener('click',this.quizHandler);
        myModuleModel.stopQuiz();
        if (e.target.className == 'closeScoreModal') {
          myModuleModel.closeScoreModal();
        }       
      }

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
