<?php
	header('Content-Type:text/html;charset=utf-8');
	
//	登录数据库信息
	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PWD','root');
	define('DB_NAME','blog');
	
	$conn = @mysql_connect(DB_HOST,DB_USER,DB_PWD) or die('数据库连接失败:'.mysql_error());
	@mysql_select_db(DB_NAME) or die('数据库错误:'.mysql_error());
	
	//	设置字符集
	@mysql_query('SET NAMES UTF8') or die('字符集错误:'.mysql_error());
?>