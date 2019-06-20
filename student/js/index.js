function Project(options){
	this.left = options.left;
		this.right = options.right;
		this.pageCont = options.pageCont;
		this.list = options.list;
		this.url = options.url;
		this.num = options.num;
		this.active = options.active;
		this.index = 0;
    // 1.选标签
    this.send = document.getElementById("send");
    this.name = document.getElementById("name");
    this.sex = document.getElementById("sex");
    this.course = document.getElementById("course");
    this.cla = document.getElementById("cla");
    this.tel = document.getElementById("tel");
    
    this.tbody = document.querySelector("tbody");
    this.add = document.getElementById("add");

    // 2.预制url
    this.insertUrl = "php/insert.php";
    this.selectUrl = "php/select.php";
    this.updateUrl = "php/update.php";
    this.deleteUrl = "php/delete.php";
    this.type = 1;

    this.id = null;

    this.init()
    this.load()
}
Project.prototype.load = function(){
	var that = this;
	ajaxGet(this.selectUrl).then(function(res){
		that.res = JSON.parse(res);
		that.createPage()
		that.display()
	},function(code){
		console.log("不好意思，请求失败了，错误代码是："+code);
	})
}
Project.prototype.init = function(){
    var that = this;
    this.add.addEventListener("click",function(){
        that.type = 1;
        that.name.value = "";
        that.sex.value = "";
        that.course.value = "";
        that.cla.value = "";
        that.tel.value = "";
        
    })
    this.tbody.addEventListener("click",function(eve){
        var e = eve ||window.event;
        var target = e.target || e.srcElement;
        if(target.getAttribute("cl") === "del"){
	            that.id = target.parentNode.getAttribute("myid");
	            that.deleteload();
	        }
        else if(target.getAttribute("liyang") === "myset"){
            that.type = 2;
            that.name.value = target.parentNode.parentNode.children[1].innerHTML;
            that.sex.value = target.parentNode.parentNode.children[2].innerHTML;
            that.course.value = target.parentNode.parentNode.children[3].innerHTML;
            that.cla.value = target.parentNode.parentNode.children[4].innerHTML;
            that.tel.value = target.parentNode.parentNode.children[5].innerHTML;
            that.id = target.parentNode.getAttribute("myid");
    	}
    })
    this.send.onclick = function(){
        if(that.type == 1){
            that.insertLoad()
        }else{
            that.updateLoad()
        }
    }
}

Project.prototype.updateLoad = function(){
    var that = this;
    ajaxPost(this.updateUrl,{
        name:that.name.value,
        sex:that.sex.value,
        course:that.course.value,
        cla:that.cla.value,
        tel:that.tel.value,
        id:that.id
    }).then(function(res){
        if(res != 1){
            that.res = JSON.parse(res);
            that.display();
        }else{
            console.log("修改失败");
        }
    })
}
Project.prototype.deleteload = function(){
    var that = this;
    ajaxPost(this.deleteUrl,{
        id:that.id
    }).then(function(res){
        if(res != 1){
            that.res = JSON.parse(res);
//          that.createPage();
            that.setActive();
            that.display();
        }else{
            console.log("删除失败");
        }
    })
}
Project.prototype.insertLoad = function(){
    var that = this;
    ajaxPost(this.insertUrl,{
        name:this.name.value,
        sex:this.sex.value,
        course:this.course.value,
        cla:this.cla.value,
        tel:this.tel.value
        
    }).then(function(res){
        switch(res){
            case "1":
                console.log("存成功，读失败")
                break;
            case "2":
                console.log("存失败，没有读")
                break;
            default:
                that.res = JSON.parse(res);
                that.display();
                that.createPage();
        }
    })
}

	Project.prototype.createPage = function(){
		// 5-1.准备创建页码，计算页码
		this.maxPage = Math.ceil(this.res.length/this.num)
		var str = ""
		for(var i=0;i<this.maxPage;i++){
			str += `<li>${i+1}</li>`
		}
		this.pageCont.innerHTML = str;
		// 6.准备设置页码的当前项
		this.setActive()
		// 9.准备上一页和下一页绑定事件
        this.addEvent()
	}
	
	Project.prototype.display = function(){
		var str = "";
		for(var i=this.index*this.num;i<this.index*this.num+this.num;i++){
             if(i<this.res.length){
                    str += `<tr>
                    <td>${this.res[i].id}</td>
                    <td>${this.res[i].name}</td>
                    <td>${this.res[i].sex}</td>
                    <td>${this.res[i].course}</td>
                    <td>${this.res[i].cla}</td>
                    <td>${this.res[i].tel}</td>
                    
                    <td myid="${this.res[i].id}"><button type="button" class="btn bg-info" cl="del">删除</button></td>
                    <td myid="${this.res[i].id}"><button type="button" class="btn btn-primary" liyang="myset" data-toggle="modal" data-target="#exampleModal" data-whatever="@fat">修改</button></td>
                </tr>`
   			 }
		}
		this.tbody.innerHTML= str;
//		console.log(this.tbody.innerHTML);
	}
	Project.prototype.setActive = function(){
		for(var i=0;i<this.pageCont.children.length;i++){
			this.pageCont.children[i].className = ""
		}
		this.pageCont.children[this.index].className = this.active;
	}
    Project.prototype.addEvent = function(){
        var that = this;
        this.left.onclick = function(){
            if(that.index == 0){
                that.index = that.maxPage - 1;
            }else{
                that.index--
            }
            that.display()
            that.setActive()
        }
        this.right.onclick = function(){
            if(that.index == that.maxPage - 1){
                that.index = 0;
            }else{
                that.index++
            }
            that.display()
            that.setActive()
        }
    }

new Project({
		left:document.getElementById("btnL"),
		right:document.getElementById("btnR"),
		pageCont:document.getElementById("page"),
		list:document.getElementById("list"),
		num:2,
		active:"active"
	})