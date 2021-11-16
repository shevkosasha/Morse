const Header = {
  render: (customClass = "") => {
    return `
    <div class="log-and-hi">
      <button class="log-in" style="width:auto;">Log in</button>
      <div class="hi-section">Hi user</div>
    </div>  


    <div class="login-page">      
      <div id="login_forms" class="form ">
        <div class="close-container">
          <span  class="close-login" title="Close Modal">×</span>
        </div>
        <form class="register-form unvisible">
          <input id="signup-name"type="text" placeholder="name"/>
          <input id="signup-email" type="text" placeholder="email address"/>
          <input id="signup-password" type="password" placeholder="password"/>          
          <button class="btn-create-user">create</button>
          <p class="message">Already registered? <a class="switcher" href="#">Sign In</a></p>
        </form>
        <form class="login-form visible">
          <input id="login-email" type="text" placeholder="useremail"/>
          <input id="login-password" type="password" placeholder="password"/>
          <button class="btn-login-user">Login</button>
          <p class="message">Not registered? <a class="switcher" href="#">Create an account</a></p>
        </form>
      </div>
    </div>  
    `;
  }
};

const NavBar = {
  render: (customClass = "") => {
    return `
    <nav class="mainmenu ${customClass}" id="mainmenu">
      <input type="checkbox" id="menu-toggle" checked/>
      <label for="menu-toggle" class="menu-icon"><i class="fa fa-bars"></i></label>     
        <div id="mainmenu" class="slideout-sidebar ">
          <ul>
          <li><a class="mainmenu__link" href="#main">About Morse Code</a></li>
          <li><a class="mainmenu__link" href="#explore">Explore Morse Code</a></li>
          <li><a class="mainmenu__link" href="#practice">Practice Morse Code</a></li>
          <li><a class="mainmenu__link" href="#challenge">Challenge Morse Code</a></li>
          <li><a class="mainmenu__link" href="#info">Information</a></li>
          </ul>
        </div>
        </nav>
        
      
    `;
  }
};

const Content = {
  render: (customClass = "") => {
    return `
    <div class="content ${customClass}" id="content"></div>
    <div class="scrollup">
      <!-- Иконка fa-chevron-up (Font Awesome) -->
      <i class="fa fa-chevron-up"></i>
    </div>`;
  }
};

const Footer = {
  render: (customClass = "") => {
    return `<footer class="footer ${customClass}">
      <p>&copy; 2021 </p>
    </footer>`;
  }
};

{/* <header class="header ${customClass}" id="header">
        <a href="#main">Learn Morse Code</a>
      </header> */}
