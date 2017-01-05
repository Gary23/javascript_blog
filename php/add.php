<?php
	require 'config.php';
	$_brithday = $_POST['year'].'-'.$_POST['month'].'-'.$_POST['day'];
	
	$query = "INSERT INTO blog_user(user,pwd,ques,ans,email,brithday,ps)
								VALUES('{$_POST['user']}',sha1('{$_POST['pwd']}'),'{$_POST['ques']}','{$_POST['ans']}','{$_POST['email']}','{$_brithday}','{$_POST['ps']}')";

	
	mysql_query($query)or die('新增失败:'.mysql_error());
	
//	sleep(2);
	echo mysql_affected_rows();
	
	mysql_close();
?>