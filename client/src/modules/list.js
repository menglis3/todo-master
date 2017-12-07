import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {ToDos} from '../resources/data/todos';

    
    @inject(Router, AuthService, ToDos)
    export class List {
      constructor(router, auth, todos) {
        this.router = router;
        this.todos=todos;
        this.auth=auth;
        this.message = 'List';
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.showList = true;
        this.title = "Mouang has things to do!"
        this.editTodoForm = false;
        this.showCompleted = false;
        this.priorities = ['Low', 'Medium', 'High', 'Critical'];
      
      }
    
      async activate(){
        await this.todos.getUserTodos(this.user._id);
    }

      createTodo(){ 
        this.todoObj = {
            todo: "",
            description: "",
            dateDue: new Date(),
             userId: this.user._id,
            priority: this.priorities[0]
        }
        this.showList = false;      
    }

    async saveTodo(){
        if(this.todoObj){       
            let response = await this.todos.save(this.todoObj);
            if(response.error){
                alert("There was an error creating the ToDo");
            } else {
                                         
            }
            this.showList = true;
        }
    }
    
  

    logout(){
          this.router.navigate('home');
      }
    

    logout(){
        sessionStorage.removeItem('user');
        this.auth.logout();
    }
}
