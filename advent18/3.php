#!/usr/bin/env php
<?php
$in = file_get_contents('input3.txt');
$lines = explode("\n", $in);

$test = [
    "#1 @ 1,3: 4x4",
    "#2 @ 3,1: 4x4",
    "#3 @ 5,5: 2x2"
];

$grid = [];
$size = 1000;
for ($i = 0; $i < $size; $i++){
    $grid[] = str_pad('', $size, '.');
}

// $lines = $test;
list($overlap, $gridB) = overlap($lines, $grid);
function overlap($lines, $grid){
    $overlap = 0;
    foreach($lines as $line){
        list(, , $start, $siz) = explode(" ", $line);
        list($x, $y) = explode(",", str_replace(':','',$start));
        list($w, $h) = explode("x", str_replace(':','',$siz));

        for ($a = $y; $a < $y + $h; $a++){
            for ($b = $x; $b < $x + $w; $b++){
                if ($grid[$a][$b] === 'X'){
                    $overlap++;
                    $grid[$a][$b] = 'O';
                } else if ($grid[$a][$b] === '.') {
                    $grid[$a][$b] = 'X';
                }
            }
        }
    }
    // echo implode("\n", $grid);
    return [$overlap, $grid];
}

echo "\nOverlap part 1 $overlap\n";

foreach($lines as $line){
    list(, , $start, $siz) = explode(" ", $line);
    list($x, $y) = explode(",", str_replace(':','',$start));
    list($w, $h) = explode("x", str_replace(':','',$siz));

    $clean = true;
    for ($a = $y; $a < $y + $h; $a++){
        for ($b = $x; $b < $x + $w; $b++){
            if ($gridB[$a][$b] !== 'X'){
                $clean = false;
            }
        }
    }
    if ($clean) {
        echo "\n\n$line is clean\n\n";
    }
}