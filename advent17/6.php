#!/usr/bin/env php
<?php

$in = file_get_contents('6.txt');
$tst = <<<TST
0 2 7 0
TST;

// $in = $tst;

$in = str_replace("\t", " ", $in);
$banks = explode(" ", $in);
$c = count($banks);
$seen = [];

$key = implode(":", $banks);
$steps = 0;
while (!isset($seen[$key])){
    $seen[$key] = 1;
    // echo "Step $steps Pos $key\n";

    $max = 0;
    $first = 0;
    for ($b = 0; $b < $c; $b++){
        $blocks = $banks[$b];
        if ($blocks > $max) {
            $max = $blocks;
            $first = $b;
        }
    }
    
    $reassign = $max;
    $banks[$first] = 0;
    $next = $first;
    $next = ($next == $c-1) ? 0 : $next + 1;
    if ($next > $c) $next = 0;
    while ($reassign > 0){
        $banks[$next]++;
        $next = ($next == $c-1) ? 0 : $next + 1;
        $reassign--;
    }

    $key = implode(":", $banks);
    $steps++;
}
echo "Steps: $steps\n";

