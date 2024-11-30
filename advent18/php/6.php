#!/usr/bin/env php
<?php
$in = file_get_contents('input6.txt');
$test = <<<TST
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
TST;
// $in = $test;
$lines = explode("\n", $in);

$xs = []; 
$ys = [];
$pairs = [];
$counts = [];
foreach ($lines as $line){
    list($x, $y) = explode(",", str_replace(' ', '', $line));
    $xs[] = $x;
    $ys[] = $y;
    $pairs[] = [$x, $y];
    $k = "$x $y";
    $counts[$k] = 0;
}

$minX = min($xs);
$minY = min($ys);
$maxX = max($xs);
$maxY = max($ys);

// echo "min max xy $minX $maxX $minY $maxY\n";

// foreach ($pairs as $pair) {
//     list($x, $y) = $pair;
//     $k = "$x $y";
//     if ($x == $minX || $x == $maxX || $y == $minY || $)
$within = 10000;
$w = '';
$wcount = 0;
$off = 10;
$infs = [];
for ($a = -100; $a <= 500; $a++){
    for ($b = -100; $b <= 500; $b++){
        $min = 9999;
        $minPos = '';
        $tied = false;
        $sum = 0;
        foreach ($pairs as $pair) {
            list($x, $y) = $pair;
            $k = "$x $y";
            $dist = abs($a-$x) + abs($b-$y);
            $sum += $dist;
            // echo "Checking $k at $a $b - dist is $dist\n";
            if ($dist < $min) {
                $min = $dist;
                $minPos = $k;
            } else if ($dist === $min){
                $tied = true;
                $minPos = '';
            }
        }
        if ($minPos) {
            $counts[$minPos]++;
            // echo "$minPos was closest\n";
            if ($a < $minX || $a > $maxX || $b < $minY || $b > $maxY){
                $infs[$minPos] = 1;
            }
        }
        if ($sum < $within){
            $w = $minPos;
            // echo "$a $b has dist $sum to all points and is closest to $minPos \n";
            $wcount++;
        }
    }
}

foreach ($infs as $k => $v){
    $counts[$k] = 0;
}

$max = max($counts);
$at = array_search($max, $counts);
echo "$max at $at\n";

echo "Region $w is close to all and has size " . $wcount . "\n";