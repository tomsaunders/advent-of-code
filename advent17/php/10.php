<?php

$in = file_get_contents('10.txt');
$tst = "3, 4, 1, 5";
$size = 256; 

// $in = $tst;
// $size = 5;

$lengths = explode(",", $in);

$pos = 0;
$skip = 0;

$numbers = [];
for ($n = 0; $n < $size; $n++) $numbers[] = $n;

while (count($lengths) > 0){
    $len = array_shift($lengths);
    // echo "\nNumbers : " . implode(", ", $numbers);

    $old = $numbers;
    for ($i = 0; $i < $len; $i++){
        $takeFrom = ($pos + $len - $i - 1) % $size;
        $giveTo = ($i + $pos) % $size;
        $numbers[$giveTo] = $old[$takeFrom];
    }

    $pos += $skip + $len;
    $pos %= $size;
    $skip++;
}

$a = $numbers[0];
$b = $numbers[1];
$m = $a * $b;
echo "\n$a x $b = $m\n";