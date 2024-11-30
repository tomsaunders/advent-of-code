#!/usr/bin/env php
<?php
$in = file_get_contents('16.txt');
$tst = "s1,x3/4,pe/b";
$size = 16;

// $in = $tst;
// $size = 5;

$x = [];
for ($i = 0; $i < $size; $i++) $x[$i] = chr(97 + $i);
$moves = explode(",", $in);

$seen = [];
$after = [];
for ($i = 0; $i < 100; $i++){
    $key = implode('', $x);
    $after[$i] = $key;
    if (!isset($seen[$key])){
        $seen[$key] = $i;
    } else {
        $prev = $seen[$key];
        $diff = $i - $prev;
        echo "Saw $key $diff positions ago - $prev , $i\n";
        $off = 1000000000 % $diff;
        echo $after[$off];
        echo PHP_EOL;
        exit;
    }

    foreach ($moves as $move){
        $rest = substr($move, 1);
        switch ($move[0]){
            case 's':
                $n = $rest;
                $y = array_slice($x, -$n);
                $z = array_slice($x, 0, -$n);
                $x = array_merge($y, $z);

                break;
            case 'x':
                list($a, $b) = explode("/", $rest);
                $tmp = $x[$b];
                $x[$b] = $x[$a];
                $x[$a] = $tmp;

                break;
            case 'p': 
                list($a, $b) = explode("/", $rest);
                $y = array_flip($x);
                $b = $y[$b];
                $a = $y[$a];
                
                $tmp = $x[$b];
                $x[$b] = $x[$a];
                $x[$a] = $tmp;

                break;
        }
    }
}
echo implode('', $x) . PHP_EOL;