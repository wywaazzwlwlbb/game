<?php
// 1.服务器名和端口号；2.用户名；3.密码
$link = @mysql_connect("localhost:3306","root","123");
if(!$link){
    echo mysql_error();
}
// 2.选择数据库
$db = @mysql_select_db("ccc");
if(!$db){
    echo mysql_error();
}
// 3.设置字符集
$utf = @mysql_query("set names utf8");
if(!$utf){
    echo mysql_error();
}

echo load();

function load(){
    $str = "";
    $q2 = mysql_query("SELECT * FROM stus");
    if($q2){
        while($arr = mysql_fetch_assoc($q2)){
            $str = $str.json_encode($arr).",";
        }
        return "[".substr($str,0,-1)."]";
    }else{
        return "1";
    }
}
?>