const Header = {
  render: (customClass = "") => {
    return `
      
      
    `;
  }
};

const NavBar = {
  render: (customClass = "") => {
    return `
    <nav class="mainmenu ${customClass}" id="mainmenu">
      <input type="checkbox" id="menu-toggle" />
      <label for="menu-toggle" class="menu-icon"><i class="fa fa-bars"></i></label>     
        <div id="mainmenu" class="slideout-sidebar ">
          <ul>
          <li><a class="mainmenu__link" href="#main">Главная</a></li>
          <!--<li><a class="mainmenu__link" href="#about">About Morse Code</a></li>-->
          <li><a class="mainmenu__link" href="#explore">Explore Morse Code</a></li>
          <li><a class="mainmenu__link" href="#practice">Practice Morse Code</a></li>
          <li><a class="mainmenu__link" href="#challenge">Challenge Morse Code</a></li>
          <li><a class="mainmenu__link" href="#results">Table of results</a></li>
          <li><a class="mainmenu__link" href="#registration">Registration</a></li>
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
