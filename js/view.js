/* ------- begin view -------- */
function ModuleView() {
  let myModuleContainer = null;
  let menu = null;
  let contentContainer = null;
  let routesObj = null;
  let language = 'eng';
  let currentUserName;
  let currentPage;

  this.init = function(container, routes) {
    myModuleContainer = container;
    routesObj = routes;
    menu = myModuleContainer.querySelector("#mainmenu");
    contentContainer = myModuleContainer.querySelector("#content");
  },

  this.setUserName = (name) => {
    currentUserName = name;
    if (currentPage === 'practice') this.setQuizUserName(name);
  }
  
  this.renderContent = function(hashPageName) {
    currentPage = hashPageName;
    let routeName = "default";
    if (hashPageName.length > 0) {
      routeName = hashPageName in routes ? hashPageName : "error";
    }

    window.document.title = routesObj[routeName].title;
    contentContainer.innerHTML = '';
    contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`,contentContainer);
    // debugger;
    if (routeName === 'explore' || routeName === 'challenge') {
      this.createMorseTable(routeName);        
    }
    if (routeName === 'challenge') this.disableBtns();

    if (routeName === 'practice') {
     myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.startQuizPage;
     myModuleContainer.querySelector('#user_name').value = (currentUserName) ? currentUserName : '';
    }   
    
    // this.showLoginForm();
    this.updateButtons(routesObj[routeName].id);
  },

  this.showLoginForm = () => document.querySelector('.login-page').classList.add('visible');

  this.closeLoginForm = () => {
    document.querySelector('.login-page').classList.remove('visible');
    myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = '');

    let inputs = document.querySelector('.login-page').querySelectorAll('input');
    inputs.forEach(element => {element.value = '';});
  }

  this.sayHi = (user) => {
    myModuleContainer.querySelector('.hi-section').textContent = `Hi ${user}`;
    if (document.querySelector('.log-in')) {
      document.querySelector('.log-in').textContent = 'Log out';
      document.querySelector('.log-in').classList.replace('log-in','log-out');
    }     
  }

  this.logOut = () => {
    document.querySelector('.hi-section').textContent = 'Bye';
    document.querySelector('.log-out').textContent = 'Log in';
    document.querySelector('.log-out').classList.replace('log-out','log-in');
    this.closeLoginForm();
  }

  this.logIn = () => {
    document.querySelector('.log-out').classList.replace('log-in','log-out');
  }

  this.showAlert = (msg) => {
    myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = msg);
  }

  this.disableBtns = () => {
    myModuleContainer.querySelectorAll('.alphabet-challenge-btn').forEach(btn => { btn.classList.add('disabled')})
  }

  

  this.createMorseTable = (routeName = 'explore') => {   
    console.log(routeName);
    let arr = (language == 'eng') ? morseCode : morseCodeRus;
    let div = (routeName === 'explore') ? myModuleContainer.querySelector('.alphabet') :
                                          myModuleContainer.querySelector('.alphabet_challenge');
    if (routeName === 'explore') 
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
    myModuleContainer.querySelectorAll('.alert').forEach(alert => alert.textContent = '');

    let forms = document.getElementById('login_forms').querySelectorAll('form');
    forms.forEach(form => {
      if (form.classList.contains('visible')) {
        form.classList.replace('visible','unvisible');
      } else {
        form.classList.replace('unvisible','visible');
      }
    })
   
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

  this.challengeOver = (levelNum, points) => {
    // myModuleContainer.querySelector('#alphabet_challenge_result').innerHTML = '<h5 style="color: red"> Challenge is over! Try again </h5>';
    if (myModuleContainer.querySelector('.challenge-page')) {
      myModuleContainer.querySelector('.gradient-button').classList.remove('disabled');      
      myModuleContainer.querySelector('#stop_challenge').classList.add('disabled');
      myModuleContainer.querySelector('#challenge').classList.add('unvisible');
      myModuleContainer.querySelector('#caption_challenge').classList.remove('unvisible'); 
      myModuleContainer.querySelector('#alphabet_challenge_result').classList.remove('unvisible');
      myModuleContainer.querySelector('#alphabet_challenge_result').innerHTML = ` <h3 class="over-caption"> Challenge is over! But you can try again </h3>
                                                                              <h4 class="over-info">Complited levels: ${levelNum}</h4> 
                                                                              <h4 class="over-info">Earned points: ${points} </h4><br>`;
    }

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

  this.setButtonsColors = (level) => {
    myModuleContainer.querySelectorAll('.alphabet-challenge-btn').forEach(btn => { 
      // if (btn.classList.contains('right')) 
      btn.classList.remove('right');
      btn.classList.remove('right-1');
      btn.classList.remove('right-2');
      btn.classList.remove('right-3');
      let x = btn.querySelector('.alpha-challenge').textContent.toLowerCase();
      if (level.includes(x) ) {
        btn.classList.remove('disabled');
        btn.classList.remove('right');
      }
    });    
  };


  this.startChallenge = (levelNum, points) => {
       
    myModuleContainer.querySelector('#start_challenge').classList.add('disabled');
    myModuleContainer.querySelector('#stop_challenge').className = 'gradient-button stop-challenge';
    myModuleContainer.querySelector('#alphabet_challenge_result').classList.add('unvisible');
    myModuleContainer.querySelector('#caption_challenge').classList.add('unvisible');  //

    let heartSpans = myModuleContainer.querySelector('.lives').querySelectorAll('span');
    heartSpans.forEach(heart => {
      if (!heart.classList.contains('active')) heart.classList.add('active')
    });
    myModuleContainer.querySelector('.current-result').innerHTML = '';
    myModuleContainer.querySelector('.current-level-info').innerHTML = levelNum;
    myModuleContainer.querySelector('.current-score-info').innerHTML = points;

    myModuleContainer.querySelector('#challenge').classList.remove('unvisible');

    
    
  }

  this.updateChallengeScore = (level,points) => {
    myModuleContainer.querySelector('.current-score-info').innerHTML = points;
    myModuleContainer.querySelector('.current-level-info').innerHTML = level;
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
  },

  this.setQuizUserName = (name) => {
    myModuleContainer.querySelector('#user_name').value = (name) ? name : '';
  }

  this.showQuestion = (question, options, index, score, userdata) => {

    const fadeIn = () => {
      el = myModuleContainer.querySelector('.game-quiz-container');
      el.style.opacity = 0;
      // el.style.display = 'flex';
      (function fade() {
          var val = parseFloat(el.style.opacity);
          if (!((val += .1) > 1)) {
              el.style.opacity = val;
              requestAnimationFrame(fade);
          }
      })();
    }
    
    const fillQuestion = () => { 
      myModuleContainer.querySelector('.game-quiz-container').innerHTML = (userdata.level !== 'hard') ? Practice.questionPage : Practice.questionPageHard;

      if (userdata.context == 'audio') {
        myModuleContainer.querySelectorAll('.img_play').forEach(elem =>{
          (elem.classList.contains('answer')) ? elem.style.display = 'none' : elem.style.display = 'block';
        });
        myModuleContainer.querySelector('#display-question').style.display = 'none';
      }

      myModuleContainer.querySelectorAll('.how-many-questions').forEach(elem => elem.innerHTML = userdata.countQuestions);
      myModuleContainer.querySelector("#question-number").innerHTML = index + 1;
      myModuleContainer.querySelector("#player-score").innerHTML = score;
      myModuleContainer.querySelector("#display-question").innerHTML = question.question.toUpperCase();
      if (userdata.level !== 'hard'){
        myModuleContainer.querySelector("#option-one-label").innerHTML = options[0];
        myModuleContainer.querySelector("#option-two-label").innerHTML = options[1];
        myModuleContainer.querySelector("#option-three-label").innerHTML = options[2];
        myModuleContainer.querySelector("#option-four-label").innerHTML = options[3]; 
      } else {
        myModuleContainer.querySelector('.hard_quiz_caption').textContent = (userdata.context == 'audio') ? "Listen to the code Morse above and type text below"
                                                                                                          : "Read the text above and type code below"
      }
    } 
     
    setTimeout(() => {
      fillQuestion();      
      fadeIn();
    }, 500);
     
  };
    
  this.setBackground = (elemClass, inner = '',className = '') => {
    let optionLabels = myModuleContainer.querySelectorAll('.option');
    let tArea = myModuleContainer.querySelector('.answer-text-quiz');
    if (inner && className && elemClass) {
      console.log(elemClass);  
      if (elemClass === 'text') {
        console.log('text');
        tArea.parentNode.classList.add(className);
      }  
      if (elemClass === 'option') {
        optionLabels.forEach(label => {
          if (label.textContent == inner) label.parentNode.classList.add(className);
        });
      }  
    } 
    
  };

  this.showCheckModal = () => {
    myModuleContainer.querySelector('#option-modal').style.display = "block";
    myModuleContainer.querySelector('#option-modal').style.display = "flex";
  }
  this.hideCheckModal = () => myModuleContainer.querySelector('#option-modal').style.display = "none";

  this.removeQuiz = () => {
    myModuleContainer.querySelector('.game-quiz-container').innerHTML = Practice.startQuizPage;
    myModuleContainer.querySelector('#user_name').value = (currentUserName) ? currentUserName : '';
  };

  this.showScoreModal = (result) => {     
    console.log(result);
    myModuleContainer.querySelector('.title-is-6').innerHTML = ` Your level: ${result.userdata.level} <br>
                                                                 Quiz context: ${result.userdata.context} <br>
                                                                 Quiz language: ${result.userdata.language} <br>
                                                                 Count of questions: ${result.userdata.countQuestions} <br>
                                                                 Correct answers: ${result.score} <br>`;
    
    
    let resultContainer =  myModuleContainer.querySelector('.quiz-finish-list');

    result.answers.forEach(answer => resultContainer.append(createRow(answer)));

    myModuleContainer.querySelector('#score-modal').style.display = 'block';
    myModuleContainer.querySelector('#score-modal').style.display = "flex";

    function createRow(answer) {
      let row = document.createElement('tr'),
          td1 = document.createElement('td'),
          td2 = document.createElement('td'),
          td3 = document.createElement('td');
          td4 = document.createElement('td');
      console.log(answer);
      
      td1.innerHTML = `<strong>${answer.question}</strong>`;
      td2.innerHTML = `${answer.cur}`;
      td3.innerHTML = `${answer.ok}`;  
      td4.innerHTML = (answer.result) ? `CORRECT` : 'BAD';      
      
      (answer.cur === answer.ok) ? row.classList.add('ok_answer') : row.classList.add('wrong_answer');
      row.appendChild(td1);
      row.appendChild(td2);
      row.appendChild(td3);
      row.appendChild(td4);

      return row;
  }
  }

  this.closeScoreModal = () => {
    myModuleContainer.querySelector('#score-modal').style.display = 'none';
    myModuleContainer.querySelector('.game-quiz-container').style.opacity = 1;
  }
  this.showWarning = () => myModuleContainer.querySelector('#username_input').querySelector('h2').classList.add('wrong-name');

  this.fadeOutQForm = (el) => {
    if (!el) el = myModuleContainer.querySelector('.game-quiz-container');
    el.style.opacity = 1;
      (function fade() {
          if ((el.style.opacity -= .1) < 0) {
              // el.style.display = 'none';
          } else {
              requestAnimationFrame(fade);
          }
      })();
  };


  this.printUser = function(userList) {
    let userListContainer = document.querySelector('.users-list');
    userListContainer.innerHTML = '';
    for (let user in userList) {
      userListContainer.appendChild(createRow(user, userList));
    }
    

    function createRow(user, userList) {
        let row = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td');
            
        row.setAttribute('data-id', user);
        td1.innerHTML = `<strong>${userList[user].username}</strong>`;
        td2.innerHTML = `${userList[user].email}`;
        td3.innerHTML = `<a href="#" class="delete-user-btn" title="удалить пользователя"> Delete user </a>`;
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);

        return row;
    }
  }

  this.showAddUserForm = (elem) => {
  }

  this.hideAddUserForm = (elem) => {
  }

  this.printQuizUsers = (userList) => {
    let userListContainer = document.querySelector('.quiz-list');
    userListContainer.innerHTML = '';
    for (let [key,value] of Object.entries(userList)) {
      userListContainer.appendChild(createRow(key,value));
    }
    

    function createRow(name, score) {
        let row = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td');
            
        row.setAttribute('data-id', name);
        td1.innerHTML = `<strong>${name}</strong>`;
        td2.innerHTML = `${score}`;
        td3.innerHTML = `<a href="#" class="delete-quiz-user-btn" title="delete user quiz info"> Delete info </a>`;
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);

        return row;
    }
  },

  this.printChallengeUsers = (userList) => {
    let userListContainer = document.querySelector('.challenge-list');
    userListContainer.innerHTML = '';
    for (let [key,value] of Object.entries(userList)) {
      userListContainer.appendChild(createRow(key,value));
    }
    function createRow(user, props) {
        let row = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td');
            td4 = document.createElement('td');
            
        row.setAttribute('data-id', user);
        td1.innerHTML = `<strong>${user}</strong>`;
        td2.innerHTML = `${props.score}`;
        td3.innerHTML = `${props.level}`;
        td4.innerHTML = `<a href="#" class="delete-challenge-user-btn" title="delete user challenge info"> Delete info </a>`;
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);

        return row;
    }
  }

  this.hideWarningInfo = () => myModuleContainer.querySelector('.warning-info').classList.add('unvisible');

};