<?php
/**
 * Created by PhpStorm.
 * User: Admin
 * Date: 26.03.14
 * Time: 21:37
 */
header ("Content-type: text/plain; charset=utf-8");
header ("Content-Control: no-store");

if (isset($_GET["delay"]))
{
    $delay=(int)$_GET["delay"];
    $currTime = time();
    while (time()<$currTime+$delay) {}
}
date("H:i:s");
?>
