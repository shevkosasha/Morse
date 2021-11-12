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
    // this.showLoginForm();
    this.updateButtons(routesObj[routeName].id);
  },

  this.showLoginForm = () => document.querySelector('.login-page').classList.add('visible');

  this.closeLoginForm = () => {
    document.querySelector('.login-page').classList.remove('visible');
    let inputs = document.querySelector('.login-page').querySelectorAll('input');
    inputs.forEach(element => {element.value = '';});
  }

  this.sayHi = (user) => {
    myModuleContainer.querySelector('.hi-section').textContent = `Hi ${user}`;
    document.querySelector('.log-in').textContent = 'Log out';
    document.querySelector('.log-in').classList.replace('log-in','log-out');
  }

  this.logOut = () => {
    document.querySelector('.hi-section').textContent = 'Bye';
    document.querySelector('.log-out').textContent = 'Log in';
    document.querySelector('.log-out').classList.replace('log-out','log-in');
  }

  this.logIn = () => {
    // document.querySelector('.hi-section').textContent = 'Hi';
    // document.querySelector('.log-in').textContent = 'Log out';
    // document.querySelector('.log-out').classList.replace('log-in','log-out');
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