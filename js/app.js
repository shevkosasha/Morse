
const components = {
  header: Header,
  navbar: NavBar,
  content: Content,
};

const routes = {
  main: HomePage,
  login: LoginForm,
  explore: Explore,
  practice: Practice,
  info: Info,
  challenge: Challenge,
  default: HomePage,
  error: ErrorPage,
};

const mySPA = (function(){   
    return {
        init: function({container, routes, components}) {
            this.renderComponents(container, components);

            const view = new ModuleView();
            const model = new ModuleModel();
            const controller = new ModuleController();

            //связываем части модуля
            view.init(document.getElementById(container), routes);
            model.init(view);
            controller.init(document.getElementById(container), model);     
        },

        renderComponents: function (container, components) {
            const root = document.getElementById(container);
            const componentsList = Object.keys(components);
            for (let item of componentsList) {
            root.innerHTML += components[item].render("component");
            }
        },
    };

}());
    
    // *** --- init module --- ***/
    document.addEventListener("DOMContentLoaded", mySPA.init({
      container: "spa",
      routes: routes,
      components: components
    }));
    

 