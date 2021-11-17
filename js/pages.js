const HomePage = {
  id: "main",
  title: "Main_About Morse Code",
  render: (className = "container", ...rest) => {
    return `
    
      <section class="${className}">
      <div class="site-title">
        <h1>About Morse Code</h1>
      </div>
      <div class="content">
        
        <img src="https://placehold.it/700x250" alt="" class="" />
        
        <div id="info">
          <h1>Morse Code</h1>
          <p>Morse code is a method of communication that uses short tones (dits) and long tones (dahs) in various sequences to make letters, numbers, and special characters. 
          This tool will help beginners learn Morse code.</p>
          <h2>Dits and Dahs</h2>
          <p><span class="bold">Dit</span> (<span class="ditdah">.</span>) Short tones and the base unit length of Morse code communication.<br>
          <span class="bold">Dah</span> (<span class="ditdah">-</span>) Long tones, each the length of three dits.</p>
          <h2>Spacing</h2>
          <p>The spacing between dits and dahs matters in Morse code. Spacing of various lengths signify different things.<br>
          <span class="bold">Intra-character Spacing</span> 
          A letter in Morse code can be made up of multiple dits and dahs. The spaces between the dits and dahs that make up a single letter are each the length of one dit.
           E.g., three dits, each separated by one-dit-long spaces, is an "S".<br>
           <span class="bold">Inter-character Spacing</span> The space between consecutive letters is three dits long. 
           E.g., three dits, each separated by a three-dit-long spaces is "EEE". (<span class="ditdah">. . .</span>)
           <br>
           <span class="bold">Inter-word Spacing</span> The space between words is seven dits long. 
           E.g., three dits, each separated by seven-dit-long spaces (denoted by a forward slash in this example: <span class="ditdah">././.</span>), is "E E E". 
           </p>
           <h2>Page Description </h2>
           <h3>Explore page </h3>
           <p>On Explore page you can try to click on a button to hear the code according to the letter on this button. Also you can try encode and decode any character.
           Also you can try to tap Morse code into textareas by clicking TAP button. Available in English and Russian languages.</p>

           <h3>Practice page </h3>
           <p>There is a quiz which may help you to learn a Morse code. Available in English and Russian languages. Also you can choose writing or audio context and easy. medium or hard level.
           Choosing writing context you shoold choose a right code for a quessed character or word. Choosing audio context you shoold listen to the cose and choose a right character or word for it.
           </p>

           <h3>Challenge page </h3>
           <p>There is a challenge which has 6 levels. Every new level contains 6 new characters including characters of previous levels. 
           If you choose a right character this character become more green. Level will be completed when you give 4 right answers for each character.
           If you give 5 wrong answers challenge is over.</p>

           <h3>Information page </h3>
           <p>There is a short info about users and top 10 quiz and challenge results</p>
           
           </div>
      </div>
      </section>
    `;
  }
};

const LoginForm = {
  id: "Main",
  title: "Main",
  render: (className = "container", ...rest) => {
    return `    
    <!--<div class="content-container">
      <section class="forms-section">
      <h1 class="section-title"></h1>
      <div class="forms">
        <div class="form-wrapper is-active">
          <button type="button" class="switcher switcher-login">
            Login
            <span class="underline"></span>
          </button>
          <form class="form form-login">
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div class="input-block">
                <label for="login-email">E-mail</label>
                <input id="login-email" type="email" required>
              </div>
              <div class="input-block">
                <label for="login-password">Password</label>
                <input id="login-password" type="password" required>
              </div>
            </fieldset>
            <button type="submit" class="btn-login">Login</button>
          </form>
        </div>
        <div class="form-wrapper">
          <button type="button" class="switcher switcher-signup">
            Sign Up
            <span class="underline"></span>
          </button>
          <form class="form form-signup">
            <fieldset>
              <legend>Please, enter your email, password and password confirmation for sign up.</legend>
              <div class="input-block">
                <label for="signup-email">E-mail</label>
                <input id="signup-email" type="email" required>
              </div>
              <div class="input-block">
                <label for="signup-password">Password</label>
                <input id="signup-password" type="password" required>
              </div>
              <div class="input-block">
                <label for="signup-password-confirm">Confirm password</label>
                <input id="signup-password-confirm" type="password" required>
              </div>
            </fieldset>
            <button type="submit" class="btn-signup">Continue</button>
          </form>
        </div>
      </div>
    </section>
    </div>-->
    `;
  }
};

