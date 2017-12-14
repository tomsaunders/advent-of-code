<?php

$in = file_get_contents('9.txt');
$tst = <<<TST

TST;
$in = $tst;
$lines = explode("\n", $in);