<?php
/**
 * Created by PhpStorm.
 * User: mihail
 * Date: 28.03.14
 * Time: 10:41
 * сценарий возвращает число книг,
 *      найденных в списке или название указанной книги
 */
define ('BOOK_FILE','http://localhost/ajax/files/books.txt');
define ('NUM','num'); //NUM = переданный параметр

header ('Content-type: text/plain; charset=utf-8');
header ('Cache-control: no-store, no-cache');
header ('Expires: '. date("r"));

//чтение файла
$books = file(BOOK_FILE);
if (!empty($_GET[NUM])) {
    $num = ((int) $_GET[NUM])-1;
    if ($num < count($books) && $num >= -1) {
         echo $books[$num];
    } else echo 'Книга не найдена';
} else { //если не указан параметр
    echo "Всего книг: ".count($books);
}
?>