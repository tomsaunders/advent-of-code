#!/usr/bin/env php
<?php

$in = file_get_contents('11.txt');
$tst = "ne,ne,s,s";

// $in = $tst;

$ins = explode(",", $in);
$moves = [
    "ne" => [1, -1],
    "se"=> [1, 0],
    "s"=> [0, 1],
    "sw"=> [-1, 1],
    "nw"=> [-1, 0],
    "n"=> [0, -1]
];

$x = 0;
$y = 0;
$furthest = 0;
foreach ($ins as $move){
    list($xx, $yy) = $moves[$move];
    $x += $xx;
    $y += $yy;
    $furthest = max((abs($x) + abs($x + $y) + abs($y)) / 2, $furthest);
}
$diff = abs($x) + abs($x + $y) + abs($y);
$diff /= 2;
echo "$diff\n";
echo "$furthest\n";