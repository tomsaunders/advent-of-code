#!/usr/bin/env php
<?php

$in = file_get_contents('13.txt');
$tst = <<<TST
0: 3
1: 2
4: 4
6: 4
TST;

// $in = $tst;

$lines = explode("\n", $in);
$layers = [];
$max = 0;
foreach ($lines as $line){
    list($layer, $depth) = explode(": ", $line);
    $layers[$layer] = $depth;
    $max = $layer;
}

$severity = 1;
$d = -1;
while ($severity){
    $d++;
    $severity = 0;
    for ($s = 0; $s <= $max; $s++){
        $depth = isset($layers[$s]) ? $layers[$s] : 999999999999999;
        $keyPos = $depth * 2 - 2;
        if (($s + $d) % $keyPos === 0) {
            // echo "Caught at time $s , layer of depth $depth key $keyPos\n";
            $severity += $s * $depth;
            // break; //partB
        } else {
            // echo "Okay at $s depth $depth key $keyPos\n";
        }
    }
}
echo "Delay $d Sev $severity \n";

echo "other\n";

$d = 0;
$seek = TRUE;
while ($seek){
    $seek = false;
    foreach ($layers as $depth => $range){
        $range = $range*2-2;
        if (($d + $depth) % $range === 0) {
            $d++;
            $seek = true;
            break;
        }
    }
}
echo $d;
echo "\n";