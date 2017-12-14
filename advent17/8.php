#!/usr/bin/env php
<?php

$in = file_get_contents('8.txt');
$tst = <<<TST
b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
TST;

// $in = $tst;

$lines = explode("\n", $in);

$registers = [];
function compare($a, $cmp, $b){
    switch ($cmp){
        case '>': return $a > $b;
        case '>=' : return $a >= $b;
        case '<': return $a < $b;
        case '<=': return $a <= $b;
        case '==': return $a == $b;
        case '!=': return $a != $b;
    }
    echo "UNKNOWN $a $cmp $b\n\n";
    exit;
}
$ever = 0;
foreach ($lines as $line){
    list($reg, $op, $val, $if, $cond, $comp, $cval) = explode(" ", $line);

    if (!isset($registers[$reg])) $registers[$reg] = 0;
    if (!isset($registers[$cond])) $registers[$cond] = 0;

    if (compare($registers[$cond], $comp, $cval)) {
        if ($op == 'inc') {
            $registers[$reg] += (int)$val;
        } else if ($op == 'dec') {
            $registers[$reg] -= (int)$val;
        } else {
            echo "UNKNOWN $reg $op $val\n\n";
            exit;
        }
    }
    $ever = max(array_merge($registers, [$ever]));
}
$max = max($registers);
echo "Max: $max\n";
echo "Ever: $ever\n";