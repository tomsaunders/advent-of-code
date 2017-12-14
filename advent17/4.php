#!/usr/bin/env php
<?php

$in = file_get_contents('4.txt');
$tst = <<<TST
aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa
TST;

$lines = explode("\n", $in);
$valid = 0;
foreach ($lines as $line){
    $words = explode(" ", $line);
    $seen = [];
    $isValid = TRUE;
    foreach ($words as $word){
        if (isset($seen[$word])) {
            $isValid = FALSE;
            break;
        }
        $seen[$word] = TRUE;
    }
    if ($isValid) {
        $valid++;
    }

}
echo "$valid\n";