const Explore = {
  id: "explore",
  title: "Let's explore Morse Code",   
  
  render: (className = "container", contentContainer, ...rest) => {
    return `
            <div class="content-container">
              <section class="${className}">
                <h1>Explore Morse Code</h1>
                <div class="togglers">
                  <div class="form_toggle quiz_language">
                    <div class="form_toggle-item language latin">
                      <input id="fid-latin" type="radio" class="lang" name="language" value="eng" checked>
                      <label for="fid-latin">English</label>
                    </div>
                    <div class="form_toggle-item language cyrillic">
                      <input id="fid-cyrillic" type="radio" class="lang" name="language" value="ru">
                      <label for="fid-cyrillic">Russian</label>
                    </div>
                    <div class="form_toggle-item play-code">
                      <input id="fid-play" type="checkbox" class="play_checkbox" name="play_checkbox" value="play" checked>
                      <label for="fid-play" class="play_checkbox_lebel">Play when clicked</label> 
                    </div>
                    <div class="form_toggle-item transfer">
                      <input id="fid-transfer" type="checkbox" class="transfer_checkbox" name="transfer_checkbox" value="transfer" checked>
                      <label for="fid-transfer" class="transfer_checkbox_label">Transfer into textarea</label>
                    </div>

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
                    <button id="morse_button" class="flex-item tap morseButton">Tap Morse</button>                                        
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

              <h2>Choose language</h2>
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

                <!--<input type="number" class="num-questions">-->
              </div>

              <div class="next-button-container">
                  <button class='start-quiz-button'">Start quiz</button>
              </div>
  `,
  questionPageHard:`  
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

                    <div id="answer_quiz"  class="answer-quiz">
                      <h3 class="hard_quiz_caption"></h3>
                      <textarea rows="4" cols="50" name="text" class="answer-text-quiz"></textarea>
                    </div>  
  </div>

  <div class="next-button-container">
    <!--<button class='check-button'">Check Answer</button>-->
    <span>&nbsp;&nbsp;&nbsp;</spam>
    <button class='next-button'">Next Question</button>
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
                          <!--<p>Attempts : 10</p>
                          <p>Wrong Answers : <span id="wrong-answers"></span></p>
                          <p>Right Answers : <span id="right-answers"></span></p>
                          <p>Grade : <span id="grade-percentage"></span>%</p>
                          <p ><span id="remarks"></span></p>-->

                          <div id="quiz-result_finish">
                            <div class="columns">
                              <div class="column">
                                <div class="quiz_result-finish-list">
                                  <h4 class="title-is-4">Your result :</h4>
                                  <h5 class="title-is-6"></h5>
                                  <table class="table">
                                    <thead>
                                      <tr>
                                        <th>Question</th>
                                        <th>Your answer</th>
                                        <th>Correct answer</th> 
                                        <th>Result</th>  
                                      </tr>
                                    </thead>
                                    <tbody class="quiz-finish-list">
                                              
                                    </tbody>
                                  </table>
                                  <div class="modal-button-container">
                                      <button class="closeScoreModal">Finish Quiz</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

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


const Challenge = {
  id: "challenge",
  title: "Let's chalenge Morse Code",   
  challengePage:`
  
  `,
  render: (className = "container", contentContainer, ...rest) => {
    return `
            <div class="content-container">
              <section class="${className}">
                <!--<div class="form_toggle quiz_language">
                  <div class="form_toggle-item language latin">
                    <input id="fid-latin" type="radio" class="lang" name="language" value="eng" checked>
                    <label for="fid-latin">English</label>
                  </div>
                  <div class="form_toggle-item language cyrillic">
                    <input id="fid-cyrillic" type="radio" class="lang" name="language" value="ru">
                    <label for="fid-cyrillic">Russian</label>
                  </div>
                </div> -->

                <div class="btn-container">
                  <a href="" class="gradient-button start-challenge" id="start_challenge">Start challenge</a>  
                  <a href="" class="gradient-button stop-challenge disabled" id="stop_challenge">Stop challenge</a>                 
                </div>  
                <h4 id="caption_challenge">
                  In this game you should listen the code Morse. When a sound of a character is played, click on which character you think it is.
                  To complete a level you need to give four correct answer for each character of the current level. If you give 5 wrong answers challenge is over.
                </h4>              
                
                <div id="challenge">
                
                  <div id="challenge_question" class="unvisible">
                      <h2>Click on the image below to repeat the code guessed</h2>
                      <div id="question" class="unvisible">question</div>
                      <div id="play_question"><img src="./img/noise.svg" alt="play" class = "img_play play-question"></div>
                  </div>
                  <div id="challenge_lives" class="unvisible">
                    <div class="current-info">
                      <div class="current-level">
                        <span class="">Level: </span>
                        <span class="current-level-info"></span>	                      
                      </div>
                      <div class="current-score">
                        <span class="">Score: </span>
                        <span class="current-score-info">0</span>	                      
                      </div>
                    </div>
                    <div class="lives ">
                      <span class="active"></span>	
                      <span class="active"></span>    
                      <span class="active"></span>  
                      <span class="active"></span>    
                      <span class="active"></span>
                    </div>
                    <div class="current-result ">                         
                      <!--<span></span>-->
                    </div>
                  </div>
                  <div id="alphabet_challenge" class="alphabet_challenge unvisible"></div>
                </div> 
              </section>
            </div>  
               
            
            `;
  }
};

const Info = {
  id: "info",
  title: "App Info",
  addUserForm: "",
  render: (className = "container", ...rest) => {
    return `
    
      <section class="${className}">
        <h1>Information</h1>
        <h2 class="warning-info" style="color:red">Please log in to see info on this page</h2>
        <div id="users-list__container">
          <div class="columns">
            <div class="column">
                <div id="users_list">
                    <h4 class="title is-4">Список пользователей:</h4>
                    <table class="table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>E-mail</th>
                        <th> </th>                        
                      </tr>
                    </thead>
                    <tbody class="users-list">
                       
                    </tbody>
                  </table>
                  <!--<a href='#' class="add-user-btn" title="Add user"> Add user </a>-->
                  <div id="add_user" class="add-user">
                    <a href='#' class="add-user-btn" title="Add user"> Add user </a>                   
                  </div>
                </div>
            </div>
        </div>
      </div>


      <div id="quiz-results_container">
        <div class="columns">
          <div class="column">
            <div class="quiz_result-list">
              <h4 class="title is-4">Quiz best results:</h4>
              <table class="table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Score</th> 
                    <th> </th>                 
                  </tr>
                </thead>
                <tbody class="quiz-list">

                </tbody>
              </table>
              <!--<a href='#' class="delete-quiz-info-btn" title="Add user"> Delete Quiz Info </a>-->
            </div>
          </div>
      </div>
    </div>

    <div id="challenge-results_container">
    <div class="columns">
      <div class="column">
        <div class="challenge_result-list">
          <h4 class="title is-4">Challenge best results:</h4>
          <table class="table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Scores</th>
              <th>Levels</th>
              <th> </th>               
            </tr>
          </thead>
          <tbody class="challenge-list">
              
          </tbody>
            </table>
          </div>
      </div>
  </div>
</div>

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


