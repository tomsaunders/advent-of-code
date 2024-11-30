#!/usr/bin/php
<?php
$in = file_get_contents('2.txt');
$tst= <<<TST
5 1 9 5
7 5 3
2 4 6 8
TST;

$lines = explode("\n", $in);
$total = 0;
foreach ($lines as $line){
    $nums = explode(" ", $line);
    $check = max($nums) - min($nums);
    $total += $check;
}
echo $total;
echo "\n\n";
