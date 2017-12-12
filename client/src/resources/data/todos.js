import {inject} from 'aurelia-framework';
import {DataServices} from './data-services';

@inject(DataServices)
export class ToDos {

	constructor(data) {
        		this.data = data;
        		this.TODO_SERVICE = 'todos';
   		 }

    async save(todo) {
        if (todo) {
            let response = await this.data.post(todo, this.TODOS_SERVICE + "/" + todo._id);
            return response;
        }
    }
}
