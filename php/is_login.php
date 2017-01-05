<?php
	require 'config.php';
	
	$_pwd = sha1($_POST['pwd']);
	
	$query = mysql_query("SELECT user FROM blog_user WHERE user='{$_POST['user']}' AND pwd='{$_pwd}'") or die('SQL错误!');
	
	if (mysql_fetch_array($query, MYSQL_ASSOC)){	
				// 说明用户名和密码正确
		echo 0; 
	} else {
				// 用户名和密码不正确
		echo 1;
	}
	
	mysql_close();
?>