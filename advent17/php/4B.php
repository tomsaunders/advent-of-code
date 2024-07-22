#!/usr/bin/env php
<?php

$in = file_get_contents('4.txt');
$tst = <<<TST
abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio
TST;

$lines = explode("\n", $in);
$valid = 0;
foreach ($lines as $line){
    $words = explode(" ", $line);
    $seen = [];
    $isValid = TRUE;
    foreach ($words as $word){
        $word = str_split($word);
        sort($word);
        $word = implode("", $word);
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