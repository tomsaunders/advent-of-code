#!/usr/bin/env php
<?php
$in = file_get_contents('input5.txt');
$line = explode("\n", $in);

// 65 = A
// 97 = a (32)

$test = "dabAcCaCBAcCcaDA";
$test = $line[0];

function reducePolymer($test){
    $prev = '';
    while ($prev !== $test){
        $prev = $test;
        for ($i = 65; $i < 91; $i++){
            $A = chr($i) . chr($i + 32);
            $Aa = chr($i + 32) . chr($i);
            $test = preg_replace("/{$A}/", '', $test, 1);
            $test = preg_replace("/{$Aa}/", '', $test, 1);
        }
    }
    return strlen($test);
}

$p1 = reducePolymer($test);
echo "Part 1 $p1\n";

$mins = [];
for ($i = 65; $i < 91; $i++){
    $new = str_replace([chr($i), chr($i+32)], '', $test);
    $x = reducePolymer($new);
    $mins[] = $x;
    // echo "Polymer without " . chr($i) . " becomes " . $x . PHP_EOL;
}
echo "Smallest is " . min($mins) . PHP_EOL;