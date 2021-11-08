const HomePage = {
  id: "main",
  title: "Главная страница примера SPA",
  render: (className = "container", ...rest) => {
    return `
    
      <section class="${className}">
        <h1>Главная</h1>
        <p>Здесь будет контент <strong>Главной</strong> страницы.</p>
      </section>
    `;
  }
};

const About = {
  id: "about",
  title: "About Morse Code",
  render: (className = "container", ...rest) => {
    return `
    
    <div class="content-container">
      <div class="site-title">
        <h1>About Morse Code</h1>
      </div>
      <div class="content">
        <h1>It's the best code ever</h1>
        <img src="https://placehold.it/700x250" alt="" class="" />
        <p>Morse code is a method of communication that uses short tones (dits) and long tones (dahs) in various sequences to make letters, numbers, and special characters. This tool will help beginners learn Morse code.</p>
      </div>
    </div>
    `;
  }
};

const Explore = {
  id: "explore",
  title: "Let's explore Morse Code",   
  // decodeInputs: `  
                                   
  //             <div id="wrap_tArea" class="flex-container">
  //               <div id="word"  class="flex-item">
  //                 <h3>Type text in <span id="current_language">English</span> language</h3>
  //                 <textarea rows="10" cols="45" name="text" id="code_word" class="code-word"></textarea>
  //               </div>  
  //               <div id="morse" class="flex-item">
  //                 <h3>Type morse code</h3>
  //                 <textarea rows="10" cols="45" name="text" id="decode_morse" class="decode-morse"></textarea>
  //               </div>               
  //             </div>

  //             <div class="flex-container buttons">
  //               <button class="flex-item clear">Clear</button>
  //               <button class="flex-item play">Play</button>                              
  //             </div>
              
               
  //               `
  // ,
  render: (className = "container", contentContainer, ...rest) => {
    return `
            <div class="content-container">
              <section class="${className}">
                <h1>Explore Morse Code</h1>
                <div class="form_toggle quiz_language">
                  <div class="form_toggle-item language latin">
                    <input id="fid-latin" type="radio" class="lang" name="language" value="eng" checked>
                    <label for="fid-latin">English</label>
                  </div>
                  <div class="form_toggle-item language cyrillic">
                    <input id="fid-cyrillic" type="radio" class="lang" name="language" value="ru">
                    <label for="fid-cyrillic">Russian</label>
                  </div>
                </div>
                <div class="alphabet"></div>

                <section class="decode_inputs">
                  <div id="wrap_tArea" class="flex-container">
                    <div id="word"  class="flex-item">
                      <h3>Type text in <span id="current_language">English</span> language</h3>
                      <textarea rows="10" cols="45" name="text" id="code_word" class="code-word"></textarea>
                    </div>  
                    <div id="morse" class="flex-item">
                      <h3>Type morse code</h3>
                      <textarea rows="10" cols="45" name="text" id="decode_morse" class="decode-morse"></textarea>
                    </div>               
                  </div>

                  <div class="flex-container buttons">
                    <button class="flex-item clear morseButton">Clear Fields</button>
                    <button class="flex-item play morseButton">Play Morse</button>
                    <button id="morse_Button" class="flex-item tap morseButton">Tap Morse</button>                                        
                  </div>                  
                </section>   

              </section>              
              
            </div>  
            `;
  }
};

