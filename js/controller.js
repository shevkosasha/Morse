function ModuleController (){
  let myModuleContainer = null;
  let myModuleModel = null;
  let isQuizHandlerAdded = false;
  let hashPageName;

  this.init = function(container, model) {
    myModuleContainer = container;
    myModuleModel = model;

    const update = () => {
      // debugger;
      if (myModuleContainer.querySelector('main')) {          
        myModuleContainer.querySelector('main').removeEventListener('click',this.quizHandler);
        isQuizHandlerAdded = false;
        myModuleModel.stopQuiz();
      }
      hashPageName = location.hash.slice(1).toLowerCase();
      this.updateState(hashPageName); //первая отрисовка
    }

    window.addEventListener("hashchange", update);
    this.addListeners();
    update();
  },

  
  this.updateState = function(page) { 
    myModuleModel.updateState(page);
  },   

  this.addListeners = function(){

    // if (page === 'results') myModuleModel.printUsersList(); 

    let toTopBtn = myModuleContainer.querySelector('.scrollup');
    window.addEventListener('scroll', (e) => myModuleModel.showToTopBtn()) ;    
    toTopBtn.addEventListener('click', () => myModuleModel.toTop());

    window.addEventListener('mousedown',(e) => {
      if (e.target.id === 'morse_button'){
        myModuleModel.handleMorseTapStart();
      }
    });

    // window.addEventListener('mouseout',(e) => {
    //   if (e.target.id === 'morse_button'){
    //     myModuleModel.handleMorseTapEnd();
    //   }
    // });
    
    window.addEventListener('mouseup',(e) => {
      if (e.target.id === 'morse_button'){
        myModuleModel.handleMorseTapEnd();
      }
    });
    
    


    
    /*myModuleContainer.querySelector('.content')*/
    window.addEventListener('click', (e) => {
      // console.log(e.target);

      /////*****   EXPLORE PAGE LISTENERS *****/////
      if (e.target.classList.contains('alphabet-button') || 
          e.target.classList.contains('morse') || 
          e.target.classList.contains('alpha')) {
        let morse;
        let char;
        let checked = myModuleContainer.querySelector('.play_checkbox').checked; 

        switch (e.target.className) {                        
            case 'morse': 
              morse = e.target.innerHTML; 
              char = e.target.parentNode.querySelector('.alpha').innerHTML;
              break;
            case 'alpha':
              morse = e.target.parentNode.querySelector('.morse').innerHTML; 
              char = e.target.innerHTML;
              break;
            case 'alphabet-button': 
              morse = e.target.querySelector('.morse').innerHTML; 
              char = e.target.querySelector('.alpha').innerHTML;
              break;            
        }
        myModuleModel.playMorse(morse,checked); 
        myModuleModel.sendToTArea(char, myModuleContainer.querySelector('#code_word'), myModuleContainer.querySelector('#decode_morse'));          
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
          let value =  myModuleContainer.querySelector('.decode-morse').value.match(/\.|\s|-/g); 
          if (value) {
            value = value.join('');
            myModuleModel.decodeMorse(value, myModuleContainer.querySelector('#code_word'));
          }              
        }
        myModuleContainer.querySelector('.decode-morse').addEventListener('input', inputHandler);
        myModuleContainer.querySelector('.decode-morse').addEventListener('blur', (e) => {
          myModuleContainer.querySelector('.decode-morse').removeEventListener('input', inputHandler);
        });
      }

      if (e.target.classList.contains('transfer_checkbox')) {          
        myModuleModel.switchTransfer(e.target.checked);
      }

      if (e.target.classList.contains('play_checkbox')) {          
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
          if (!isQuizHandlerAdded) { myModuleContainer.querySelector('main').addEventListener('click',this.quizHandler); }
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
        } else if (e.target.classList.contains('disabled') || e.target.classList.contains('right')){
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
            hashPageName
        );
      }

      if (e.target.classList.contains('btn-create-user')) {
        e.preventDefault();
        e.stopPropagation();
        myModuleModel.createUser(
            document.querySelector("#signup-name").value,
            document.querySelector("#signup-email").value,
            document.querySelector("#signup-password").value, 
            hashPageName
        );
      }

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

       /////*****   INFO PAGE LISTENERS *****/////
      if (e.target.classList.contains('delete-user-btn')) {
        e.preventDefault();
        e.stopPropagation();
        myModuleModel.deleteUser(e.target.parentElement.parentElement.dataset.id);
      }

      if (e.target.classList.contains('add-user-btn')) {
        e.preventDefault();
        e.stopPropagation(); 
        myModuleModel.showAddUserForm(e.target);
      }
      // add-user-btn-form
      if (e.target.classList.contains('add-user-btn-form')) {
        e.preventDefault();
        e.stopPropagation();   
        console.log(e.target);
        let name = e.target.parentElement.querySelector('#add_user-name').value;
        let email = e.target.parentElement.querySelector('#add_user-email').value;
        myModuleModel.addUser(name,email);    
        myModuleModel.hideAddUserForm(e.target);        
      }  
      
      if (e.target.classList.contains('delete-quiz-user-btn')) {
        debugger;
        e.preventDefault();
        e.stopPropagation();
        myModuleModel.deleteUserQuizInfo(e.target.parentElement.parentElement.dataset.id);
      }

      
      if (e.target.classList.contains('delete-challenge-user-btn')) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.target.parentElement.parentElement.dataset.id);
        myModuleModel.deleteUserChallengeInfo(e.target.parentElement.parentElement.dataset.id);
      }

    });       
    
  },

  this.quizHandler = (e) => {
    isQuizHandlerAdded = true;
    e.preventDefault();
    e.stopPropagation();

    let parentDiv = myModuleContainer.querySelector('.game-options-container'); 
    let selectedOption = parentDiv.querySelector('.selected');
    let textOption = parentDiv.querySelector('.answer-text-quiz');
    
    if (e.target.className === 'next-button'){
      if (selectedOption || textOption){ 
        let elem = (selectedOption) ? 'option' : 'text';  
        let currentAnswer = (selectedOption) ? selectedOption.querySelector('label').textContent : textOption.value;
        if (currentAnswer) {
          myModuleModel.checkAnswer(currentAnswer,elem);
        }  else {
          console.log('nothing typed'); // для сложного уровня: если ничего не напечатано, то показываем модалку
          myModuleModel.showCheckModal();
        }
      } else {
        console.log('nothing selected'); // если ничего не выбрано, показываем модалку
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
      isQuizHandlerAdded = false;
      myModuleModel.stopQuiz();
      if (e.target.className == 'closeScoreModal') {
        myModuleModel.closeScoreModal();
      }       
    }

  } 

}