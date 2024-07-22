#!/usr/bin/env php
<?php

$in = file_get_contents('5.txt');
$tst = <<<TST
0
3
0
1
-3
TST;

$instructions = explode("\n", $in);
$count = count($instructions);
$i = 0;
$step = 0;
while ($i >= 0 && $i < $count){
    $off = $instructions[$i];
    echo "$step, $i, $off\n";

    $instructions[$i]++;
    $i += $off;
    $step++;
}

echo "steps: $step\n\n";
