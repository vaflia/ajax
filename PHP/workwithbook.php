<?php
/*
** Скрипт возварщает список категорий книг
*/

// Передаем заголовки
header('Content-type: text/plain; charset=utf-8');
header('Cache-Control: no-store, no-cache');
header('Expires: ' . date('r'));

// для коннекта используем
require_once $_SERVER['DOCUMENT_ROOT'].'/ajax/PHP/connect.php';

if ((!empty($_GET['typeoper'])) or (!empty($_POST['typeoper']))) {
MySql::GetConnection();
   if (!empty ($_GET['typeoper'])) {
       if ($_GET['typeoper']=='getCategory') {
           // Вывод категорий
           echo getChildCategories();
           $_GET['typeoper']='';
       };
   };
   if (!empty($_POST['typeoper'])) {
       if ($_POST['typeoper']=='showBooksByCat') {
           // Вывод категорий
           $cat = (int) ($_POST['category']);
           echo showBooksByCat($cat);
           $_POST['typeoper']='';
       };
   };
MySql::closeConn();
}

//функция загружает книги по категории
function showBooksByCat ($p_cat) {
    $resBooks = '';
    $sql = 'SELECT * FROM book WHERE category=' . $p_cat;
    $qry = mysql_query($sql) or die('Запрос не удался: ' . mysql_error());
    while ($row = mysql_fetch_array($qry, MYSQL_ASSOC)){
        $resBooks .= $row['author'] . '|' . $row['title'] . '|' . $row['image'] . "\n";
    }
    //if (empty($resBooks)) {$resBooks='Нету книг в данной категории';}
    return $resBooks;
};
// =============================================================================
// Рекурсивная функция, возвращает строку с категориями, входящими в указанную
// Параметры:
//     $parent - код родительской категории
//     $indent - строка, формирующая смещение символов
function getChildCategories($parent=0, $indent="")
{
    $resCat = '';
	$sql = 'SELECT * FROM category WHERE parent_id=' . $parent;
    $qry = mysql_query($sql) or die('Запрос не удался: ' . mysql_error());
	while ($row = mysql_fetch_array($qry, MYSQL_ASSOC)){
        $resCat .= $row['id'] . ':' . $indent . $row['title'] . "\n";
		$resCat .= getChildCategories($row['id'], $indent . '...');
	};
	return $resCat;
};
?>