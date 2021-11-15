
  /* ------- begin model ------- */
  function ModuleModel () {

    let myModuleView = null;
    let loggedUser = null;
    //переменные для квиза
    let isQuizStarted = false;
    let sessionQuestions = {};//объект для вопросов квиза
    let questions = null;   //объект для передачм вопросов квиза во вью
    let index = 0; // номер текущего вопроса квиза
    let userdata = null;//?
    let answers = [];//массив ответов
    let playerScore = 0 ; //holds the player score
    let wrongAttempt = 0 ;//amount of wrong answers picked by player

    let curExpLanguage = 'eng'; //язык по умолчанию при обработке кодов Морзе

    // let audioData = {};    
    let o = null; //переменная для объекта осциллографа
    let context = null; // аудио контекст

    let isTransfer = true; // флаг для передачи кодов Морзе в textarea, ExplorePage
    let buffer = ''; //буфер для передачи
    let isAudio = true; // флаг для проигрывания кодов Морзе в textarea, ExplorePage

    //объект настроек для передачика Морзе
    let morse = {
        ditMaxTime: 0,
        letterGapMinTime: 0,
        wordGapMaxTime:0,
        morseHistorySize: 50,
        charT: 0,
        gapT: 0,
        gapTimer: null,
        charTimer: null,
        buffer: '',
        isRunning: false,
    };
    morse.ditMaxTime = 1200 / 15 * 0.5; //  1.2 / 15, 1200 / 15 * 0.3
    morse.letterGapMinTime = morse.ditMaxTime*3;
    morse.wordGapMaxTime = morse.ditMaxTime*7;

    let isChallengeStarted = false;
    let challengeData = {
      levelsComplited: {
        lastComplited: -1,
        levels: [],
      },
      learned:[],
      points: 0,
      challengeLevel: 0
    };
    let challengeIndex = 0;   

    const that = this;

    this.init = function(view) {
      myModuleView = view;        
      console.log(firebase.auth().currentUser);
      // console.log(loggedUser);
        if (!this.getUserFromLocalStorage()) {
          myModuleView.showLoginForm();        
        } else {
          loggedUser = this.getUserFromLocalStorage();
          myModuleView.setUserName(loggedUser.name);
          this.login(loggedUser.email, loggedUser.pass);
        }
    },

    this.updateState = (pageName) => {
      myModuleView.renderContent(pageName); 
      if (pageName === 'info' && loggedUser.name) {
        myModuleView.hideWarningInfo();
        this.getUsersList();
        this.getQuizInfo();  
        this.getChallengeInfo();    
      }
    }
   
    
    ///** firebase & local storage functions **////

    this.getUserFromLocalStorage = () => {
      if (typeof localStorage !== "undefined") {
        return JSON.parse(localStorage.getItem("Morse_current_user"));
      } else {
        consol.log("localStorage is not defined and you can try to use cookies");
        return false;
      }
    },    

    this.clearLocalStorageData = function() {
        if (typeof localStorage !== "undefined") {

          console.log(loggedUser.name);
          localStorage.removeItem(`User_${loggedUser.name}`);
          localStorage.removeItem("Morse_current_user");
        } else {
            console.log("localStorage is not defined and you can try to use cookies");
        }
    },

    this.login = function(userEmail, userPass, pageName) {
      
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
                  // debugger;
                  userData = snapshot.val();
                  userDataName = Object.keys(userData);
                  username = userData[userDataName].username;

                  const currentUser = {}; // создаем объект для авторизованного пользователя
                  currentUser.name = username;
                  currentUser.email = userEmail;
                  currentUser.pass = userPass;
                  // console.log (JSON.stringify(currentUser));
                  localStorage.setItem(`User_${username}`,JSON.stringify(userData));
                  localStorage.setItem('Morse_current_user',JSON.stringify(currentUser)); // сохраняем авторизованного пользователя в localStorage
                  loggedUser = that.getUserFromLocalStorage();
                  }
              }).then(() => {     
                myModuleView.closeLoginForm();
                myModuleView.sayHi(username);
              }).catch(function (error) {
                  console.log("Error: " + error.code);
              });              
              
            
              // that.getUsersList();
              // that.printUsersList();
            } else {
              // No user is signed in.
              console.log('no user signed in');
            }
          });
        } else {
          console.log("Пустое поле Email или Password. Введите данные в указанные поля.");
        }
    },

    

    
  
    this.logout = function() {
        firebase.auth().signOut();   
        this.clearLocalStorageData()   
        console.log("Пшёл вон! =)");
        myModuleView.logOut();
    },

    this.createUser = (userName,userEmail,userPass) => {
      console.log(userEmail + ', ' + userPass);
      let name = userName.trim();
      let email = userEmail.trim();
      let pass = userPass.trim();
      firebase.auth().createUserWithEmailAndPassword(userEmail.trim(), userPass.trim())
        .then(function (userName) {
          that.addUser(name,email);
          // myModuleView.closeLoginForm();
          console.log(`Пользователь ${userName} добавлен в коллецию users`);
        })
        .then(function (userName,userEmail) {
          
          // myModuleView.closeLoginForm();
          console.log(`Пользователь ${userName} залогинен в коллецию users`);
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Eroor Msg: "  + errorMessage);
          // ...
        });
        
      that.login(email,pass);
      
    },

    this.addUser = function(username, useremail) {
      myDB.ref('users/' + `user_${username.replace(/\s/g, "").toLowerCase()}`).set({
          username: `${username}`,
          email: `${useremail}`
      })
      .then(function (username) {
          console.log("Пользователь добавлен в коллецию users");
      })
      .catch(function (error) {
          console.error("Ошибка добавления пользователя: ", error);
      });

      this.printUsersList();
    },


        
    this.getUserFromDataBase = (snapshot) => {
        myDBRef.child("users").orderByChild("email").equalTo(`${user.email}`).once("value",snapshot => {
            if (snapshot.exists()){
            const userData = snapshot.val();
            var userDataName = Object.keys(userData);
            var username = userData[userDataName].username;
            console.log(username);
            // debugger;
            this.view.sayHi(username);
            }
        });
    }

    this.getUsersList = function() {
        myDB.ref("users/").once("value")
        .then(function(snapshot) {
            console.log("Users list:");
            console.log(snapshot.val());
            myModuleView.printUser(snapshot.val());
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
    },

    this.deleteUser = (userid) => {
      myDB.ref('users/' + userid).remove()
      .then(function () {
          console.log("Пользователь удален из коллеции users");
      })
      .catch(function (error) {
          console.error("Ошибка удаления пользователя: ", error);
      });
      this.printUsersList();
    },

    this.getQuizInfo = () => {
      myDB.ref("quiz/").once("value")
      .then(function(snapshot) {
          console.log("Quiz list:");
          console.log(snapshot.val());
          myModuleView.printQuizUsers(snapshot.val());
      }).catch(function (error) {
          console.log("Error: " + error.code);
      });
    };

    this.getChallengeInfo = () => {
      myDB.ref("challenge/").once("value")
      .then(function(snapshot) {
          console.log("Challenge list:");
          console.log(snapshot.val());
          myModuleView.printChallengeUsers(snapshot.val());
      }).catch(function (error) {
          console.log("Error: " + error.code);
      });
    };
  
    this.showLoginForm = () => myModuleView.showLoginForm();
    this.closeLoginForm = () => myModuleView.closeLoginForm();

     // setting functions for Explore Page
     this.switchAudio = (checked) => {
        isAudio = checked;
        console.log(isAudio);
    };

    this.switchTransfer = (checked) => {
        isTransfer = checked;
        console.log(isTransfer);
    };

    this.setLanguage = (lang) =>{
        curExpLanguage = lang;
        myModuleView.setLanguage(lang);
        // console.log(loggedUser);
    },

    this.codeMorse = function(str,elem){
        let morseStr = this.strToMorse(str);
        myModuleView.printMorseOrStr(morseStr,elem);
    },
    
    this.decodeMorse = function(str,elem){
        if (morse.buffer) morse.buffer = str;
        let phrase = this.morseToStr(str);
        myModuleView.printMorseOrStr(phrase,elem);
    }

    this.clearInput = (tArea1, tArea2) => { 
        buffer = morse.buffer = '';
        myModuleView.clearInput(tArea1, tArea2);
    };    

    this.sendToTArea = (inner,strTArea,codeTArea) => {
        if (isTransfer) {
            buffer += ' ' + inner;
            myModuleView.printMorseOrStr(buffer,codeTArea);
            myModuleView.printMorseOrStr(this.morseToStr(buffer),strTArea);
        }
    };



    // Morse functions: play, code to Morse, decode from Morse

    
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
      // clearInterval(morse.charTimer);
      // morse.charTimer = 0;
      // morse.charT = 0;
    }

    this.startGapTimer = () => {
        morse.gapT = 0;
        morse.gapTimer = setInterval(() => {
          morse.gapT += 1;

            // Gap between words
            if (morse.gapT >= morse.wordGapMaxTime) {
                morse.buffer += '   ';
                clearInterval(morse.gapTimer);
                console.log(morse.buffer);
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
        // if ((e.target.id !== "morse_button") || (e.repeat)) {return}

        morse.isRunning = false;
        console.log(morse.charT, morse.ditMaxTime);
        if (morse.charT <= morse.ditMaxTime) {          
          morse.buffer += '.';
        } else {
          morse.buffer += '-';
        }
        // остановка таймера для символов точки и запятой
        clearInterval(morse.charTimer);
        morse.charTimer = 0;
        morse.charT = 0;

        this.startGapTimer();// запуск таймера для определения паузы
        console.log(morse.buffer);
        myModuleView.printMorseOrStr(morse.buffer,'',this.morseToStr(morse.buffer)) // выводим полученный символ
        
        if (o.context.state === 'running') {
            g.gain.setTargetAtTime(0.0001, context.currentTime, 0.001)
            o.stop(context.currentTime + 0.05)
        }
      } else { return }
      
    }

    this.handleMorseTapStart = () => {  

      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new AudioContext();      
      context = ctx;
      // debugger;
      if (morse.isRunning) {return;} 
      else {
          morse.isRunning = true;
          // if (context.state === 'interrupted') {
          //   context.resume();
          // }              
          o = context.createOscillator();
          o.frequency.value = 600;
          o.type = "sine";          
         
          g = context.createGain();
          // g.gain.exponentialRampToValueAtTime(1, ctx.currentTime);
          g.gain.setValueAtTime(1, ctx.currentTime);
          o.connect(g);
          g.connect(context.destination);
          o.start();
          this.checkGapBetweenInputs();
          clearInterval(morse.gapTimer);  
          this.startCharTimer();
      }
      
    }


    
    // create quiz function
    this.createQuiz = (obj) => {
      userdata = obj;      
      
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
      // let num = userdata.countQuestions = (level === 'easy') ? 10 : (level === 'medium') ? 15 : 20;
      let num = userdata.countQuestions = 10;

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
        case "hard":
          codeArr = values = (lang === 'eng') ? words : wordsRus;          
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
          case "hard":
            itemQ = (context === 'writing') ? random.toUpperCase() : this.strToMorse(random, lang);
            itemA = (context === 'writing') ? this.strToMorse(random, lang) : random.toUpperCase();
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
          if (level !== 'hard'){ // если уровень не hard, то подбираем рандомно варианты ответов, для уровня вместо вариантов отображается текстАреа
            for( let j=0; j < 4; j++) {
              let item = (context === 'writing') ? values[Math.floor(Math.random() * values.length)] :
                                                   letters[Math.floor(Math.random() * letters.length)].toUpperCase();
  
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

    }

    this.getNextQuestion = () => {
      // let questions = Object.keys(sessionQuestions);
      if (index < questions.length) {
        let question = questions[index].question;
        let options = questions[index].options; 
        myModuleView.showQuestion(question, options, index, playerScore, userdata);   
      } else {
        this.handleEndQuiz();        
      }
    }

    this.handleEndQuiz = () => {
      
      console.log(answers);
      console.log(userdata)
      localStorage.setItem(`User_${loggedUser.name}_quiz_result`,JSON.stringify(answers));
            
      myDB.ref('quiz/' + `user_${loggedUser.name.toLowerCase()}`).set({
        score: `${playerScore}`,
        username:`${loggedUser.name}`,
        // wrong: `${wrongAttempt}`,
        answers: answers,
        userdata: userdata,
      })      
      .catch(function (error) {
        console.error("Ошибка добавления информации: ", error);
      });           

      let result = {
        score: playerScore,
        wrong: wrongAttempt,
        answers: answers,
        userdata: userdata,
      }; 
      
      playerScore = wrongAttempt = 0;

      myModuleView.showScoreModal(result);

    }

    this.select = (elem) => myModuleView.select(elem);

    this.hideSelect = (elem) => myModuleView.hideSelect(elem);
    
    this.checkAnswer = (curAnswer,elemClass) => {
      let okAnswer = questions[index].question.answer; // правильный ответ

      answers[index] = {}; // объект для хранения истории ответов
      answers[index].question = questions[index].question.question; 
      answers[index].ok = okAnswer.toUpperCase();
      answers[index].cur = curAnswer.toUpperCase(); 
      
      
      if (okAnswer == curAnswer) {
        console.log('right');
        playerScore++;
        answers[index].result = true;
        myModuleView.setBackground(elemClass,curAnswer,'ok');        
      } else {
        console.log('wrong');
        wrongAttempt++;
        answers[index].result = false;
        if (elemClass === 'option') {
          myModuleView.setBackground(elemClass,okAnswer,'ok');
          myModuleView.setBackground(elemClass,curAnswer,'wrong');
        } else {
          myModuleView.setBackground(elemClass,curAnswer,'wrong');
        }
         
      } 

      index++; // прибавляем номер вопроса
      // устанавливаем смену вопроса через 2 секунды
      setTimeout(() => {
        myModuleView.fadeOutQForm();
        myModuleView.setBackground(elemClass);        
        this.getNextQuestion();
      }, 2000);
      // console.log(playerScore + ', ' + wrongAttempt);
    };

    this.showCheckModal = () => myModuleView.showCheckModal();
    this.hideCheckModal = () => myModuleView.hideCheckModal();    
    this.showWarning = () => myModuleView.showWarning();
    this.hideWarning = () => myModuleView.hideWarning();
    this.showToTopBtn = () => myModuleView.showToTopBtn()
    this.toTop = () => myModuleView.toTop();
    this.switchForm = (elem) => myModuleView.switchForm(elem);
    this.showAddUserForm = () => myModuleView.showAddUserForm();
    this.hideAddUserForm = () => myModuleView.hideAddUserForm();
    this.closeScoreModal = () => myModuleView.closeScoreModal();

    this.stopQuiz = () => {
       isQuizStarted = false;
       sessionQuestions = {};
       questions = null;
       index = 0;
       playerScore = wrongAttempt = 0;
      //  debugger;
       myModuleView.removeQuiz();
    };

    

    this.setNextChallengeQuestion = (level) => {      
      return question= level[Math.floor(Math.random() * level.length)];
    }

    this.startChallenge = () => {
      if (!isChallengeStarted) {        
        let level = challengeData.level = levels[challengeData.challengeLevel].concat(challengeData.learned); // объединяем пройденные уровни с текущим
        challengeData.sample = levels[challengeData.challengeLevel].map((x) => x); // делаем копию текущего уровня
        challengeData.points = 0;
        challengeData.lives = 4;
        challengeData.curQuestion = this.setNextChallengeQuestion(challengeData.level);
        myModuleView.startChallenge(level);
        this.playMorse(false,true);
        isChallengeStarted = true;
      }      
    }

    this.checkChallengeAnswer = (inner) => {
     
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
        challengeData.points++;      
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
      console.log(challengeIndex); 
      console.log(challengeData.level.length); 
      let maxAttempts = challengeData.level.length*4 + 4; // max answer attempts  
      if (challengeData.level.length > 0 && challengeIndex < maxAttempts) {
        challengeData.curQuestion = this.setNextChallengeQuestion(challengeData.level);
        this.playMorse(false,true);
        challengeIndex++;
      } else {
        myModuleView.challengeOver();
        myModuleView.disableBtns();
        isChallengeStarted = false;
        challengeIndex = 0;
        if (challengeData.level.length == 0) {
          challengeData.challengeLevel++;
          challengeData.levelsComplited.lastComplited++;
          let levelComplited = challengeData.sample.map(x => x);
          challengeData.levelsComplited.levels.push(levelComplited);
        }
        
        this.addChallengeInfo();
        // debugger;
      }
      
    }; 
    this.stopChallenge = () => {
      myModuleView.challengeOver();
      isChallengeStarted = false;
    }

    this.addChallengeInfo = () => {
      myDB.ref('challenge/' + `user_${loggedUser.name.toLowerCase()}`).set({
        score: `${challengeData.points}`,
        username:`${loggedUser.name}`,
        data: challengeData,
      })      
      .catch(function (error) {
        console.error("Ошибка добавления информации: ", error);
      }); 
    }

    

  }