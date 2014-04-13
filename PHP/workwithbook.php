<?php
/*
** Скрипт возварщает список категорий книг
*/

/*isset() проверяет существование переменной или члена массива, и,
  не зависимо от значения внутри, возвратит true. то есть если переменная определена и имеет пусто значение x='',
тогда isset(x)=true!!! но empty(x)=true - то есть она определена но пустая.
empty() - переменная отсутствует или равна false (нестрого)
!empty() - переменная существовует И равна true (нестрого).
*/

// Передаем заголовки
header('Content-type: text/plain; charset=utf-8');
header('Cache-Control: no-store, no-cache');
header('Expires: ' . date('r'));

// для коннекта используем
require_once $_SERVER['DOCUMENT_ROOT'].'/ajax/PHP/connect.php';

if ((!empty($_GET['typeoper'])) or (!empty($_POST['typeoper']))) {
MySql::GetConnection();
   if ((!empty($_GET['typeoper'])) and ($_SERVER['REQUEST_METHOD']=='GET')) {
       if ($_GET['typeoper']=='getCategory') {
           // Вывод категорий
           echo getChildCategories();
           $_GET['typeoper']='';
       };
   };
   if ((!empty($_POST['typeoper'])) and ($_SERVER['REQUEST_METHOD']=='POST')) {
       if ($_POST['typeoper']=='showBooksByCat') {
           // Вывод категорий
           $cat = (int) ($_POST['category']);
           echo showBooksByCat($cat);
           $_POST['typeoper']='';
       } elseif ($_POST['typeoper']=='searchBook') {
           if ((!empty($_POST['title'])) or (!empty($_POST['author']))) {
               $author = mysql_real_escape_string($_POST['author']);
               $title = mysql_real_escape_string($_POST['title']);
               echo searchBooks($title,$author);
           }//else echo '';
       }
   };

    if ((!empty($_POST['typeoper'])) and ($_SERVER['REQUEST_METHOD']=='POST')) {
        if ($_POST['typeoper']=='showBooksByCatAjax') {
            // Вывод категорий
            $cat = (int) ($_POST['category']);
            echo json_encode(showBooksByCatAjax($cat));
            $_POST['typeoper']='';
        } elseif ($_POST['typeoper']=='searchBook') {
            if ((!empty($_POST['title'])) or (!empty($_POST['author']))) {
                $author = mysql_real_escape_string($_POST['author']);
                $title = mysql_real_escape_string($_POST['title']);
                echo searchBooks($title,$author);
            }//else echo '';
        }
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
//функция загружает книги в JSON по категории
function showBooksByCatAjax ($p_cat) {
    $books = array();
    class Book {
        public $author;
        public $title;
        public $image;
        public function __construct($title='', $author='', $image=''){
            $this->title = $title;
            $this->author = $author;
            $this->image = $image;
        }
    }
    $sql = 'SELECT * FROM book WHERE category=' . $p_cat;
    $qry = mysql_query($sql) or die('Запрос не удался: ' . mysql_error());
    while ($row = mysql_fetch_array($qry, MYSQL_ASSOC)){
        $books[]= new Book($row['title'], $row['author'], $row['image']);
    }
    return $books;
};

//функция производит поиск книг
function searchBooks ($title,$author) {
    $resBooks = '';
    $sql = 'SELECT * FROM book WHERE title like \'%'.$title.'%\' and author like \'%'.$author.'%\' ';
    $qry = mysql_query($sql) or die('Запрос не удался: ' . mysql_error());
    while ($row = mysql_fetch_array($qry, MYSQL_ASSOC)){
        $resBooks .= $row['author'] . '|' . $row['title'] . '|' . $row['image'] . "\n";
    }
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