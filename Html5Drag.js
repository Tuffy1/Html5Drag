let moduleDrag = (function() {
	return {
		el: {},
		events: function() {
			let self = this;
			let el = self.el;
			//元素
			let module = el.module;
			let modlderDel = el.modlderDel;
			let modlderShow = el.modlderShow;
			let lis = module.find('li');
			let elDrag = null;	//拖拽对象
			module.delegate('li', {		//监听左侧图片是否被拖拽
				dragstart: function(event) {	//左侧图片被拖拽开始
					let li = $(this);
					elDrag = li;
					event.originalEvent.dataTransfer.setData('text', event.target.id);
				},
				dragend: function(event) {
					elDrag = null;
					event.preventDefault();
				}
			});
			modlderDel.on({		//（拖拽目的地是垃圾桶）监听放置
				dragover: function() {	//当拖拽物体经过放置位置时
					event.preventDefault();
				},
				dragenter: function() {
					modlderDel.css('background-color', '#ccc');
				},
				drop: function() {	//当拖拽物体被释放在该位置时
					let url = elDrag && elDrag.find('img').data('url');
					self.removeModule(elDrag);
					modlderDel.css('background-color', '#fff');
				}
			});
			modlderShow.on({	//（拖拽目的地是展示框）监听放置
				dragover: function() {
					event.preventDefault();
				},
				dragenter: function() {
				},
				drop: function() {
					let url = elDrag && elDrag.find('img').data('url');
					self.insertModule(url)
				}
			});
			let pos = {};
			document.addEventListener('dragover', function(event) {	//实时监听鼠标位置
				pos.y = event.pageY;
			}, false);
			let updown = 0;
			module.delegate('li', {		//（拖拽目的地是其他图片位置，即交换图片位置）监听放置
				dragover: function() {
					let current = $(this);	//被替换目标
					let centerY = current.offset().top + current.height() * 0.5;
					if(typeof pos.y != 'number') {return ;}
					if(!elDrag) {return ;}
					if(pos.y <= centerY) {	//上半区还是下半区
						updown = 0;
					} else {
						updown = 1;
					}
					event.preventDefault();
				},
				dragenter: function() {

				},
				drop: function() {
					// $(this).remove();
					self.insert(elDrag, $(this), updown);
				}
			})
		},
		insertModule: function(url) {
			let self = this;
			let el = self.el;
			let modlderShow = el.modlderShow;
			modlderShow.empty();
			modlderShow.append('<img src="'+url+'">')
		},
		removeModule: function(elDrag) {
			elDrag.remove();
		},
		insert: function(elDrag, that, updown) {
			elDrag.remove();
			if(updown) {
				that.after(elDrag);
			} else {
				that.before(elDrag);
			}
		},
	
		init: function(){
			let self = this;
			self.el = $.extend(self.el, {
				module: $('#module'),
				remove: $('#moduleRemove'),
				body: $('#moduleBody'),
				stage: $('#moduleStage'),
				modlderDel: $('#trash'),	//垃圾桶（被放置位置）
				modlderShow: $('#modulePlaHd')	//右侧显示框（被放置位置）
			});
			self.events();
		}
	};
	// }
})();
moduleDrag.init();
