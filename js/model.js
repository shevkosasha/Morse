
  /* ------- begin model ------- */
  function ModuleModel () {

    let myModuleView = null;
    let loggedUser = {};
    let currentUserName;
    let page = null;
    let isPageLoaded = false;
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

    //объект настроек для передатчика Морзе
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
      levelNum: 0,
      currentChars: {},
    };
    let challengeIndex = 0;   

    const that = this;

    this.init = function(view) {
      myModuleView = view;  

      if (!this.getUserFromLocalStorage()) {
        myModuleView.showLoginForm();        
      } else {
        loggedUser = this.getUserFromLocalStorage();
        currentUserName = loggedUser.name;
        myModuleView.setUserName(loggedUser.name);
      }

    },

    this.updateState = (pageName) => {
      page = pageName;
      
      if (isChallengeStarted) this.stopChallenge();

      if (currentUserName) {
        myModuleView.renderContent(pageName)
        myModuleView.sayHi(currentUserName);
        myModuleView.setUserName(currentUserName);

        // if (pageName === 'explore') {
        //   this.setLanguage(curExpLanguage);
        // }
        
        if (pageName === 'info') {
          myModuleView.hideWarningInfo();
          // this.getUsersList();
          this.getQuizInfo();  
          this.getChallengeInfo();    
        }
      } else {
        myModuleView.showLoginForm();
      }
    }
   
    
    ///** firebase & local storage functions **////

    this.getUserFromLocalStorage = () => {
      if (typeof localStorage !== "undefined") {
        return JSON.parse(localStorage.getItem("morse_current_user"));
      } else {
        consol.log("localStorage is not defined and you can try to use cookies");
        return false;
      }
    },    

    this.clearLocalStorageData = function() {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(`user_${currentUserName.toLowerCase()}`);
          localStorage.removeItem("morse_current_user");
        } else {
            console.log("localStorage is not defined and you can try to use cookies");
        }
    },

    this.login = function(userEmail, userPass) {
        if (userEmail && userPass) {
          firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
          .catch(function(error) {
            console.log("Error: " + error.message);
            myModuleView.showAlert("Invalid email or password. Please enter correct data");
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
                  username = currentUserName = userData[userDataName].username;
                  // let currentUserName;

                  myModuleView.setUserName(username);
                  myModuleView.closeLoginForm();
                  myModuleView.sayHi(username);
                  console.log(username);
                  const currentUser = {}; // создаем объект для авторизованного пользователя
                  currentUser.name = username;
                  currentUser.email = userEmail;
                  currentUser.pass = userPass;
                  // // console.log (JSON.stringify(currentUser));
                  localStorage.setItem(`user_${username.toLowerCase()}`,JSON.stringify(userData));
                  localStorage.setItem('morse_current_user',JSON.stringify(currentUser)); // сохраняем авторизованного пользователя в localStorage
                  // loggedUser = that.getUserFromLocalStorage();
                  that.updateState(page);

                  }
              })
              // .then(() => { 
               
              // })
              .catch(function (error) {
                  console.log("Error: " + error.code);
              });
            } else {
              // No user is signed in.
              console.log('no user signed in');
            }
          });
        } else {
          myModuleView.showAlert("Empty email or password. Please enter data");
        }
    },
  
    this.logout = function() {
        firebase.auth().signOut().then(() => {
          currentUserName = '';
          myModuleView.setUserName(currentUserName);
          console.log("Bye Bye!");
          myModuleView.logOut();
          this.clearLocalStorageData();
        });          
    },

    this.createUser = (userName,userEmail,userPass) => {
      console.log(userEmail + ', ' + userPass);
      let name = userName.trim();
      let email = userEmail.trim();
      let pass = userPass.trim();
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(function (userName) {
          that.addUser(name,email);
          console.log(`Пользователь ${userName} добавлен в коллецию users`);
        })
        .then(function (userName,userEmail) {
          that.login(email,pass);
          console.log(`Пользователь ${userName} залогинен в коллецию users`);
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Eroor Msg: "  + errorMessage);
          myModuleView.showAlert("Empty email or password. Please enter data");
        });
        
      
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

      // this.printUsersList();
    },


        
    this.getUserFromDataBase = (snapshot) => {
        myDBRef.child("users").orderByChild("email").equalTo(`${user.email}`).once("value",snapshot => {
            if (snapshot.exists()){
            const userData = snapshot.val();
            var userDataName = Object.keys(userData);
            var username = userData[userDataName].username;
            this.view.sayHi(username);
            }
        });
    },

 

    this.getUsersList = function() {
        myDB.ref("users/").once("value")
        .then(function(snapshot) {          
            console.log("Users list:");
            console.log(snapshot.val());
            myModuleView.printUser(snapshot.val());
        }).catch(function (error) {
            console.log("Error: " + error.code);
        });
    },

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
      let list = {};
      myDB.ref("quiz/").once("value")
      .then(function(snapshot) {
          console.log("Quiz list:");         
          let quizUsers = snapshot.val();
          Object.keys(quizUsers).forEach(key => {
            var val = quizUsers[key];
            let username = val.username;
            let score = val.score;

            if(score) {list[username] = score;}
          })

          let sortList = (list)=> {
            var sortable = [];
            for (var key in list) {
                sortable.push([key, list[key]]);
            }        
            sortable.sort(function(a, b) {
                return b[1] - a[1];
            });        
            var orderedList = {};
            for (var idx in sortable) {
                orderedList[sortable[idx][0]] = sortable[idx][1];
            }
            return orderedList;
          }

          
          myModuleView.printQuizUsers(sortList(list));

        }).catch(function (error) {
          console.log("Error: " + error.code);
      });
    };

    this.deleteUserQuizInfo = (userid) => {
      myDB.ref('quiz/' + `user_${userid.toLowerCase()}`).remove()
      .then(function () {
          console.log("Пользователь удален из коллеции challenge");
      })
      .catch(function (error) {
          console.error("Ошибка удаления пользователя: ", error);
      });
      this.getQuizInfo();
    },

    this.getChallengeInfo = () => {
      let listScores = {};
      let listLevels = {};
      myDB.ref("challenge/").once("value")
      .then(function(snapshot) {
        console.log("Challenge list:");         
        let challengeUsers = snapshot.val();
        Object.keys(challengeUsers).forEach(key => {
          var val = challengeUsers[key];
          let username = val.username;
          let score = val.score;
          let level = val.level;
          if(score) listScores[username] = +score;
          if(level) listLevels[username] = +level;
        })
        

        let sortList = (list)=> {
          var sortable = [];
          for (var key in list) {
              sortable.push([key, list[key]]);
          }        
          sortable.sort(function(a, b) {
            return b[1] - a[1];
          });        
          var orderedList = {};
          for (var idx in sortable) {
              orderedList[sortable[idx][0]] = sortable[idx][1];
          }
          return orderedList;
        }

        let ordered = sortList(listScores);
        let result = {};

        for (let [key,value] of Object.entries(ordered)) {
          result[key] = {};
          result[key].score = value;
          result[key].level = listLevels[key]
        }

        myModuleView.printChallengeUsers(result);
      }).catch(function (error) {
          console.log("Error: " + error.code);
      });
    };

    this.deleteUserChallengeInfo = (userid) => {
      myDB.ref('challenge/' + `user_${userid.toLowerCase()}`).remove()
      .then(function () {
          console.log("Пользователь удален из коллеции challenge");
      })
      .catch(function (error) {
          console.error("Ошибка удаления пользователя: ", error);
      });
      this.getChallengeInfo();
    },

    this.addChallengeInfo = () => {
      myDB.ref('challenge/' + `user_${currentUserName.toLowerCase()}`).set({
        score: `${challengeData.points}`,
        level: `${challengeData.levelsComplited.lastComplited + 1}`,
        lastComplited: `${challengeData.levelsComplited.lastComplited + 1}`,
        username:`${currentUserName}`,
        data: challengeData,
      })      
      .catch(function (error) {
        console.error("Ошибка добавления информации: ", error);
      }); 
    }

    this.updateChallengeInfo =() => {

      myDB.ref('challenge/' + `user_${currentUserName.toLowerCase()}`).once("value",snapshot => {
        if (snapshot.exists()) {
          let user = snapshot.val();
          let name = user.username;

          let prevScore  = user.score;
          let currentScore =challengeData.points;
          let prevLevel =user.level;
          let currentLevel = challengeData.levelsComplited.lastComplited;

          let scoreToSave = (currentScore > prevScore) ? currentScore : prevScore;
          let levelToSave = (currentLevel > prevLevel) ? currentLevel : prevLevel;

          myDB.ref('challenge/' + `user_${currentUserName.toLowerCase()}`).update({
            score: `${scoreToSave}`, 
            level: `${levelToSave}`,
            lastComplited: `${challengeData.levelsComplited.lastComplited + 1}`,
          })
        } else {
          this.addChallengeInfo();
        }        
      });
    }
  

    this.showLoginForm = () => myModuleView.showLoginForm();
    this.closeLoginForm = () => myModuleView.closeLoginForm();

     // setting functions for Explore Page
     this.switchAudio = (checked) => {
        isAudio = checked;
        console.log(isAudio);
    };

    this.switchTransfer = (checked) => {
        isTransfer = checked;
    };

    this.setLanguage = (lang) =>{
        curExpLanguage = lang;
        myModuleView.setLanguage(lang);
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

    this.sendToTArea = (inner, strTArea, codeTArea) => {
        if (isTransfer) {
            buffer += inner;
            let code = this.strToMorse(buffer).split(' ').join(' ');
            myModuleView.printMorseOrStr(code,codeTArea);
            myModuleView.printMorseOrStr(buffer,strTArea);
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
        if (!str) {
          str = this.strToMorse(challengeData.curQuestion) // for challenge
        } 
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
    },

    this.checkGapBetweenInputs = () => {
      if (morse.gapT >= morse.letterGapMinTime && morse.gapT < morse.wordGapMaxTime) {          
          morse.buffer += ' ';         
          clearInterval(morse.gapTimer);
          morse.gapT  = 0;
      }
    }

    this.startCharTimer = () => {
        morse.charTimer = setInterval(() => {morse.charT += 1;}, 1);
    }

    
    this.startGapTimer = () => {
        morse.gapT = 0;
        morse.gapTimer = setInterval(() => {
          morse.gapT += 1;
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
        morse.isRunning = false;
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
      if (morse.isRunning) {return;} 
      else {
          morse.isRunning = true;
          o = context.createOscillator();
          o.frequency.value = 600;
          o.type = "sine";          
         
          g = context.createGain();
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
        questions = Object.values(sessionQuestions);
        this.getNextQuestion();        
      }     
    }  

    this.setQuestions = function(){
      let level = userdata.level;
      let lang = userdata.language;
      let context = userdata.context;

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
          codeArr = values = letters = (lang === 'eng') ? words : wordsRus;          
          break;        
      }
      
      for (let i=0; i < num; i++) {
        let random = codeArr[Math.floor(Math.random() * codeArr.length)]; //get symbol for qeuestion         
        let correct = Math.floor(Math.random() * 4);                      //get number of correct answer in option list
        let itemQ, itemA;                                                 //current question and correct answer
       
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

        if (sessionQuestions.hasOwnProperty(`Q_${itemQ}`)) {
            i--;
        } else {
          sessionQuestions[`Q_${itemQ}`] = {};
          sessionQuestions[`Q_${itemQ}`]['question'] = {question: `${itemQ}`,
                                                        answer: `${itemA}`, 
                                                        num: correct};                                                            
          let options = sessionQuestions[`Q_${itemQ}`]['options'] = [];
          // если уровень не hard, то подбираем рандомно варианты ответов, для уровня hard вместо вариантов отображается текстАреа
          if (level !== 'hard'){ 
            for( let j=0; j < 4; j++) {
                let item = (context === 'writing') ? values[Math.floor(Math.random() * values.length)] :
                                                   letters[Math.floor(Math.random() * letters.length)].toUpperCase();
  
              if (level === 'medium') item = (context === 'writing') ? this.strToMorse(item, lang) : item.toUpperCase();    

              if (!options.includes(item) && (item !== itemA)){
                options[j] = (j == correct) ? itemA : item;
              } else {
                j--;
              }        
            }
          } 
        }
      }
    }

    this.getNextQuestion = () => {
      if (index < questions.length) {
        let question = questions[index].question;
        let options = questions[index].options; 
        myModuleView.showQuestion(question, options, index, playerScore, userdata);   
      } else {
        this.handleEndQuiz();        
      }
    }

    this.handleEndQuiz = () => {     
            
      myDB.ref('quiz/' + `user_${currentUserName.toLowerCase()}`).set({
        score: `${playerScore}`,
        username:`${currentUserName}`,
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
      let level = userdata.level;

      answers[index] = {}; // объект для хранения истории ответов
      answers[index].question = questions[index].question.question; 
      answers[index].ok = okAnswer.toUpperCase();
      answers[index].cur = curAnswer.toUpperCase(); 
      
      
      if (okAnswer == curAnswer) {
        switch(level){
          case 'easy': playerScore++; break;
          case 'medium': playerScore += 2; break;
          case 'hard': playerScore += 3; break;
        }
        answers[index].result = true;
        myModuleView.setBackground(elemClass,curAnswer,'ok');        
      } else {
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
        this.setNextChallengeLevel();        
        challengeData.currentChars = {};
        challengeData.points = 0;
        challengeData.lives = 4;        
        myModuleView.startChallenge(challengeData.levelNum, challengeData.points);
        myModuleView.setButtonsColors(challengeData.level);
        this.nextChallengeQuestion();
        isChallengeStarted = true;
      }      
    }

    this.setNextChallengeLevel = () => {   
      challengeData.level = levels[challengeData.levelNum].concat(challengeData.learned); // объединяем пройденные уровни с текущим
      challengeData.sample = levels[challengeData.levelNum].map((x) => x);
      myModuleView.setButtonsColors(challengeData.level);
    }
    this.nextChallengeQuestion = () => {
      challengeData.curQuestion = this.setNextChallengeQuestion(challengeData.level);
      this.playMorse(false,true);
    }

    this.checkChallengeAnswer = (inner) => {
      let q = challengeData.curQuestion;
      if (inner.toLowerCase() == challengeData.curQuestion.toLowerCase()) {         //если выбранный вариант правильный
        if (challengeData.currentChars.hasOwnProperty(`${q}`)) {                                 // то проверяем, есть ли такой ключ (символ) в объекте данных челленджа
          challengeData.currentChars[`${q}`]++;                                                  // если есть, прибавляем его значение на единицу
          if (challengeData.currentChars[`${q}`] == 4) {                                         // если для этого символа уже дано 4 правильных ответа
            if (!challengeData.learned.includes(q)) challengeData.learned.push(q);  // помещаем его в массив изученных символов
            delete challengeData.currentChars[`${q}`];                                           // а сам ключ символа удаляем из объекта
            challengeData.level = challengeData.level.filter((item) => item !== q); // удаляем ключ из массива текущего уровня
          }          
        } else {
          challengeData.currentChars[`${q}`] = 1;                                                  // если ключ отсутствует в объекте, добавляем
        }  
        challengeData.points++;                                                       //  прибавляем очки
        myModuleView.showCorrectOrFalse(true);                                        // показываем результат
        myModuleView.makeBtnGreen(inner);
        myModuleView.updateChallengeScore(challengeData.levelNum,challengeData.points);
      } else {         
        if (challengeData.lives > 0) {
          challengeData.lives--;                                                      // если ответ неверный, то минус одна жизнь 
          myModuleView.showCorrectOrFalse(false);
          myModuleView.deleteOneLive();
        } else {                                                                      // если жизни закончились, game over
          myModuleView.deleteOneLive();
          myModuleView.challengeOver(challengeData.levelNum, challengeData.points);
          myModuleView.disableBtns();
          isChallengeStarted = false;
          this.updateChallengeInfo();  
          challengeData.curQuestion = '';       
        }        
      }

         //проверяем пройден ли весь уровень  
      if (challengeData.level.length > 0) {                                           //если нет, то генерируем следующий вопрос
        if (isChallengeStarted) this.nextChallengeQuestion();
        challengeIndex++;
      } else {
        if (challengeData.lives > 0) {                                                //если уровень пройден, проверяем оставшиеся жизни
          this.saveComplitedLevel();                                                  // если есть еще жизни, то генерируем следующий уровень
          this.setNextChallengeLevel();
          this.nextChallengeQuestion();
          myModuleView.updateChallengeScore(challengeData.levelNum,challengeData.points);
        } else {
          this.saveComplitedLevel();                                                  // иначе заканчиваем челлендж и сохраняем информацию
          challengeIndex = 0;
          isChallengeStarted = false;
          myModuleView.challengeOver(challengeData.levelNum, challengeData.points);
          myModuleView.disableBtns();
          this.updateChallengeInfo();
          challengeData.curQuestion = '';                
        } 
      }      
    }; 

    this.saveComplitedLevel = () => {
      challengeData.levelNum++;
      let levelComplited = challengeData.sample.map(x => x);
      challengeData.levelsComplited.levels.push(levelComplited);
      challengeData.levelsComplited.lastComplited++;
      console.log(challengeData.levelsComplited.lastComplited);
    }

    this.stopChallenge = () => { // функция для останова челленджа с сохранением достижений
      if (isChallengeStarted){
        this.updateChallengeInfo();
        myModuleView.challengeOver(challengeData.levelNum, challengeData.points);
        isChallengeStarted = false;
      }     
    }

  }

