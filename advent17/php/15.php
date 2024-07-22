#!/usr/bin/env php
<?php

$in = ['A' => 512, 'B' => 191];
$f = ['A' => 16807, 'B' => 48271];
$d = 2147483647;
$size = 40000000;

//tst
// $in = ['A' => 65, 'B' => 8921];
// $size = 5;

$a = $in['A'];
$b = $in['B'];
$match = 0;
for ($i = 0; $i < $size; $i++){
    $a = $a * $f['A'] % $d;
    $b = $b * $f['B'] % $d;
    if (substr(decbin($a), -16) === substr(decbin($b), -16)){
        $match++;
    }
}
echo "Matches: $match\n";
