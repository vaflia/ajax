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
    static protected $SqlClose = null;
    static protected $Link = null;
    static function GetConnection()
    {
        if (self::$SqlConnection === null)
        {
            @require_once $_SERVER['DOCUMENT_ROOT'].'/ajax/PHP/core/config_db.php';
            if (!self::$Link = mysql_connect($mysql['host'], $mysql['user'], $mysql['pass']))
            {
                exit('not connect db');
            }
            if (!@mysql_select_db($database['db_ajax'],self::$Link))
            {
                exit('not select db');
            }
            mysql_set_charset("utf8");
        }
        return self::$SqlConnection=true;
    }
    static function closeConn () {
        if (mysql_close(self::$Link)) {
            return self::$SqlClose=true;
        } else return self::$SqlClose=false;
    }
}
/*$result = '';
$result=MySql::GetConnection();
if ($result) {
  echo 'успешное соединение!';
} else echo 'не удалось соединиться с базой.';*/
?>