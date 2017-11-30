import {inject} from 'aurelia-framework'; //import modules into home object
import {Router} from 'aurelia-router'; //The router we configured

@inject(Router)
export class List {
	constructor(){
        this.router = router;

        this.message = "List";
    }
    
    logout(){
        this.router.navigate('home');
    }
}

