<?php
/**
 * Created by PhpStorm.
 * User: Admin
 * Date: 26.03.14
 * Time: 21:37
 */
header ("Content-type", "text/plain; charset=utf-8");

if (isset($_GET["delay"]))
{
    $delay=(int)$_GET["delay"];
    $currTime = time();
    while (time()<$currTime+$delay) {}
}
echo date("H:i:s");
?>
