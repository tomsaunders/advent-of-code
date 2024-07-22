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
$seen2=[];

$key = implode(":", $banks);
$steps = 0;
$step2 = 0;
while (!isset($seen[$key]) || !isset($seen2[$key])){
    // echo "Step $steps Pos $key\n";
    if (!isset($seen[$key])){
        $seen[$key] = $steps;
    } else if (!isset($seen2[$key])){
        $seen2[$key] = $steps;
        echo "Found a 2 at $steps\n";
        $f = $seen[$key];
        echo "Previously at $f\n";
        $d = $steps-$f;
        echo "Diff $d\n";
    }

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
// echo "Steps: $steps\n";
// echo "steps2: $step2\n";
// $diff = $step2-$steps;
// echo "diff: $diff\n";

