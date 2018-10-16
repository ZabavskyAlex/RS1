let page_current = 1,
    caption_text = 'Caption',
	paragraph_text = ['help 1',
					  'help 2',
					  'help 3',
					  'help 4',
					  'help 5',
					  'help 6'],
    page_len = paragraph_text.length;

(function open(){

	let status = window.localStorage.getItem('display'),
		tips = document.getElementById('tips'),
		tips_content = document.getElementById('tips-content');

	if(status !== 'false'){

		let last_span =document.querySelector('#nav-page > span:last-child');

		for(let i = 0; i < page_len; i++ ){
			let new_nav_div = document.createElement('div');
			new_nav_div.classList.add('page');
			new_nav_div.id = `page-${i + 1}`;
			last_span.parentNode.insertBefore(new_nav_div, last_span);
		}

		addTextNode(tips_content, 1);

		setTimeout(() => {tips.style.display = 'block';}, 5000);
	}
})()

function disabelTips(){

	let storage = window.localStorage,
		status = storage.getItem('display');

	if(status === null || status === 'true')
		storage.setItem('display', false);
	else
		storage.setItem('display', true);
}

function closeTips(){
	let element = document.getElementById('tips');
	element.parentNode.removeChild(element);
}

document.getElementById('nav-page').onclick = function(e){

  let page_buf = (e.target.id).substr(-1),
  	  number_page = Number(page_buf);

  if(e.target.id === 'page-start'){
  	number_page = page_current - 1 > 0 ?  number_page = page_current - 1: page_len;
  }
  else if(e.target.id === 'page-finish'){
  	number_page = page_current < page_len ? number_page = page_current + 1: 1;
  }
  nextPage(number_page);
}

document.onkeydown = function(e){
	if(document.getElementById('tips')){
		if(e.keyCode === 37){
			nextPage(page_current - 1 > 0 ?  number_page = page_current - 1: page_len);
		}
		else if(e.keyCode === 39){			
			nextPage(page_current < page_len ? number_page = page_current + 1: 1);
		}
		else if(e.keyCode === 27){
			closeTips();
		}		
	}
}

function nextPage(number_page){

  if(number_page){

  	document.getElementsByClassName('page')[page_current - 1].style.backgroundColor = 'rgb(41%, 41%, 41%, 0.4)';

  	let tips_content = document.getElementById('tips-content');
  	tips_content.innerHTML = "";

	addTextNode(tips_content, number_page);

  	page_current = number_page; 
  }
}

function addTextNode(tips_content, number_page){

	if(!number_page)
		number_page = 1;

	let caption = tips_content.appendChild(document.createElement('h3')),
		paragraph = tips_content.appendChild(document.createElement('p'));

	caption.appendChild(document.createTextNode(`${caption_text} № ${number_page}`));
	paragraph.appendChild(document.createTextNode(paragraph_text[number_page - 1]));

	document.getElementsByClassName('page')[number_page - 1].style.backgroundColor = 'black';
}
