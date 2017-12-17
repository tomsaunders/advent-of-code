#!/usr/bin/env php
<?php
ini_set('memory_limit', '2G');

$in = ['A' => 512, 'B' => 191];
$f = ['A' => 16807, 'B' => 48271];
$d = 2147483647;
$size = 5000000;

$a = $in['A'];
$b = $in['B'];
$match = 0;

$as = [];
$bs = [];
while (count($as) < $size || count($bs) < $size){
    $a = $a * $f['A'] % $d;
    $b = $b * $f['B'] % $d;

    if ($a % 4 === 0) $as[] = $a;
    if ($b % 8 === 0) $bs[] = $b;
}
for ($i = 0; $i < $size; $i++){
    $a = $as[$i];
    $b = $bs[$i];

    if (substr(decbin($a), -16) === substr(decbin($b), -16)){
        $match++;
    }
}
echo "Matches: $match\n";
