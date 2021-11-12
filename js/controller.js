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
    this.addListeners();
    // this.addMenuCloseHandler();
    update();
  },

  
  this.updateState = function(page) {        
    myModuleModel.updateState(page);        
  },   

  this.addListeners = function(){
    // console.log(page); 

    // if (page === 'results') myModuleModel.printUsersList(); 

    let toTopBtn = myModuleContainer.querySelector('.scrollup');
    window.addEventListener('scroll', (e) => myModuleModel.showToTopBtn()) ;    
    toTopBtn.addEventListener('click', () => myModuleModel.toTop());


    
    /*myModuleContainer.querySelector('.content')*/
    window.addEventListener('click', (e) => {
      // console.log(e.target);

      /////*****   EXPLORE PAGE LISTENERS *****/////
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
      // clear button handler
      if (e.target.classList.contains('clear')) {
        e.preventDefault();
        myModuleModel.clearInput(myModuleContainer.querySelector('.code-word'), myModuleContainer.querySelector('.decode-morse'));
      };
      // play button handler
      if (e.target.classList.contains('play')){
        e.preventDefault();
        let inner = myModuleContainer.querySelector('.decode-morse').value;
        myModuleModel.playMorse(inner,true);
      }
      // language button handler
      if (e.target.classList.contains('lang')){
        myModuleModel.setLanguage(e.target.value);
      }
      // textarea's handlers
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
        console.log('sign up');
        myModuleModel.switchForm(e.target);
      }
     
      // btn-login, btn-signup
      if (e.target.classList.contains('btn-login-user')) {
        e.preventDefault();
        e.stopPropagation();
        myModuleModel.login(
            document.querySelector("#login-email").value,
            document.querySelector("#login-password").value,
        );
      }

      if (e.target.classList.contains('btn-create-user')) {
        e.preventDefault();
        e.stopPropagation();
        myModuleModel.createUser(
          document.querySelector("#signup-name").value,
            document.querySelector("#signup-email").value,
            document.querySelector("#signup-password").value,            
        );
      }

      // if (e.target.classList.contains('close-login')) {
      //   // e.preventDefault();
      //   // e.stopPropagation();
      //   console.log('log out');
      //   myModuleModel.logout(); log-out
      // }

      if (e.target.classList.contains('log-in')) {
        console.log('log in');
        myModuleModel.showLoginForm();
      }

      if (e.target.classList.contains('close-login')) {
        console.log('log in');
        myModuleModel.closeLoginForm();
      }

      if (e.target.classList.contains('log-out')) {
        console.log('log out');
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