<?php
/**
 * Created by PhpStorm.
 * User: Admin
 * Date: 29.03.14
 * Time: 22:11
 */
class MySql
{
    static protected $SqlConnection = null;
    static function GetConnection()
    {
        if (self::$SqlConnection === null)
        {
            @require_once $_SERVER['DOCUMENT_ROOT'].'/ajax/PHP/core/config_db.php';
            if (!@$link = mysql_connect($mysql['host'], $mysql['user'], $mysql['pass']))
            {
                exit('not connect db');
            }
            if (!@mysql_select_db($database['db_ajax'],$link))
            {
                exit('not select db');
            }
            mysql_set_charset("utf8");
        }
        return self::$SqlConnection=true;
    }
}
$result = '';
$result=MySql::GetConnection();
if ($result) {
  echo 'успешное соединение!';
} else echo 'не удалось соединиться с базой.';
?>