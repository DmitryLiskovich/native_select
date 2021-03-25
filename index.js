class SimpleSelect {
	constructor(element, options={chekbox: true, selectAll: 'All'}) {
		this.options = options;
		this.element = element;
		this.ul = this.element.querySelector('ul');
		this.li = this.element.querySelectorAll('li');
		
		if(this.options.selectAll) {
			const first = this.li[0].cloneNode(true)
			const check = first.querySelector('input');
			first.dataset.index = 'default';
			first.dataset.helper = true;
			first.innerHTML = '';
			first.append(check);
			first.append(this.options.selectAll);
			console.log(first.innerText);
			this.ul.insertBefore(first, this.li[0]);
		}
		
		this.li = this.element.querySelectorAll('li');
		this.elements = {items: {}};

		const changeItems = new CustomEvent("listchange", {"bubbles":true, "cancelable":false, "detail": this.elements.items});
		
		this.checkPosition();
		
		Array.prototype.forEach.call(this.li, (li,id)=>{
			const element = this.elements.items;
			const index = li.dataset.index;
			if(this.options.chekbox) {
				element[index] = {selected: true, element: li}
				element[index].element.querySelector('input').checked = 
				element[index].selected;
			} else {
				if(id === 0) {
					li.classList.add('selected');
					element[index] = {selected: true, element: li}
					this.elements.lastSelected = element[index];
				} else {
					element[index] = {selected: false, element: li}
				}
			}
			
			li.addEventListener('click', (e) => {
				e.stopPropagation();
			})
			
			li.addEventListener('mouseup', () => {
				if(id === 0) {
					this.checkAll();
				} else {
					this.selectItem(li.dataset.index);
				}
				li.classList.remove('pressed');
				this.checkSelectedAll();
				this.ul.dispatchEvent(changeItems);
			})

			li.addEventListener('mousedown', (e) => {
				this.underHover(li, 'pressed');
			})

			li.addEventListener('mouseover', (e) => {
				this.underHover(li, 'over');
			})

			li.addEventListener('mouseout', (e) => {
				this.underHover(li, 'out');
			})
		});

		this.element.addEventListener('click', () => {
			this.open();
		})
	}

	checkAll() {
		const main = this.elements.items[this.li[0].dataset.index];
		main.selected = !main.selected;
		
		Array.prototype.forEach.call(this.li, (li,id)=>{
			const link = li.dataset.index;
			this.selectItem(link, main.selected);
		})
	}

	underHover(item, type) {
		if(type === 'over') {
			item.classList.add('hover');
		} else if (type === 'pressed') {
			item.classList.add('pressed');
		} else {
			item.classList.remove('hover');
		}
	}

	checkSelectedAll() {
		this.elements.allSelected = Object.values(this.elements.items).every((item) => item.element.dataset.helper || item.selected);
		this.elements.selectedCount = Object.values(this.elements.items).reduce((acc, item) => item.selected ? acc += 1 : acc , 0);
		if(this.options.selectAll) {
			this.selectItem(this.li[0].dataset.index, this.elements.allSelected);
		}
	}

	selectItem(id, value) {
		const element = this.elements.items;

		if(!this.options.chekbox) {
			this.elements.lastSelected.selected = false
			this.elements.lastSelected.element.classList.remove('selected');
			element[id].selected = true;
		} else {
			element[id].selected = value !== undefined ? value : !element[id].selected;
			element[id].element.querySelector('input').checked = value !== undefined ? value : element[id].selected
		}
		element[id].element.classList.add('selected');
		this.elements.lastSelected = element[id];
	}

	open() {
		this.ul.classList.toggle('open');
	}

	checkPosition() {
		const screenHeightHalf = window.innerHeight/2;
		const position = this.element.getBoundingClientRect().y;

		if(position > screenHeightHalf) {
			this.ul.classList.remove('down');
			this.ul.classList.add('up');
		} else {
			this.ul.classList.add('down');
			this.ul.classList.remove('up');
		}
	}
}

new SimpleSelect(document.querySelector('.select'));