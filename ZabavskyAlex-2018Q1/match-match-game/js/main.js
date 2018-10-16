class Game{
	constructor(typeCard, typeDifficul, firstName, lastName, email){
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.card = typeCard;
		this.difficul = typeDifficul;
		this.count_div = this.countDivCard();
		this.stack_element = [];
		this.time_game = '';
		this.timer_start = '';
	}

	timerStart(){

		let timer,
			that = this;

		return function (){
			if (timer) clearInterval(timer);
			else{
				let time_game = 0;
			    document.getElementById('timer').innerHTML = `Time: ${time_game} s`;
			    timer = setInterval(() => {
			         	time_game++;
			         	document.getElementById('timer').innerHTML = `Time: ${this.convertTime(time_game)}`;
			         	that.time_game = time_game;			         	
			        }
			    ,1000);
			}
		}
	 }

	convertTime(time_game){
		if(time_game < 60)
			return `${time_game} s`;
		else if(time_game < 3600){
       		let tM = Math.floor(time_game / 60),
       			tS = time_game - tM * 60;
       		return `${tM} m ${tS} s`;	
		}
		else {
       		let tH = Math.floor(time_game / 3600),
       			tM = Math.floor((time_game - th * 3600) / 60 ),
       			tS = time_game -tH *3600 - tM * 60;
       		return `${th} h ${tM} m ${tS} s`;	
		}
	}

	countDivCard(){

		let count_div;

		if(this.difficul === "level_low")
			count_div = 10;
		else if (this.difficul === "level_medium")
			count_div = 18;
		else
			count_div = 24;

		return count_div;
	}

	start(){
		this.clearDocument();
		this.addElementDocument();
	}

	finish(){

		this.timer_start();

		let content = document.getElementById('content'),
			time_game = this.time_game, 
			element_info_won = document.createElement('div');

		content.innerHTML = '';
		content.classList.add('congratulations');

		element_info_won.appendChild(document.createTextNode('Congratulations, you won!'));
		element_info_won.appendChild(document.createElement('br'));
		element_info_won.appendChild(document.createTextNode(`Your time: ${this.convertTime(time_game)}`));
		element_info_won.appendChild(document.createElement('br'));
		element_info_won.appendChild(document.createElement('br'));

		content.appendChild(element_info_won);

		this.saveResult(time_game);
		this.addTableRecord();
	}

	saveResult(time_game){
		let heroResult = window.localStorage['gameResult'];

        if(heroResult){
            heroResult = JSON.parse(window.localStorage['gameResult']);
            heroResult.push({firstName:this.firstName, lastName:this.lastName, email:this.email, timeGame:time_game});

            heroResult.sort((heroA, heroB) =>{
                return heroA.timeGame - heroB.timeGame;
            });

            heroResult.splice(10, heroResult.length);
            window.localStorage['gameResult'] = JSON.stringify(heroResult);
        }
        else
            window.localStorage['gameResult'] = JSON.stringify([{firstName:this.firstName, lastName:this.lastName, email:this.email, timeGame:time_game}]);
	}

	addTableRecord(){
		let content = document.getElementById('content'),
			table = document.createElement('table'),
			storage = JSON.parse(window.localStorage['gameResult']);

		table.classList.add('congratulations_table');


		let tr = document.createElement('tr'),
				tdh_time = document.createElement('th'),
				tdh_name = document.createElement('th'),
				caption = document.createElement('caption'),
				that = this;

		tdh_time.appendChild(document.createTextNode('Time: s'));
		tdh_name.appendChild(document.createTextNode('Name'));
		caption.appendChild(document.createTextNode('Highscore table'));
		
		tr.appendChild(tdh_name);
		tr.appendChild(tdh_time);
		
		table.appendChild(caption);
		table.appendChild(tr);

		storage.forEach(function(value){
			let tr = document.createElement('tr'),
				td_time = document.createElement('td'),
				td_name = document.createElement('td');

			td_name.appendChild(document.createTextNode(value['firstName']));
			td_time.appendChild(document.createTextNode(value['timeGame']));

			tr.appendChild(td_name);
			tr.appendChild(td_time);

			table.appendChild(tr);
		})

		content.appendChild(table);
	}

	randomElement(){
		let array_random = [],
			count_true = this.count_div / 2,
			count_false = this.count_div / 2;

		if(count_true % 2 !== 0){
			count_true++;
			count_false--;
		}

		while(count_true || count_false ){

			let random_num = Math.floor(Math.random() * (1 - 0 + 1));

			if(random_num === 0 && count_false > 0){
				array_random.push(random_num);
				count_false--;
			}
			else if(random_num === 1 && count_true > 0){
				array_random.push(random_num);
				count_true--;
			}
		}
		return array_random;
	}

	addElementDocument(){
		let parent = document.getElementById('content'),
			array_random = this.randomElement();

		let timer = document.createElement('div');
		timer.id = 'timer';
		timer.classList.add('timer');
		parent.parentElement.appendChild(timer);
		this.timer_start = this.timerStart();
		this.timer_start();
		 

		for(let i = 0; i < this.count_div; i++){

			let flip_container = document.createElement('div'),
				flipper = document.createElement('div'),
				front = document.createElement('div'),
				back = document.createElement('div');

			front.classList.add('front');
			front.classList.add(this.difficul);

			front.id = i + 1;

			back.classList.add('back');
			back.classList.add('display_none');
			back.classList.add(this.difficul);			
			back.classList.add(this.card);

			if(array_random[i] === 1)
				back.classList.add('mirror_reflection');

			flipper.classList.add('flipper');

			flip_container.classList.add('flip-container');
			flip_container.classList.add(this.difficul);

			

			flipper.appendChild(front);
			flipper.appendChild(back);

			flip_container.appendChild(flipper);
			parent.appendChild(flip_container);

			setTimeout(() => back.classList.remove('display_none'), 1000);
		}
		parent.addEventListener("click", (e) => {

			if(!(e.target.classList.contains('front') || e.target.classList.contains('back')))
				return;

			let element_front = e.target.id ? document.getElementById(e.target.id): e.target.parentElement.querySelector('div:first-child'),
				element_back = e.target.id ? element_front.parentElement.querySelector('div:last-child'): e.target,
				that = this,
				element_rotate,
				element_delete;

			element_rotate = function(){

				element_front.parentElement.classList.remove('open_back');

				that.stack_element.map(function(value, index, array){
										if(value[0] === element_front.id) array.splice(index, 1);
									});			
			}

			element_delete = function(array){

				for(let i = 0; i < array.length; i++){
					let del_element = document.getElementById(`${array[i][0]}`);
					del_element.parentElement.parentElement.removeChild(del_element.parentElement);
					that.count_div--;
				}

				if(that.count_div === 0)
					that.finish();				
			}

			element_front.parentElement.classList.add('open_back');

			this.stack_element.push([element_front.id, (element_back.classList.contains('mirror_reflection') ? true : false)]);

			if(this.stack_element.length > 1){

				let len = this.stack_element.length; 

				if(this.stack_element[len - 2][1] === this.stack_element[len - 1][1] && this.stack_element[len - 2][0] !== this.stack_element[len - 1][0]){

					let array = [this.stack_element[len - 2], this.stack_element[len - 1]];
					setTimeout(element_delete, 3000, array);
					this.stack_element = [];
				}
				else
					this.stack_element.shift();				

			}
			setTimeout(element_rotate, 2000);

		},false);
	}

	clearDocument(){
		document.getElementById('content').innerHTML = '';
		document.getElementById('settings').innerHTML = '';
		let modal_wind = document.getElementById('modal_start_game');
		modal_wind.style.top = "-100%";
		document.getElementById('btn_new_game').setAttribute('onclick','parent.location="javascript:location.reload()"');
	}

	static startCheck(){
		let card_type =	document.querySelector('input[name="card_type"]:checked'),
			difficult_type = document.querySelector('input[name="difficult_type"]:checked');
		if(card_type && difficult_type){
			let modal_wind = document.getElementById('modal_start_game');
			modal_wind.style.top = "15%";
		}
		else
			alert('Please make a choice cards and difficult game');
	}

	static closeModalStartGame(){
		let modal_wind = document.getElementById('modal_start_game');
		modal_wind.style.top = "-100%";
	}

	static startGame(){
		let form_start_game = document.getElementById("form_start_game");
		if(form_start_game.checkValidity()){

				let card = document.querySelector('input[name="card_type"]:checked').className, 
					difficul = document.querySelector('input[name="difficult_type"]:checked').className, 
					firstName = form_start_game.elements[0].value, 
					lastName = form_start_game.elements[1].value, 
					email = form_start_game.elements[2].value;

				let game = new Game(card, difficul, firstName, lastName, email);
				game.start();
		}
	}
}
