#!/usr/bin/env php
<?php
$in = file_get_contents('input1.txt');

$f = 0;

$lines = explode("\n", $in);
foreach($lines as $line){
    $f += (int)$line;
}

echo "Part One: ";
echo $f;
echo PHP_EOL;


function getTwice($lines){
    $f = 0;
    $seen = [];
    $l = 0;
    $i = 0;
    while($l < 999){
        $line = $lines[$i++];
        $f += (int)$line;
        if (isset($seen[$f])){
            return " reached $f twice first on loop $l\n";
            break;
        } else {
            $seen[$f] = 1;
        }

        if ($i === count($lines)){
            $i = 0;
            $l++;
            // echo "Loop $l\n";
        }
    }
}

echo "Test stuff\n";
echo "+1, -1" . getTwice(["+1", "-1"]);
echo "+3, +3, +4, -2, -4 " . getTwice(["+3", "+3", "+4", "-2", "-4"]);
echo "-6, +3, +8, +5, -6" . getTwice(["-6", "+3", "+8", "+5", "-6"]);
echo "+7, +7, -2, -7, -4" . getTwice(["+7", "+7", "-2", "-7", "-4"]);

echo "\n\nInput gives " . getTwice($lines);