const Practice = {
  id: "practice",
  title: "Let's practice Morse Code",
  startQuizPage: `    
              <div id="username_input">
                <h2>Type your name</h2>
                <input type="text" id="user_name" name="user">
                <label for="user_name"><!--<p class='wrong-name'>type your name</p>--></label>                
              </div>

              <h2>Choose alphabet</h2>
              <div class="form_toggle quiz_language">
                <div class="form_toggle-item language latin">
                  <input id="fid-latin" type="radio" name="language" value="eng" checked>
                  <label for="fid-latin">English</label>
                </div>
                <div class="form_toggle-item language cyrillic">
                  <input id="fid-cyrillic" type="radio" name="language" value="ru">
                  <label for="fid-cyrillic">Russian</label>
                </div>
              </div>

              <h2>Choose quiz context</h2>
              <div class="form_toggle quiz_context">               
                <div class="form_toggle-item writing context">
                  <input id="fid-writing" type="radio" name="context" value="writing" checked>
                  <label for="fid-writing">Writing quiz</label>
                </div>
                <div class="form_toggle-item audio context">
                  <input id="fid-audio" type="radio" name="context" value="audio">
                  <label for="fid-audio">Audio quiz</label>
                </div>
              </div>

              <h2>Choose quiz level</h2>
              <div class="form_toggle levels">                
                <div class="form_toggle-item easy level">
                  <input id="fid-level1" type="radio" name="level" value="easy" checked>
                  <label for="fid-level1">Easy</label>
                </div>
                <div class="form_toggle-item medium level">
                  <input id="fid-level2" type="radio" name="level" value="medium">
                  <label for="fid-level2">Medium</label>
                </div>
                <div class="form_toggle-item hard level">
                  <input id="fid-level3" type="radio" name="level" value="hard">
                  <label for="fid-level3">Hard</label>
                </div>
              </div>

              <div class="next-button-container">
                  <button class='start-quiz-button'">Start quiz</button>
              </div>
  `,
  questionPage:`  
              <div class="game-details-container">
                <h1>Score : <span id="player-score"></span> / <span class="how-many-questions"></span></h1>
                <h1> Question : <span id="question-number"></span> / <span class="how-many-questions"></span></h1>
                <!--<h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>-->
                <h2 class="close-btn">&nbsp;&times;&nbsp;</h2> 
              </div>
              <h4>Pick a right option for</h4>
              <div class="game-question-container">
                <img src="./img/noise.svg" alt="play" class = "img_play question" style ="display: none;">
                
                <div><h1 id="display-question"> </h1></div>
              </div>

              <div class="game-options-container">
              <div class="modal-container" id="option-modal">
                <div class="modal-content-container">
                  <h1>Please Pick An Option</h1>
                  <div class="modal-button-container">
                      <button class="close-checkModal-button">Continue</button>
                  </div>
                </div>
              </div>

              <span class="options">
                <img src="./img/noise.svg" alt="play" class = "img_play answer">
                <!--<input type="radio" id="option-one" name="option" class="radio" value="optionA" />-->
                <label for="option-one" class="option" id="option-one-label"></label>
              </span>


              <span class="options">
                <img src="./img/noise.svg" alt="play" class = "img_play answer">
                <input type="radio" id="option-two" name="option" class="radio" value="optionB" />
                <label for="option-two" class="option" id="option-two-label"></label>
              </span>


              <span class="options">
                <img src="./img/noise.svg" alt="play" class = "img_play answer">
                <input type="radio" id="option-three" name="option" class="radio" value="optionC" />
                <label for="option-three" class="option" id="option-three-label"></label>
              </span>


              <span class="options">
                <img src="./img/noise.svg" alt="play" class = "img_play answer">
                <input type="radio" id="option-four" name="option" class="radio" value="optionD" />
                <label for="option-four" class="option" id="option-four-label"></label>
              </span>
              </div>

              <div class="next-button-container">
                <button class='check-button'">Check Answer</button>
                <span>&nbsp;&nbsp;&nbsp;</spam>
                <button class='next-button'">Next Question</button>
              </div>
  `,
  showQuestion: (className = "container", ...rest) =>{
   
  },
  render: (className = "container", ...rest) => {
    return `
    <div class="content-container">
      <section class="${className}">      
        <h1>Let's practice Morse Code</h1>
        <!--<h2>Morse Code quiz</h2>-->
        <div id="choose_quiz_option">        
          <!--<button class="writing-quiz">Morse Code Character & Letter quiz</button><br><br>-->
          <!--<button class="audio-quiz">Audio Quiz&nbsp;&nbsp;&nbsp;></button><br>-->
        </div>
        <!-- ***** -->  
        <main id='quiz'>
              <!-- creating a modal for when quiz ends -->
              <div class="modal-container" id="score-modal">

                  <div class="modal-content-container">

                      <h1>Congratulations, Quiz Completed.</h1>

                      <div class="grade-details">
                          <p>Attempts : 10</p>
                          <p>Wrong Answers : <span id="wrong-answers"></span></p>
                          <p>Right Answers : <span id="right-answers"></span></p>
                          <p>Grade : <span id="grade-percentage"></span>%</p>
                          <p ><span id="remarks"></span></p>
                      </div>

                      <div class="modal-button-container">
                          <button class="closeScoreModal">Finish Quiz</button>
                      </div>

                  </div>
              </div>
      <!-- end of modal of quiz details-->

              <div class="game-quiz-container">           

              </div>
          </main>
          <!-- ***** -->     
      </section>
    </div>
     
    `;
  }
};

const Results = {
  id: "results",
  title: "Table of results",
  render: (className = "container", ...rest) => {
    return `
    
      <section class="${className}">
        <h1>Results</h1>
        <div id="users-list__container">
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
      </div>
      </section>
      
    `;
  }
};

const Contacts = {
  id: "contacts",
  title: "Ну и страница Контакты, как без нее?",
  render: (className = "container", ...rest) => {
    return `
    
      <section class="${className}">
        <h1>Контакты</h1>
        <p>Ну а тут классически будет страница <strong>Контакты</strong>.</p>
      </section>
    `;
  }
};

const ErrorPage = {
  id: "error",
  title: "Achtung, warning, kujdes, attenzione, pozornost...",
  render: (className = "container", ...rest) => {
    return `
    
      <section class="${className}">
        <h1>Ошибка 404</h1>
        <p>Страница не найдена, попробуйте вернуться на <a href="#main">главную</a>.</p>
      </section>
    `;
  }
};


