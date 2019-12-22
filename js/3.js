/*清除缓存*/
function clear(){
    localStorage.clear();
    load();
}

function postaction(){
    var title = document.getElementById("title");
    if(title.value == "") {
        alert("内容不能为空");
    }else{
        var data=loadData();
        var todo={"title":title.value,"done":false};
        data.push(todo);
        saveData(data);
        var form=document.getElementById("form");
        form.reset();
        load();
    }
}
//从本地缓存中获取数据，有数据，赋值给todolist，这样刷新页面用户数据依旧存在
function loadData(){
    var collection=localStorage.getItem("todo");
    if(collection!=null){
        return JSON.parse(collection);
    }
    else return [];
}

function saveSort(){
    var todolist=document.getElementById("todolist");
    var donelist=document.getElementById("donelist");
    var ts=todolist.getElementsByTagName("p");
    var ds=donelist.getElementsByTagName("p");
    var data=[];
    for(i=0;i<ts.length; i++){
        var todo={"title":ts[i].innerHTML,"done":false};
        data.unshift(todo);
    }
    for(i=0;i<ds.length; i++){
        var todo={"title":ds[i].innerHTML,"done":true};
        data.unshift(todo);
    }
    saveData(data);
}
/*将用户数据保存至本地缓存*/
function saveData(data){
    localStorage.setItem("todo",JSON.stringify(data));
}
/*删除相应项，并加载*/
function remove(i){
    var data=loadData();
    var todo=data.splice(i,1)[0];
    saveData(data);
    load();
}
/*将数组todolist相应项的属性（“todo”或“done”）进行更新，并加载*/
function update(i,field,value){
    var data = loadData();
    var todo = data.splice(i,1)[0];
    todo[field] = value;
    data.splice(i,0,todo);
    saveData(data);
    load();
}
/*击事项触发编辑事件，将可编辑表单控件插入段落中，并将用户输入的值通过update函数对todolist数组里存储的数据进行更新*/
function edit(i)
{
    load();
    var p = document.getElementById("p-"+i);
    title = p.innerHTML;
    p.innerHTML="<input id='input-"+i+"' value='"+title+"' />";
    var input = document.getElementById("input-"+i);
    input.setSelectionRange(0,input.value.length);
    input.focus();
    input.onblur =function(){
        if(input.value.length == 0){
            p.innerHTML = title;
            alert("内容不能为空");
        }
        else{
            update(i,"title",input.value);
        }
    };
}
//将输入的数据添加至dom节点，并且根据输入数据属性("done")的值进行分类。
function load(){
    var todolist=document.getElementById("todolist");
    var donelist=document.getElementById("donelist");
    var collection=localStorage.getItem("todo");
    if(collection!=null){
        var data=JSON.parse(collection);
        var todoCount=0;
        var doneCount=0;
        var todoString="";
        var doneString="";
        for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].done){
                doneString+="<li draggable='true'><input type='checkbox' onchange='update("+i+",\"done\",false)' checked='checked' />"
                    +"<p id='p-"+i+"' onclick='edit("+i+")'>"+data[i].title+"</p>"
                    +"<a href='javascript:remove("+i+")'>-</a></li>";
                doneCount++;
            }
            else{
                todoString+="<li draggable='true'><input type='checkbox' onchange='update("+i+",\"done\",true)' />"
                    +"<p id='p-"+i+"' onclick='edit("+i+")'>"+data[i].title+"</p>"
                    +"<a href='javascript:remove("+i+")'>-</a></li>";
                todoCount++;
            }
        };
        todocount.innerHTML=todoCount;
        todolist.innerHTML=todoString;
        donecount.innerHTML=doneCount;
        donelist.innerHTML=doneString;
    }
    else{
        todocount.innerHTML=0;
        todolist.innerHTML="";
        donecount.innerHTML=0;
        donelist.innerHTML="";
    }

    var lis=todolist.querySelectorAll('ol li');
    [].forEach.call(lis, function(li) {
        li.addEventListener('dragstart', handleDragStart, false);
        li.addEventListener('dragover', handleDragOver, false);
        li.addEventListener('drop', handleDrop, false);

        onmouseout =function(){
            saveSort();
        };
    });
}

var dragSrcEl = null;
function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
}
/*一系列事件的监听*/
window.onload=load;
window.addEventListener("storage",load,false);
document.getElementById("clearbutton").onclick = clear;